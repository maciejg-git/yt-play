<template>
  <i 
    v-if="showComments" 
    @click="setComments" 
    v-tippy="'Show comments'" 
    class="mdi mdi-comment-outline mdi-player-icon-mini"
  ></i>
  <i 
    v-else 
    @click="setComments" 
    v-tippy="'Show comments'" 
    class="mdi mdi-comment-remove-outline mdi-player-icon-mini"
  ></i>
  <i 
    v-if="playerWindowState == 1" 
    @click="handleYoutubeWindowClick" 
    v-tippy="'Fullscreen'" 
    class="mdi mdi-square-rounded-outline mdi-player-icon"
  ></i>
  <i 
    v-else 
    @click="handleYoutubeWindowClick" 
    v-tippy="'Fullscreen'" 
    class="mdi mdi-arrow-top-left-thick mdi-player-icon"
  ></i>
</template>

<script>
import useYoutubePlayer from '../use-youtube-player.js'
import useUI from '../use-UI.js'

export default {
	setup() {
    let { 
      playerWindowState,
      toggleYoutubeWindow,
    } = useYoutubePlayer();

    let { 
      showComments,
      setComments,
    } = useUI();

    function handleYoutubeWindowClick() {
      toggleYoutubeWindow();
    }

		return {
      playerWindowState,
      toggleYoutubeWindow,
      showComments,
      setComments,
      handleYoutubeWindowClick,
		}
	}
}
</script>

<style scoped>
.mdi-player-icon:before {
  font-size: 2.2em;
  line-height: normal;
}
.mdi-player-icon-mini:before {
  font-size: 2em;
  line-height: normal;
}
</style>
