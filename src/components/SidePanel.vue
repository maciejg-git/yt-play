<template>
  <div class="panel position-fixed top-0 end-0 px-4">
    <div class="d-flex justify-content-end w-100">
      <button 
        @click="handleCloseSideBar"
        type="button" 
        class="btn-close my-3" 
        :class="{'btn-close-white': darkTheme}"
        aria-label="Close">
      </button>
    </div>

    <input 
      v-model="playlistId" 
      type="email" 
      class="form-control form-control-sm" 
      placeholder="Playlist id"
    >
    <span 
      v-show="errorMessage"
      class="text-danger small"
    >
      {{ errorMessage }}
    </span>
    <div class="d-flex w-100 mt-2">
      <button 
        @click="handleAddPlaylist(playlistId)" 
        class="btn btn-primary btn-sm ms-auto"
      >
        Add Playlist
      </button>
    </div>

    <hr class="my-4">

    <ul class="p-0">
      <li class="d-flex align-items-center pb-2">
        <label for="checkboxCompactMode" class="form-check-label">
          Compact view
        </label>
        <input 
          v-model="compactMode" 
          type="checkbox" 
          id="checkboxCompactMode"
          class="ms-auto" 
        >
      </li>
      <li class="d-flex align-items-center py-2">
        <label 
          for="checkboxDarkMode" 
          class="form-check-label"
        >
          Dark theme
        </label>
        <input 
          v-model="darkTheme" 
          class="ms-auto"  py-2
          type="checkbox" 
          id="checkboxDarkMode"
        >
      </li>
      <li class="d-flex align-items-center py-2">
        <label 
          class="form-check-label pe-4"
        >
          Overlay opacity
        </label>
        <input 
          v-model.number="overlayOpacity" 
          type="range" 
          class="ms-auto" 
          min="0" 
          max="100" 
          step="10" 
        >
      </li>
      <li class="d-flex align-items-center py-2">
        <label 
          class="form-check-label pe-4"
        >
          Comments duration ({{ commentsDuration }}s)
        </label>
        <input 
          v-model.number="commentsDuration" 
          type="range" 
          class="ms-auto" 
          min="3" 
          max="15" 
          step="1" 
        >
      </li>
      <li class="d-flex align-items-center pt-2">
        <a href="" @click.prevent="handleExportClick">
          Export playlists as URL
        </a>
      </li>
    </ul>


    <transition name="fade-slide">
      <div 
        v-if="isExportShow"
      >

        <hr class="my-4">

        <div class="text-end">
          <textarea 
            ref="exportEl" 
            :value="exportString" 
            rows="3" 
            class="form-control w-100 mb-2"
          >
          </textarea>
          <a 
            href="" 
            @click.prevent="handleExportCopyToClipboard"
          >
            Copy to clipboard
          </a>
        </div>

        <ul class="p-0 mt-3">
          <li 
            v-for="(playlist, index) in playlists"
            class="d-flex align-items-center py-2"
          >
            <label 
              :for="'checkboxPlaylistExport' + index" 
              class="form-check-label"
            >
              <span>
                {{ playlist.title }}
                <i 
                  v-show="playlist.local" 
                  class="mdi mdi-star mdi-icon-orange"
                ></i>
              </span>
            </label>
            <input 
              v-model="playlist.isExported" 
              :id="'checkboxPlaylistExport' + index" 
              type="checkbox" 
              class="ms-auto" 
            >
          </li>
        </ul>

      </div>
    </transition>

  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import useYoutube from '../use-youtube'
import useUI from '../use-UI.js'

export default {
	setup(props) {
    let playlistId = ref('');
    let exportEl = ref(null);
    let isExportShow = ref(false);
    let errorMessage = ref('');
    let appUrl = "https://ytplay.netlify.app"

    let { 
      playlists,
      addPlaylistToPlaylists, 
    } = useYoutube();

    let { 
      toggleSidePanel, 
      compactMode,
      setCompact,
      darkTheme,
      overlayOpacity,
      commentsDuration,
    } = useUI();

    watch(playlistId, () => {
      errorMessage.value = '';
    })

    let exportString = computed(() => {
      let playlistsId = playlists.value
        .filter(item => item.isExported)
        .map(item => item.id)
      return `${appUrl}/playlist/${playlistsId.join(',')}`
    });

    function handleExportCopyToClipboard() {
      exportEl.value.select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    }

    async function handleAddPlaylist(playlistsId) {
      try {
        await addPlaylistToPlaylists(playlistsId);
      } catch (err) {
        errorMessage.value = err;
      }
    }

    function handleExportClick() {
      isExportShow.value = !isExportShow.value;
    }
		
    function handleCloseSideBar() {
      toggleSidePanel()
    }

		return {
      compactMode,
      setCompact,
      darkTheme,
      overlayOpacity,
      commentsDuration,
		  handleCloseSideBar,
		  handleExportCopyToClipboard,
		  handleExportClick,
		  handleAddPlaylist,
		  playlistId,
		  addPlaylistToPlaylists,
		  playlists,
		  exportString,
		  exportEl,
		  isExportShow,
		  errorMessage,
		}
	}
}
</script>

<style scoped>
.panel {
  width: 30em;
  height: 100vh;
  background-color: var(--background-side-panel);
  -webkit-box-shadow: -10px 0px 12px -12px rgba(0,0,0,0.5);
  -moz-box-shadow: -10px 0px 12px -12px rgba(0,0,0,0.5);
  box-shadow: -10px 0px 12px -12px rgba(0,0,0,0.5);
  overflow-y: auto;
  z-index: 1200;
}

input[type=checkbox] {
  transform: scale(1.25);
}

.mdi-icon-orange:before {
  color: orange;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all .3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0 !important;
  transform: translateY(-20px);
}
</style>
