import useYoutubePlayer from './use-youtube-player'

export default function useKey() {
  let { 
    currentTime,
    togglePlayPause,
    seekTo,
    setYoutubeWindow,
    toggleMute,
    toggleYoutubeWindow,
  } = useYoutubePlayer();

  window.addEventListener('keydown', (ev) => {
    if (document.activeElement.tagName == 'INPUT') return;

    if (ev.key == ' ') {
      togglePlayPause();
      ev.preventDefault();
    }
    if (ev.key == 'ArrowRight') {
      seekTo(currentTime.value + 5);
      ev.preventDefault();
    }
    if (ev.key == 'ArrowLeft') {
      seekTo(currentTime.value - 5);
      ev.preventDefault();
    }
    if (ev.key == 'f') {
      toggleYoutubeWindow();
      ev.preventDefault();
    }
    if (ev.key == 'm') {
      toggleMute();
      ev.preventDefault();
    }
  })
}
