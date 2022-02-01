<template>
  <div class="row align-items-center g-2">
    <div class="col-auto">
      <transition name="fade-fast" mode="out-in">
        <i 
          v-if="volume > 50 && !isMuted" 
          @click="handleClickVolumeIcon" 
          v-tippy="'Mute'"
          class="mdi mdi-volume-high mdi-player-icon"
        ></i>
        <i 
          v-else-if="volume <= 50 && volume > 0 && !isMuted" 
          @click="handleClickVolumeIcon" 
          v-tippy="'Mute'"
          class="mdi mdi-volume-medium mdi-player-icon"
        ></i>
        <i 
          v-else-if="volume == 0 || isMuted" 
          @click="handleClickVolumeIcon" 
          v-tippy="'Mute'"
          class="mdi mdi-volume-off mdi-player-icon"
        ></i>
      </transition>
    </div>
    <div class="col-auto d-none d-md-block">
      <div 
        @click="handleClickVolume" 
        class="progress-container pt-2 pb-2"
      >
        <div 
          class="progress bg-secondary" 
          style="width: 150px"
        >
          <div 
            class="progress-bar bg-danger" 
            role="progressbar" 
            style="pointer-events: none"
            :style="{'width': volume +'%'}" 
            aria-valuenow="0" 
            aria-valuemin="0" 
            aria-valuemax="100">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useYoutubePlayer from '../use-youtube-player.js'

export default {
	props: {
	},
	setup(props) {
    let { 
      volume,
      isMuted,
      setVolume,
      toggleMute,
    } = useYoutubePlayer();

    function handleClickVolume(ev) {
      let volume = ((ev.x - ev.target.offsetLeft)/ev.target.clientWidth) * 100;
      setVolume(volume);
    }

    function handleClickVolumeIcon() {
      toggleMute();
    }
		
		return {
      volume,
      isMuted,
      setVolume,
      toggleMute,
      handleClickVolume,
      handleClickVolumeIcon,
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
  cursor: pointer;
}
.progress-bar {
  transition: none;
}

.mdi-player-icon:before {
  font-size: 2.2em;
  line-height: normal;
}

.fade-fast-enter-active, .fade-fast-leave-active {
  transition: opacity .05s;
}
.fade-fast-enter-from, .fade-fast-leave-to {
  opacity: 0;
}
</style>
