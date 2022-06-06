import { ref } from "vue";
import YouTubePlayer from "youtube-player";
import useYoutube from "./use-youtube";
import useUI from "./use-UI";
import useStoreSettings from "./use-store-settings";
import { getRandomInteger } from "./tools";

export const playerStates = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 4,
};

export const playerPlaymodes = {
  NEXT: 1,
  SHUFFLE: 2,
  REPEAT: 3,
};

export const playerWindowStates = {
  MINIMIZED: 1,
  CENTER: 2,
};

let _playerDefaultRight = 12;
let _playerDefaultBottom = 90;
let _playerDefaultWidth = 320;
let _playerDefaultHeight = 180;
let _playerMobileDefaultWidth = 180;
let _playerMobileDefaultHeight = 105;
let isMobile = ref(false);
let _timer = null;
let currentVideo = ref({});
let currentPlaylist = ref(null);
let currentTime = ref(null);
let duration = ref(null);
let playerState = ref(playerStates.UNSTARTED);
let playerWindowState = ref(playerWindowStates.MINIMIZED);
let volume = ref(0);
let isMuted = ref(false);
let playMode = ref(playerPlaymodes.NEXT);
let _player = null;

let { restoreSettings } = useStoreSettings("Player", { playMode });

let { getCommentsRemote, comments, findVideoIndex } = useYoutube();

let { showCommentsPause, getPlayerHeight, marginUI } = useUI();

restoreSettings();
initPlayer();

function initPlayer() {
  let playerEl = document.createElement("div");
  playerEl.setAttribute("id", "video-player");
  document.body.append(playerEl);

  _player = YouTubePlayer("video-player", {
    width: _playerDefaultWidth,
    height: _playerDefaultHeight,
  });

  _player.getVolume().then((res) => {
    volume.value = res;
  });

  _player.getIframe().then((el) => {
    el.style.right = _playerDefaultRight + "px";
    el.style.bottom = _playerDefaultBottom + "px";
  });

  _checkIfMobile(window.innerWidth);
  setYoutubeWindow(playerWindowState.value);
}

function play() {
  _player.playVideo();
}

function stop() {
  _player.stopVideo();
  currentVideo.value = null;
}

function pause() {
  _player.pauseVideo();
}

function togglePlayPause() {
  if (playerState.value == 2) {
    play();
  } else if (playerState.value == 1) {
    pause();
  }
}

function seekTo(seconds) {
  _player.seekTo(seconds);
}

function setVolume(value) {
  _player.setVolume(value).then(() => {
    volume.value = value;
  });
}

function toggleMute() {
  if (!isMuted.value) {
    _player.mute();
    isMuted.value = true;
  } else {
    _player.unMute();
    isMuted.value = false;
  }
}

function loadVideo(video) {
  let id = video.resourceId.videoId;
  _player.loadVideoById(id).then(() => {
    comments.value = [];
    getCommentsRemote(id, false);
    currentVideo.value = video;
    document.title = currentVideo.value.title;
  });
}

function getTime() {
  return _player.getCurrentTime();
}

function prev() {
  if (playMode.value == playerPlaymodes.NEXT) {
    if (!currentPlaylist.value) return null;
    let index = findVideoIndex(currentPlaylist.value, currentVideo.value);
    index = index < 0 ? 0 : index - 1;
    return currentPlaylist.value.items[index].snippet;
  } else if (playMode.value == playerPlaymodes.SHUFFLE) {
    if (!currentPlaylist.value) return null;
    let index = getRandomInteger(0, currentPlaylist.value.items.length - 1);
    return currentPlaylist.value.items[index].snippet;
  } else if (playMode.value == playerPlaymodes.REPEAT) {
    return currentVideo.value;
  }
}

function next() {
  if (playMode.value == playerPlaymodes.NEXT) {
    if (!currentPlaylist.value) return null;
    let index = findVideoIndex(currentPlaylist.value, currentVideo.value);
    index = index >= currentPlaylist.value.items.length - 1 ? 0 : index + 1;
    return currentPlaylist.value.items[index].snippet;
  } else if (playMode.value == playerPlaymodes.SHUFFLE) {
    if (!currentPlaylist.value) return null;
    let index = getRandomInteger(0, currentPlaylist.value.items.length - 1);
    return currentPlaylist.value.items[index].snippet;
  } else if (playMode.value == playerPlaymodes.REPEAT) {
    return currentVideo.value;
  }
}

