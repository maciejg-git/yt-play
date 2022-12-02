import { ref, onMounted, watch, reactive, computed } from "vue";
import axios from "axios";
import { createUrl } from "./tools.js";
import useStore from "./use-store.js";

// let googleApiRemote = "https://youtube-vue-server.herokuapp.com/youtubevue/";
// let googleApiRemote = "http://localhost:3001/youtubevue/";
let googleApiRemote = "https://yt-play-server.onrender.com/youtubevue/";

let _commentsNextPageToken = null;
let _searchNextPageToken = null;
let _searchLast = "";
let playlists = ref([]);
let channelPlaylists = ref([]);
let searchRes = ref([]);
let comments = ref([]);
let regexpTime = /[0-9]?[0-9]?:?[0-9]?[0-9]:[0-9][0-9]/gi;

let state = useStore();

// YOUTUBE API

async function getPlaylistRemote(playlist, nextPage) {
  if (nextPage && !playlist.nextPageToken) return;

  let query = {
    id: playlist.id,
  };
  if (nextPage && playlist.nextPageToken) {
    query.nextPageToken = playlist.nextPageToken;
  }
  let queryUrl = createUrl(googleApiRemote + "playlist?", query);

  playlist.nextPageToken = null;

  playlist.isLoading = true;

  try {
    let res = await axios.get(queryUrl);

    res.data.items.map((item) => {
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
      res.data.items.filter(
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
    playlist.results = res.data.pageInfo.totalResults;

    playlist.nextPageToken = res.data.nextPageToken;
  } catch (err) {
    if (err.response.status == 404) {
      playlist.error = `Playlist ${playlist.id} not found.`;
    }
  } finally {
    playlist.isLoading = false;
  }
}

async function _getPlaylistPropertiesRemote(playlist) {
  let query = {
    id: playlist.id,
  };
  let queryUrl = createUrl(googleApiRemote + "playlists?", query);

  try {
    let res = await axios.get(queryUrl);
    playlist.title = res.data.items[0].snippet.title;
  } catch (err) {}
}

async function getChannelPlaylists(id) {
  let query = {
    part: "snippet",
    channelId: id,
    key: apiKey,
    maxResults: 50,
  };
  let queryUrl = createUrl(googleApiPlaylists, query);

  let res = await axios.get(queryUrl);

  channelPlaylists = res.data.items;

  for (let i of channelPlaylists) {
    addPlaylist(i.id, i.snippet.title);
  }
}

async function getCommentsRemote(videoId, nextPage) {
  if (nextPage && !_commentsNextPageToken) return;
  if (!nextPage) comments.value = [];

  let query = {
    id: videoId,
  };
  if (nextPage && _commentsNextPageToken) {
    query.nextPageToken = _commentsNextPageToken;
  }
  let queryUrl = createUrl(googleApiRemote + "comments?", query);
  try {
    let res = await axios.get(queryUrl);

    comments.value = comments.value.concat(res.data.items);

    _commentsNextPageToken = res.data.nextPageToken;
  } catch (err) {
    comments.value = [];
  }
}

async function searchRemote(value, nextPage) {
  _searchLast = nextPage ? _searchLast : value;
  let query = {
    q: _searchLast,
  };
  if (nextPage && _searchNextPageToken) {
    query.nextPageToken = _searchNextPageToken;
  }
  let queryUrl = createUrl(googleApiRemote + "search?", query);

  let res = await axios.get(queryUrl);

  searchRes.value = searchRes.value.concat(
    res.data.items.filter((item) => item.id.kind == "youtube#video")
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
  let pl = loadPlaylists();
  for (let p of pl) {
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

function findPlaylistIndex(playlist) {
  return playlists.value.findIndex((item) => item == playlist);
}

function findVideoIndex(playlist, video) {
  return playlist.items.findIndex((item) => item.snippet == video);
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
