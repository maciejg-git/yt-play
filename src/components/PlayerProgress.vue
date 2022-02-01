<template>
  <div 
    ref="progressRef" 
    @mousedown.prevent="handleClickProgress" 
    @mouseup="handleClickProgress" 
    @mousemove.prevent="handleProgressMouseMove($event)" 
    @mouseleave="handleMouseleaveProgress"
    v-tippy-progress 
    class="progress-container pt-2 pb-1"
  >
    <div class="progress bg-secondary">
      <div 
        ref="progressbarRef"
        class="progress-bar bg-danger" 
        role="progressbar" 
        :style="{'width': ((isProgressDragging ? seconds : currentTime)/duration) * 100 +'%'}" 
        aria-valuenow="0" 
        aria-valuemin="0" 
        aria-valuemax="100">
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import useYoutubePlayer from '../use-youtube-player.js'
import { ifMinAddDigit } from '../tools'
import { debounce } from 'lodash'

export default {
  setup() {
    let isProgressDragging = ref(false);
    let progressRef = ref(null);
    let progressbarRef = ref(null);
    let seconds = ref(0);

    let { 
      currentVideo,
      currentTime, 
      duration, 
      seekTo,
    } = useYoutubePlayer();

    let debounceProgressMouseMove = debounce(ev => {
      if (isProgressDragging.value) {
        seekTo(seconds.value)
      }
    }, 100)

    function handleClickProgress(ev) {
      if (!currentVideo.value) return;
      seconds.value = ((ev.x - ev.target.offsetLeft)/ev.target.clientWidth) * duration.value;
      if (ev.type == 'mousedown') {
        isProgressDragging.value = true;
        seekTo(seconds.value);
      }
      else if (ev.type == 'mouseup') {
        isProgressDragging.value = false;
        currentTime.value = seconds.value;
      }
    }

    function handleMouseleaveProgress() {
      if (isProgressDragging.value) {
        isProgressDragging.value = false;
        seekTo(seconds.value);
      }
    }

    function handleProgressMouseMove(ev) {
      debounceProgressMouseMove(ev);
      seconds.value = ((ev.x - ev.target.offsetLeft)/ev.target.clientWidth) * duration.value;
      let secondsTooltip = Math.floor(seconds.value);
      progressRef.value.tippyProgress.setContent(
        ifMinAddDigit(Math.trunc(secondsTooltip/60/60)%60) + ':' + 
        ifMinAddDigit((Math.trunc(secondsTooltip/60)%60)) + ':' + 
        ifMinAddDigit(Math.trunc(secondsTooltip%60))
      );
    }

    return {
      progressRef,
      progressbarRef,
      currentTime,
      duration,
      handleClickProgress,
      handleMouseleaveProgress,
      handleProgressMouseMove,
      debounceProgressMouseMove,
      seconds,
      isProgressDragging,
    }
  }
}
</script>

<style scoped>
.progress-container {
  cursor: pointer;
}
.progress {
  height: 0.4rem !important;
  overflow: visible;
  cursor: pointer;
  pointer-events: none;
}
.progress-bar {
  transition: none;
}
.progress-container:hover .progress .progress-bar {
}
</style>