function toggleYoutubeWindow() {
  if (playerWindowState.value == playerWindowStates.MINIMIZED) {
    setYoutubeWindow(playerWindowStates.CENTER);
  } else {
    setYoutubeWindow(playerWindowStates.MINIMIZED);
  }
}

function _checkIfMobile(w) {
  if (w < 768) {
    isMobile.value = true;
  } else if (w >= 768) {
    isMobile.value = false;
  }
}

function setYoutubeWindow(state) {
  if (state == playerWindowStates.MINIMIZED) {
    let w = isMobile.value ? _playerMobileDefaultWidth : _playerDefaultWidth;
    let h = isMobile.value ? _playerMobileDefaultHeight : _playerDefaultHeight;

    _player.getIframe().then((el) => {
      el.style.transition = "right 0.3s,bottom 0.3s";
      _player.setSize(w, h);
      el.style.right = _playerDefaultRight + "px";
      el.style.bottom = _playerDefaultBottom + "px";
      playerWindowState.value = playerWindowStates.MINIMIZED;
    });
  } else if (state == playerWindowStates.CENTER) {
    let w = document.body.clientWidth / 1.8;
    let h = window.innerHeight / 1.8;
    let l = (document.body.clientWidth - w) / 2;
    let b = (window.innerHeight - h) / 2;
    let h2 = getPlayerHeight() + 120 + 2 * marginUI;
    b = b < h2 ? h2 : b;
    _player.getIframe().then((el) => {
      el.style.transition = "right 0.3s,bottom 0.3s";
      _player.setSize(w, h);
      el.style.right = l + "px";
      el.style.bottom = b + "px";
      playerWindowState.value = playerWindowStates.CENTER;
    });
  }
}

// EVENTS

window.addEventListener("resize", (ev) => {
  _checkIfMobile(ev.target.innerWidth);
  if (playerWindowState.value == playerWindowStates.CENTER) {
    setYoutubeWindow(playerWindowState.value);
  }
  if (playerWindowState.value == playerWindowStates.MINIMIZED) {
    setYoutubeWindow(playerWindowState.value);
  }
});

_player.on("stateChange", (ev) => {
  if (ev.data == playerStates.PLAYING) {
    _player.getDuration().then((time) => {
      duration.value = Math.floor(time);
    });
    playerState.value = playerStates.PLAYING;
    _timer = setInterval(() => {
      _player.getCurrentTime().then((time) => {
        currentTime.value = time;
      });
    }, 100);
    showCommentsPause.value = true;
  }
  if (ev.data == playerStates.PAUSED) {
    playerState.value = playerStates.PAUSED;
    showCommentsPause.value = false;
  }
  if (ev.data == playerStates.ENDED) {
    playerState.value = playerStates.ENDED;
    clearInterval(_timer);
    let video = null;
    if (playMode.value == playerPlaymodes.NEXT) {
      video = next();
      video.el.scrollIntoView({ block: "center" });
      loadVideo(video);
      play();
    } else if (playMode.value == playerPlaymodes.SHUFFLE) {
      video = next();
      video.el.scrollIntoView({ block: "center" });
      loadVideo(video);
      play();
    } else if (playMode.value == playerPlaymodes.REPEAT) {
      play();
    }
    // play next
  }
});

export default function useYoutubePlayer() {
  return {
    // ref
    currentVideo,
    currentPlaylist,
    currentTime,
    duration,
    volume,
    isMuted,
    playerState,
    playerWindowState,
    // control
    play,
    stop,
    pause,
    togglePlayPause,
    seekTo,
    prev,
    next,
    playMode,
    setVolume,
    toggleMute,
    loadVideo,
    getTime,
    setYoutubeWindow,
    toggleYoutubeWindow,
  };
}
