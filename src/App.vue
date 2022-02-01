<template>
  <div id="app">
    <Navbar />

    <div class="container-fluid">
      <router-view></router-view>
    </div>

    <transition name="fade-side-panel">
      <SidePanel v-show="isSidePanelShow" />
    </transition>
    <Player />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Player from "./components/PlayerMain.vue";
import SidePanel from "./components/SidePanel.vue";
import useKey from "./use-key";
import useUI from "./use-UI.js";

export default {
  components: {
    Navbar,
    Player,
    SidePanel,
  },
  setup() {
    let { isSidePanelShow } = useUI();
    document.title = "YTPlay";
    useKey();

    return {
      isSidePanelShow,
    };
  },
};
</script>

<style lang="scss">
@import "./theme.scss";
@import "bootstrap/scss/bootstrap.scss";

:root {
  // light

  --bg-light: #f8f9fa;
  --bg-light-2: #f4f4f4;
  --background-player-light: #eaeaea;
  --background-side-panel-light: #f8f9fa;
  --text-color-light: #212529;
  --icon-color-light: #212529;
  --scroll-track-color-light: #f8f9fa;
  --scroll-thumb-color-light: #dae0e5;
  --border-color-light: #dee2e6;
  --input-background-color-light: #ffffff;
  --input-color-light: #495057;
  --input-border-color-light: #ced4da;
  --modal-content-bg-light: #f8f9fa;

  // dark

  --bg-dark: #292d32;
  --bg-dark-2: #33383f;
  --background-player-dark: #33383f;
  --background-side-panel-dark: #343a40;
  --text-color-dark: #eff1f4;
  --icon-color-dark: #e6eaed;
  --scroll-track-color-dark: #292d32;
  --scroll-thumb-color-dark: #6c757d;
  --border-color-dark: #6c757d;
  --input-background-color-dark: #32373d;
  --input-color-dark: #eff1f4;
  --input-border-color-dark: #4b545c;
  --modal-content-bg-dark: #343a40;

  // theme

  --background: var(--bg-light);
  --background-2: var(--bg-light-2);
  --text-color: var(--text-color-light);
  --icon-color: var(--icon-color-liht);
  --background-player: var(--background-player-light);
  --background-side-panel: var(--background-side-panel-light);
  --scroll: var(--scroll-color-light);
  --scroll-track: var(--scroll-track-color-light);
  --scroll-thumb: var(--scroll-thumb-color-light);
  --border-color: var(--border-color-light);
  --input-background-color: var(--input-background-color-light);
  --input-color: var(--input-color-light);
  --input-border-color: var(--input-border-color-light);
  --modal-content-bg: var(--modal-content-bg-light);
}

body {
  background-color: var(--background);
  color: var(--text-color);
  overflow-y: scroll;
}

i {
  cursor: pointer;
}

.mdi {
  color: var(--icon-color);
}

// TIPPY

div[data-tippy-root] {
  overflow-y: auto;
}

div[data-tippy-root]::-webkit-scrollbar {
  width: 0px;
}

.tippy-content {
  text-overflow: ellipsis;
}

.fade-side-panel-enter-active,
.fade-side-panel-leave-active {
  transition: all 0.3s ease;
}
.fade-side-panel-enter-from,
.fade-side-panel-leave-to {
  opacity: 0 !important;
  transform: translateX(20px);
}

// DROPDOWN

.dropdown-menu {
  z-index: 1045;
}

.dropdown-menu .list-group-item {
  background-color: var(--input-background-color) !important;
}

.modal .list-group-item {
  background-color: var(--background) !important;
}

// PLAYER

#video-player {
  position: fixed;
  z-index: 1010;
}
</style>
