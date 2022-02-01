<template>
    <i 
      @click="handleClickPrevious"
      v-tippy="'Previous'"
      class="mdi mdi-skip-previous mdi-player-icon-play"
    ></i>
    <i 
      @click="handleClickNext"
      v-tippy="'Next'"
      class="mdi mdi-skip-next mdi-player-icon-play"
    ></i>
    <transition name="fade-fast" mode="out-in">
      <i 
        v-if="playMode == playerPlaymodes.NEXT" 
        @click="handleClickPlayMode" 
        key="next"
        v-tippy="'Next'"
        class="mdi mdi-shuffle-disabled mdi-player-icon"
      ></i>
      <i 
        v-else-if="playMode == playerPlaymodes.SHUFFLE" 
        @click="handleClickPlayMode" 
        key="shuffle"
        v-tippy="'Shuffle'"
        class="mdi mdi-shuffle mdi-player-icon"
      ></i>
      <i 
        v-else-if="playMode == playerPlaymodes.REPEAT"
        @click="handleClickPlayMode" 
        key="repeat"
        v-tippy="'Repeat'"
        class="mdi mdi-repeat mdi-player-icon"
      ></i>
    </transition>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import useYoutubePlayer, { playerPlaymodes } from '../use-youtube-player'

export default {
	setup() {
    let { 
      currentTime, 
      play, 
      seekTo,
      prev,
      next,
      loadVideo,
      playMode,
    } = useYoutubePlayer();

    function handleClickPlayMode() {
      playMode.value++;
      if (playMode.value > 3) {
        playMode.value = 1;
      }
    }

    function handleClickPrevious() {
      if (currentTime.value > 5 || playMode.value == 3) {
        seekTo(0);
      }
      else {
        let video = prev();
        if (video) {
          video.el.scrollIntoView({ block: 'center' });
          loadVideo(video);
          play();
        }
      }
    }

    function handleClickNext() {
      let video = next();
      if (video) {
        video.el.scrollIntoView({ block: 'center' });
        loadVideo(video);
        play();
      }
    }
		
		return {
      playMode,
      playerPlaymodes,
      handleClickNext,
      handleClickPrevious,
      handleClickPlayMode,
		}
	}
}
</script>

<style scoped>
.mdi-player-icon:before {
  font-size: 2.2em;
  line-height: normal;
}
.mdi-player-icon-play:before {
  font-size: 36px;
  line-height: normal;
}

.fade-fast-enter-active, .fade-fast-leave-active {
  transition: opacity .05s;
}
.fade-fast-enter-from, .fade-fast-leave-to {
  opacity: 0;
}
</style>
