<template>
  <div ref="playerRef" @wheel.prevent="handleWheel" class="player p-2">
    <div class="row align-items-center py-0">
      <!-- PLAY -->

      <div class="col-auto border-end border-secondary pe-1">
        <transition name="fade-fast" mode="out-in">
          <i
            v-if="playButtonMode"
            @click="handleClickPlay"
            class="mdi mdi-play mdi-player-icon-play"
          ></i>
          <i
            v-else
            @click="handleClickPause"
            class="mdi mdi-pause mdi-player-icon-play"
          ></i>
        </transition>
      </div>

      <!-- TIMER -->

      <div
        v-if="currentVideo.title && duration"
        class="col-auto border-end border-secondary"
      >
        <PlayerTimer />
      </div>

      <!-- NEXT -->

      <div
        v-if="currentVideo.title"
        class="col-auto border-end border-secondary"
      >
        <PlayerPlaylist />
      </div>

      <!-- TITLE -->

      <div class="col text-truncate">
        <PlayerTitle />
      </div>

      <!-- VOLUME -->

      <div class="col-auto ms-auto">
        <PlayerVolume />
      </div>

      <!-- COMMENTS FULLSCREEN -->

      <div class="col-auto d-none d-md-block me-1">
        <PlayerIcons />
      </div>
    </div>

    <div class="row">
      <div class="col mx-1">
        <PlayerProgress />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from "vue";
import PlayerVolume from "./PlayerVolume.vue";
import PlayerTimer from "./PlayerTimer.vue";
import PlayerTitle from "./PlayerTitle.vue";
import PlayerPlaylist from "./PlayerPlaylistControl.vue";
import PlayerIcons from "./PlayerIcons.vue";
import PlayerProgress from "./PlayerProgress.vue";
import useYoutubePlayer, {
  playerStates,
} from "../use-youtube-player";
import useUI from "../use-UI";

export default {
  components: {
    PlayerTimer,
    PlayerTitle,
    PlayerPlaylist,
    PlayerVolume,
    PlayerIcons,
    PlayerProgress,
  },
  setup(props) {
    // DATA

    let playerRef = ref(null);

    // COMPOSITION

    let {
      currentVideo,
      duration,
      volume,
      playerState,
      play,
      stop,
      pause,
      prev,
      next,
      setVolume,
    } = useYoutubePlayer();

    let { setPlayerHeight } = useUI();

    // COMPUTED

    let playButtonMode = computed(() => {
      return (
        playerState.value == playerStates.PAUSED ||
        playerState.value == playerStates.UNSTARTED ||
        playerState.value == playerStates.ENDED
      );
    });

    // METHODS

    onMounted(() => {
      nextTick(() => {
        setPlayerHeight(playerRef.value);
      })
    });

    function handleClickPlay() {
      if (!currentVideo.value.resourceId) return;
      play();
    }

    function handleClickPause() {
      pause();
    }

    function handleWheel(ev) {
      let i = volume.value + (ev.deltaY / 200) * -1 * 5;
      setVolume(i > 100 ? 100 : i < 0 ? 0 : i);
    }

    return {
      playerRef,
      currentVideo,
      duration,
      playButtonMode,
      handleClickPlay,
      handleClickPause,
      handleWheel,
    };
  },
};
</script>

<style scoped>
.player {
  position: fixed;
  bottom: 0px;
  width: 100%;
  background-color: var(--background-player);
  -webkit-box-shadow: 0px -7px 12px -12px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px -7px 12px -12px rgba(0, 0, 0, 0.5);
  box-shadow: 0px -7px 12px -12px rgba(0, 0, 0, 0.5);
  z-index: 1020;
}

/* MDI */

.mdi-player-icon-title:before {
  font-size: 1.4em;
  line-height: normal;
}
.mdi-player-icon:before {
  font-size: 2.2em;
  line-height: normal;
}
.mdi-player-icon-mini:before {
  font-size: 2em;
  line-height: normal;
}
.mdi-player-icon-play:before {
  font-size: 36px;
  line-height: normal;
}

/* TRANSITION */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.05s;
}
.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}
</style>
