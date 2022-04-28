import { ref, watch } from "vue";
import useStoreSettings from "./use-store-settings";

let _compactThumbnailWidth = 55;
let _compactThumbnailHeight = 30;
let _normalThumbnailWidth = 80;
let _normalThumbnailHeight = 50;
let marginUI = 24;
let playerRef = ref(null);
let compactMode = ref(true);
let showComments = ref(true);
let showCommentsPause = ref(false);
let thumbnailWidth = ref(_compactThumbnailWidth);
let thumbnailHeight = ref(_compactThumbnailHeight);
let darkTheme = ref(false);
let overlayOpacity = ref(70);
let commentsDuration = ref(6);
let columns = ref(3);
let isAboutVisible = ref(false);
let isSidePanelShow = ref(false);

watch(darkTheme, () => {
  setTheme(darkTheme.value);
});

watch(compactMode, () => {
  setCompact(compactMode.value);
});

let { restoreSettings } = useStoreSettings("UI", {
  darkTheme,
  compactMode,
  overlayOpacity,
  commentsDuration,
  showComments,
});

restoreSettings();

function setTheme(theme) {
  if (theme) {
    document.documentElement.style.setProperty(
      "--background",
      "var(--bg-dark)"
    );
    document.documentElement.style.setProperty(
      "--text-color",
      "var(--text-color-dark)"
    );
    document.documentElement.style.setProperty(
      "--background-player",
      "var(--background-player-dark)"
    );
    document.documentElement.style.setProperty(
      "--scroll-track",
      "var(--scroll-track-color-dark)"
    );
    document.documentElement.style.setProperty(
      "--scroll-thumb",
      "var(--scroll-thumb-color-dark)"
    );
    document.documentElement.style.setProperty(
      "--border-color",
      "var(--border-color-dark)"
    );
    document.documentElement.style.setProperty(
      "--input-background-color",
      "var(--input-background-color-dark)"
    );
    document.documentElement.style.setProperty(
      "--input-color",
      "var(--input-color-dark)"
    );
    document.documentElement.style.setProperty(
      "--input-border-color",
      "var(--input-border-color-dark)"
    );
    document.documentElement.style.setProperty(
      "--icon-color",
      "var(--icon-color-dark)"
    );
    document.documentElement.style.setProperty(
      "--modal-content-bg",
      "var(--modal-content-bg-dark)"
    );
    document.documentElement.style.setProperty(
      "--background-2",
      "var(--bg-dark-2)"
    );
    document.documentElement.style.setProperty(
      "--background-side-panel",
      "var(--background-side-panel-dark)"
    );
    darkTheme.value = true;
  } else {
    document.documentElement.style.setProperty(
      "--background",
      "var(--bg-light)"
    );
    document.documentElement.style.setProperty(
      "--text-color",
      "var(--text-color-light)"
    );
    document.documentElement.style.setProperty(
      "--background-player",
      "var(--background-player-light)"
    );
    document.documentElement.style.setProperty(
      "--scroll-track",
      "var(--scroll-track-color-light)"
    );
    document.documentElement.style.setProperty(
      "--scroll-thumb",
      "var(--scroll-thumb-color-light)"
    );
    document.documentElement.style.setProperty(
      "--border-color",
      "var(--border-color-light)"
    );
    document.documentElement.style.setProperty(
      "--input-background-color",
      "var(--input-background-color-light)"
    );
    document.documentElement.style.setProperty(
      "--input-color",
      "var(--input-color-light)"
    );
    document.documentElement.style.setProperty(
      "--input-border-color",
      "var(--input-border-color-light)"
    );
    document.documentElement.style.setProperty(
      "--icon-color",
      "var(--icon-color-light)"
    );
    document.documentElement.style.setProperty(
      "--modal-content-bg",

      "var(--modal-content-bg-light)"
    );
    document.documentElement.style.setProperty(
      "--background-2",
      "var(--bg-light-2)"
    );
    document.documentElement.style.setProperty(
      "--background-side-panel",
      "var(--background-side-panel-light)"
    );
    darkTheme.value = false;
  }
}

function toggleSidePanel() {
  isSidePanelShow.value = !isSidePanelShow.value;
}

function setCompact(value) {
  if (!value) {
    thumbnailWidth.value = _normalThumbnailWidth;
    thumbnailHeight.value = _normalThumbnailHeight;
  } else {
    thumbnailWidth.value = _compactThumbnailWidth;
    thumbnailHeight.value = _compactThumbnailHeight;
  }
}

function setPlayerHeight(el) {
  playerRef.value = el;
}

function getPlayerHeight() {
  return playerRef.value.clientHeight;
}

function setComments() {
  showComments.value = !showComments.value;
}

export default function useUI() {
  return {
    setPlayerHeight,
    getPlayerHeight,
    setCompact,
    thumbnailWidth,
    thumbnailHeight,
    marginUI,
    showComments,
    showCommentsPause,
    setComments,
    compactMode,
    darkTheme,
    overlayOpacity,
    commentsDuration,
    columns,
    isAboutVisible,
    toggleSidePanel,
    isSidePanelShow,
  };
}
