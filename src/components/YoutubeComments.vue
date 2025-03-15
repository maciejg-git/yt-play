<template>
  <div
    @mouseenter="pauseComments"
    @mouseleave="playComments"
    @wheel.prevent="handleWheel"
    :style="{ bottom: getPlayerHeight() + marginUI + 'px' }"
    class="comments-container shadow rounded p-1 pr-1 pt-2"
  >
    <div class="comments">
      <div v-if="comments.length" class="row p-2 g-2">
        <div class="col-auto">
          <img :src="srcProfileImage" alt="" />
        </div>
        <div class="col">
          <transition name="fade" mode="out-in">
            <span :key="comments[commentIndex].id">
              <span class="fw-bold">
                {{ authorComment }}
              </span>
              {{ textComment }}
            </span>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import useYoutube from "../use-youtube";
import useYoutubePlayer, { playerStates } from "../use-youtube-player";
import useUI from "../use-UI";

export default {
  props: {},
  setup(props) {
    let commentIndex = ref(0);
    let commentTimer = null;

    // COMPOSITION

    let { comments, getCommentsRemote } = useYoutube();

    let { currentVideo, playerState } = useYoutubePlayer();

    let { marginUI, commentsDuration, getPlayerHeight } = useUI();

    // COMPUTED

    watch(currentVideo, () => {
      commentIndex.value = 0;
    });

    watch(playerState, () => {
      if (playerState.value == playerStates.PLAYING) {
        playComments();
      }
      if (playerState.value == playerStates.PAUSED) {
        pauseComments();
      }
    });

    watch(commentsDuration, () => {
      playComments()
    })

    let textComment = computed(() => {
      return comments.value[commentIndex.value].snippet.topLevelComment.snippet
        .textOriginal;
    });

    let authorComment = computed(() => {
      return comments.value[commentIndex.value].snippet.topLevelComment.snippet
        .authorDisplayName;
    });

    let srcProfileImage = computed(() => {
      return comments.value[commentIndex.value].snippet.topLevelComment.snippet
        .authorProfileImageUrl;
    });

    // METHODS

    function handleWheel(ev) {
      let index = ev.deltaY / 100;
      commentIndex.value += index;
      if (commentIndex.value > comments.value.length - 5) {
        getCommentsRemote(currentVideo.value.resourceId.videoId, true);
      }
      if (commentIndex.value > comments.value.length - 1) {
        commentIndex.value = 0;
      } else if (commentIndex.value < 0) {
        commentIndex.value = 0;
      }
    }

    function pauseComments() {
      clearInterval(commentTimer);
    }

    function playComments() {
      clearInterval(commentTimer);
      commentTimer = setInterval(() => {
        commentIndex.value++;
        if (commentIndex.value > comments.value.length - 5) {
          getCommentsRemote(currentVideo.value.resourceId.videoId, true);
        }
        if (commentIndex.value > comments.value.length - 1) {
          commentIndex.value = 0;
        }
      }, commentsDuration.value * 1000);
    }

    return {
      comments,
      commentIndex,
      pauseComments,
      playComments,
      getPlayerHeight,
      marginUI,
      textComment,
      authorComment,
      srcProfileImage,
      handleWheel,
    };
  },
};
</script>

<style scoped lang="scss">
/* @import "../theme.scss"; */
@import "../../node_modules/bootstrap/scss/bootstrap.scss";

.comments {
  height: 110px;
  overflow-y: auto;
  overflow-x: hidden;
}
.comments-container {
  position: fixed;
  width: 50% !important;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-color);
  background-color: var(--background-2);
  z-index: 1020;
}
.comments::-webkit-scrollbar-track {
  background-color: var(--background-2);
}
.comments::-webkit-scrollbar {
  width: 8px;
  background-color: var(--scroll);
}
.comments::-webkit-scrollbar-thumb {
  background-color: var(--scroll-thumb);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
