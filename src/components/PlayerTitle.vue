<template>
  <transition name="fade" mode="out-in">
    <span 
      @click="handleClickTitle" 
      v-tippy-player="tippyVideoDescriptionContent" 
      :key="currentVideo.title" 
      class="video-title fw-bold mx-3"
    >
      {{ currentVideo.title }}
    </span>
  </transition>
</template>

<script>
import useYoutubePlayer from '../use-youtube-player.js'

export default {
	setup() {
    let { 
      currentVideo, 
    } = useYoutubePlayer();

    function handleClickTitle() {
      currentVideo.value.el.scrollIntoView({ block: "center" });
    }

    function tippyVideoDescriptionContent () {
      let videoId = currentVideo.value.resourceId ? 
        currentVideo.value.resourceId.videoId : '';
      let youtubeUrl = `<a href="https://youtube.com/watch?v=${videoId}">Watch on YouTube</a>`
      let videoDescritpion = currentVideo.value.description ? 
        currentVideo.value.description.replace(/(?:\r\n|\r|\n)/g, '<br>') : 
        'No description'
      return `<div class="mb-2">${videoDescritpion} <hr> ${youtubeUrl}</div>`
    }
		
		return {
      currentVideo,
      handleClickTitle,
      tippyVideoDescriptionContent,
		}
	}
}
</script>

<style scoped>
.video-title {
  font-size: 1em;
}
.video-title:hover {
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
