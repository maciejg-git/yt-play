<template>
  <span class="timer fw-bold mx-3">
    {{ formatedTime }} - {{ durationTime }}
  </span>
</template>

<script>
import { ref, computed, watchEffect } from 'vue'
import useYoutubePlayer from '../use-youtube-player.js'
import { ifMinAddDigit } from '../tools'

export default {
	setup() {
    let showHours = false;
    let showMinutes = false;

    let { 
      currentTime, 
      duration, 
    } = useYoutubePlayer();

    watchEffect(() => {
      showHours = false;
      showMinutes = false;
      let hours = Math.trunc((Math.floor(duration.value) / 60 / 60) % 60);
      let minutes = Math.trunc((duration.value / 60) % 60);
      if (hours) {
        showHours = true;
        showMinutes = true;
      }
      if (minutes) showMinutes = true;
    })

    let durationTime = computed(() => {
      let hours = Math.trunc((Math.floor(duration.value) / 60 / 60) % 60);
      let minutes = Math.trunc((duration.value / 60) % 60);
      let seconds = duration.value % 60;
      hours > 0 ? (hours = hours < 10 ? '0' + hours : hours) : '';
      minutes = ifMinAddDigit(minutes);
      seconds = ifMinAddDigit(seconds);
      return (hours ? hours + ':' : '') + minutes + ':' + seconds;
    })

    let formatedTime = computed(() => {
      let time = "";
      if (currentTime.value == undefined) currentTime.value = 0;
      if (showHours) {
        let hours = Math.trunc((Math.floor(currentTime.value) / 60 / 60) % 60);
        hours = ifMinAddDigit(hours);
        time = hours + ':';
      }
      if (showMinutes) {
        let minutes = Math.trunc((Math.floor(currentTime.value) / 60) % 60);
        minutes = ifMinAddDigit(minutes);
        time += minutes + ':';
      }
      let seconds = Math.floor(currentTime.value) % 60;
      seconds = ifMinAddDigit(seconds);
      return time + seconds;
    })
		
		return {
      formatedTime,
      durationTime,
		}
	}
}
</script>

<style scoped>
.timer {
  font-size: 1.55em;
}
</style>
