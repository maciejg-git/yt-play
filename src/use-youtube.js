import { ref, reactive, computed } from "vue";
import useStore from "./use-store.js";

// let googleApiRemote = "https://youtube-vue-server.herokuapp.com/youtubevue/";
// let googleApiRemote = "http://localhost:3001/youtubevue/";
// let googleApiRemote = "https://yt-play-server.onrender.com/youtubevue/";
let googleApiRemote = "https://ytplay-koa.onrender.com/ytplay/";

let _commentsNextPageToken = null;
let _searchNextPageToken = null;
let _searchLast = "";
let playlists = ref([]);
let channelPlaylists = ref([]);
let searchRes = ref([]);
let comments = ref([]);
let regexpTime = /[0-9]?[0-9]?:?[0-9]?[0-9]:[0-9][0-9]/gi;

let state = useStore();

function findPlaylistIndex(playlist) {
  return playlists.value.findIndex((item) => item == playlist);
}

function findVideoIndex(playlist, video) {
  return playlist.items.findIndex((item) => item.snippet == video);
}

// YOUTUBE API

async function getPlaylistRemote(playlist, nextPage) {
  if (nextPage && !playlist.nextPageToken) return;

  let url = new URL("playlist", googleApiRemote)
  url.searchParams.append("id", playlist.id)
  if (nextPage && playlist.nextPageToken) {
    url.searchParams.append("nextPageToken", playlist.nextPageToken)
  }

  playlist.nextPageToken = null;

  playlist.isLoading = true;

  try {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    let data = await res.json()

    data.items.map((item) => {
      item.snippet.el = ref(null);
      item.snippet.description = item.snippet.description.replace(
        regexpTime,
        (match) => {
          return '<a href="">' + match + "</a>";
        }
      );
      return item;
    });

    playlist.items = playlist.items.concat(
      data.items.filter(
        (item) =>
          item.snippet.title != "Private video" &&
          item.snippet.title != "Deleted video"
      )
    );

    playlist.filteredItems = computed(() => {
      let regexp = new RegExp(
        state.filter.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      return playlist.items.filter(
        (item) => item.snippet.title.search(regexp) >= 0
      );
    });

    playlist.results = data.pageInfo.totalResults;

    playlist.nextPageToken = data.nextPageToken;
  } catch (err) {
    if (err.response.status == 404) {
      playlist.error = `Playlist ${playlist.id} not found.`;
    }
  } finally {
    playlist.isLoading = false;
  }
}

async function _getPlaylistPropertiesRemote(playlist) {
  let url = new URL("playlists", googleApiRemote)
  url.searchParams.append("id", playlist.id)

  try {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    let data = await res.json()
    playlist.title = data.items[0].snippet.title;
  } catch (err) {}
}

async function getChannelPlaylists(id) {
  let url = new URL("playlist", googleApiRemote)
  url.searchParams.append("part", "snippet")
  url.searchParams.append("channelId", id)
  url.searchParams.append("key", apiKey)
  url.searchParams.append("maxResults", 50)

  let res = await fetch(url);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  let data = await res.json()

  channelPlaylists = data.items;

  for (let i of channelPlaylists) {
    addPlaylist(i.id, i.snippet.title);
  }
}

async function getCommentsRemote(videoId, nextPage) {
  if (nextPage && !_commentsNextPageToken) return;
  if (!nextPage) comments.value = [];

  let url = new URL("comments", googleApiRemote)
  url.searchParams.append("id", videoId)
  if (nextPage && _commentsNextPageToken) {
    url.searchParams.append("nextPageToken", _commentsNextPageToken)
  }

  try {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    let data = await res.json()

    comments.value = comments.value.concat(data.items);

    _commentsNextPageToken = data.nextPageToken;
  } catch (err) {
    comments.value = [];
  }
}

async function searchRemote(value, nextPage) {
  _searchLast = nextPage ? _searchLast : value;

  let url = new URL("search", googleApiRemote)
  url.searchParams.append("q", _searchLast)
  if (nextPage && _searchNextPageToken) {
    url.searchParams.append("nextPageToken", _searchNextPageToken)
  }

  let res = await fetch(url);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  let data = await res.json()

  searchRes.value = searchRes.value.concat(
    data.items.filter((item) => item.id.kind == "youtube#video")
  );
  searchRes.value.map((item) => (item.snippet.resourceId = item.id));

  _searchNextPageToken = res.data.nextPageToken;
}

function addPlaylist(id, local) {
  let playlist = reactive({
    id: id,
    local: local || 0,
    title: "",
    items: [],
    filteredItems: [],
    results: 0,
    nextPageToken: null,
    isLoading: false,
    isExported: true,
    error: null,
  });

  return playlist;
}

async function addPlaylistToPlaylists(id, local) {
  if (playlistLoaded(id)) throw "Playlist already loaded";

  let playlist = addPlaylist(id, local);
  playlists.value.push(playlist);
  await getPlaylistRemote(playlist);
  await _getPlaylistPropertiesRemote(playlist);

  if (playlist.error) throw playlist.error;
}

function addSavedPlaylists() {
  let savedPlaylists = loadPlaylists();
  for (let p of savedPlaylists) {
    if (playlistLoaded(p.id)) continue;
    let playlist = addPlaylist(p.id, true);
    playlists.value.push(playlist);
    getPlaylistRemote(playlist);
    _getPlaylistPropertiesRemote(playlist);
  }
}

function addUrlPlaylists(request) {
  for (let i of request) {
    if (playlistLoaded(i)) continue;
    let playlist = addPlaylist(i);
    playlists.value.push(playlist);
    getPlaylistRemote(playlist);
    _getPlaylistPropertiesRemote(playlist);
  }
}

function removePlaylist(playlist) {
  let index = playlists.value.indexOf(playlist);
  playlists.value.splice(index, 1);
}

function reloadPlaylist(playlist) {
  let index = findPlaylistIndex(playlist);
  let reloadedPlaylist = addPlaylist(playlist.id);
  playlists.value[index] = reloadedPlaylist;
  getPlaylistRemote(reloadedPlaylist);
  _getPlaylistPropertiesRemote(reloadedPlaylist);
}

function removeSearch() {
  searchRes.value = [];
}

function move(playlist, dir) {
  let index = playlists.value.indexOf(playlist);
  if (
    (index == 0 && dir == -1) ||
    (index == playlists.value.length && dir == 1)
  )
    return;
  let to = index + dir;
  let i = playlists.value.splice(index, 1);
  playlists.value.splice(to, 0, i[0]);
}

function playlistLoaded(id) {
  for (let playlist of playlists.value) {
    if (playlist.id == id) {
      return true;
    }
  }
}

// LOCAL STORAGE

function savePlaylist(playlist) {
  let savedPlaylists = loadPlaylists();
  if (!savedPlaylists.some((item) => item.id == playlist.id)) {
    savedPlaylists.push(playlist);
    savedPlaylists = JSON.stringify(savedPlaylists, ["id", "title"], 1);
    localStorage.setItem("playlists", savedPlaylists);
  }
  playlist.local = 1;
}

function deleteSavedPlaylist(playlist) {
  let savedPlaylists = loadPlaylists();
  let index = savedPlaylists.findIndex((item) => item.id == playlist.id);
  if (index != -1) {
    savedPlaylists.splice(index, 1);
    savedPlaylists = JSON.stringify(savedPlaylists, ["id", "title"], 1);
    localStorage.setItem("playlists", savedPlaylists);
  }
  playlist.local = 0;
}

function loadPlaylists() {
  let pl = localStorage.getItem("playlists");
  pl = JSON.parse(pl);
  return pl || [];
}

export default function useYoutube() {
  return {
    playlists,
    getPlaylistRemote,
    addPlaylistToPlaylists,
    addSavedPlaylists,
    getChannelPlaylists,
    addUrlPlaylists,
    removePlaylist,
    removeSearch,
    move,
    reloadPlaylist,
    searchRemote,
    searchRes,
    comments,
    getCommentsRemote,
    findPlaylistIndex,
    findVideoIndex,
    // local
    savePlaylist,
    loadPlaylists,
    deleteSavedPlaylist,
    addPlaylist,
  };
}
