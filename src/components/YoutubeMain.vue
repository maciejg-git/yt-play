<template>
  <transition name="fade-about" mode="out-in">
    <About v-if="isAboutVisible"></About>
  </transition>

  <transition name="fade-about" mode="out-in">
    <div v-show="!isAboutVisible">
      <transition name="fade">
        <div
          v-if="playerWindowState == 2"
          class="backdrop"
          :style="{ opacity: (100 - overlayOpacity) / 100 }"
        ></div>
      </transition>

      <AppBar />

      <div
        class="row g-4 pt-1 ps-md-2 me-4 me-md-0"
        :class="'row-cols-lg-' + columns"
      >
        <div v-if="searchRes.length" class="col search">
          <YoutubeSearch :items="searchRes" />
        </div>

        <div v-for="(playlist, index) in playlists" class="col playlist">
          <YoutubePlaylist :playlist="playlist" />
        </div>
      </div>

      <transition name="fade-comment" mode="out-in">
        <YoutubeComments
          v-show="comments.length && showComments && showCommentsPause"
        />
      </transition>

      <div :style="styleBottomMargin"></div>
    </div>
  </transition>
</template>

<script>
import { computed, onMounted } from "vue";
import AppBar from "./AppBar.vue";
import YoutubePlaylist from "./YoutubePlaylist.vue";
import YoutubeSearch from "./YoutubeSearch.vue";
import About from "./About.vue";
import useYoutube from "../use-youtube";
import useYoutubePlayer from "../use-youtube-player";
import YoutubeComments from "./YoutubeComments.vue";
import useUI from "../use-UI";

export default {
  components: {
    AppBar,
    YoutubePlaylist,
    YoutubeSearch,
    YoutubeComments,
    About,
  },
  props: {
    params: String,
  },
  setup(props) {
    // DATA

    let query = null;

    if (props.params) {
      query = props.params.split(",");
    }

    // COMPOSITION

    let {
      playlists,
      addUrlPlaylists,
      addSavedPlaylists,
      searchRes,
      comments,
    } = useYoutube();

    let { playerWindowState } = useYoutubePlayer();

    let {
      showComments,
      showCommentsPause,
      playerHeight,
      overlayOpacity,
      marginUI,
      columns,
      isAboutVisible,
    } = useUI();

    // METHODS

    onMounted(() => {
      addSavedPlaylists();
      if (query) {
        addUrlPlaylists(query);
      }
    });

    let styleBottomMargin = computed(() => {
      return {
        "min-height": playerHeight.value + 120 + 2 * marginUI + "px",
      };
    });

    return {
      playlists,
      columns,
      searchRes,
      playerWindowState,
      comments,
      showComments,
      showCommentsPause,
      playerHeight,
      overlayOpacity,
      styleBottomMargin,
      isAboutVisible,
    };
  },
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #000000;
  pointer-events: none;
  z-index: 1000;
}

.search {
  text-align: left;
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: var(--border-color);
}

.playlist {
  text-align: left;
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: var(--border-color);
}

/* TRANSITION */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s !important;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
}
.fade-about-enter-active,
.fade-about-leave-active {
  transition: opacity 0.23s !important;
}
.fade-about-enter-from,
.fade-about-leave-to {
  opacity: 0 !important;
}
.fade-comment-enter-active,
.fade-comment-leave-active {
  transition: opacity 0.3s !important;
}
.fade-comment-enter-from,
.fade-comment-leave-to {
  opacity: 0 !important;
}
</style>
