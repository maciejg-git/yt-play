<template>
    <div class="playlist-header d-flex align-items-center pl-3 py-2 mb-1">
        <span class="fw-bold">
          Search
          <span class="badge bg-secondary ml-1">
            {{ items.length }}
          </span>
        </span>
        <div class="ml-auto">
          <div class="dropdown">
            <i class="mdi mdi-dots-vertical" style="font-size: 1.45em" data-toggle="dropdown"></i>
            <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
              <li>
                <a @click.prvent="handleCloseSearch" class="dropdown-item" href="#">
                  <i class="mdi mdi-close mdi-dropdown-icon pr-1"></i>
                  Close search
                </a>
            </li>
            </ul>
          </div>
        </div>
    </div>
    <div v-scroll="handleScroll" class="playlist-div playlist">
      <ul class="list-unstyled p-3">
        <li 
          v-for="(item, index) in items" 
          @click="handleClickPlaylistItem(item)" 
          class="playlist-item text-truncate p-1" 
          :class="classListPlaylistItem(item)"
          >
          <img 
            :src="item.snippet.thumbnails.default ? item.snippet.thumbnails.default.url : ''" 
            class="pr-2" 
            :width="thumbnailWidth" 
            :height="thumbnailHeight" 
            alt=""
            >
          {{ item.snippet.title }}
        </li>
      </ul>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import useYoutube from '../use-youtube'
import useYoutubePlayer from '../use-youtube-player'
import useUI from '../use-UI'
import useStore from '../use-store'

export default {
  props: {
    items: Array,
  },
  setup(props) {

    // COMPOSITION

    let { 
      move,
      searchRemote,
      removeSearch, 
    } = useYoutube();

    let { 
      currentVideo, 
      play,
      loadVideo,
    } = useYoutubePlayer();

    let {
      thumbnailWidth,
      thumbnailHeight,
    } = useUI();

    let state = useStore();

    // COMPUTED

    let filteredPlaylist = computed(() => {
      let regexp = new RegExp(state.filter, "i");
      return props.playlist.items.filter(item => item.snippet.title.search(regexp) >= 0);
    })

    // METHODS

    function classListPlaylistItem(item) {
      return {
        'fw-bold': item.snippet == currentVideo.value,
        'playlist-item-play': item.snippet == currentVideo.value,
      }
    } 

    function handleScroll(ev) {
      if (ev.target.scrollTop >= ev.target.scrollHeight - ev.target.offsetHeight) {
        searchRemote(null, true);
      }
    }

    function handleCloseSearch() {
      removeSearch();
    }

    function handleClickPlaylistItem(video) {
      if (video != currentVideo.value) {
        loadVideo(video.snippet);
        play();
      }
    }

    return {
      currentVideo,
      filteredPlaylist,
      move,
      play,
      handleClickPlaylistItem,
      handleCloseSearch,
      handleScroll,
      thumbnailWidth,
      thumbnailHeight,
      classListPlaylistItem,
    }
  }
}
</script>

<style scoped lang="scss">
/* @import '../theme.scss'; */
@import '../../node_modules/bootstrap/scss/bootstrap.scss';

.playlist-div {
  max-height: 70vh;
  overflow-y: scroll;
}
.playlist-header {
  font-size: 1.2em;
}
.playlist-item {
  cursor: pointer;
}
.playlist-item:hover {
  cursor: pointer;
  color: $dark;
  background-color: $gray-200;
}
.playlist-item-play {
  color: $dark;
  background-color: $gray-200;
}
.playlist::-webkit-scrollbar-track {
  background-color: var(--scroll-track);
}
.playlist::-webkit-scrollbar {
    width: 8px;
    background-color: var(--scroll);
}
.playlist::-webkit-scrollbar-thumb {
  background-color: var(--scroll-thumb);
}
.mdi-dropdown-icon:before {
  font-size: 1.2em;
  line-height: normal;
}
.mdi-icon-playlist:before {
  color: orange;
}

.list-enter-active {
  transition: all .3s ease;
}
.list-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.list-enter-from {
  transform: translateX(10px);
  opacity: 0;
}
.list-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
