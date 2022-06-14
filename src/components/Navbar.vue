<template>
  <nav class="navbar navbar-expand-lg navbar-dark py-0 d-flex align-items-center">
    <div class="container-fluid align-items-stretch">
      <a class="navbar-brand fw-bold py-2" href="#">YTPlay</a>
      <button class="btn btn-link d-flex align-items-center" @click="handleThemeClick">
        <icon :name="darkTheme ? BSun : BMoon" class="icon"></icon>
      </button>
    </div>
  </nav>
</template>

<script>
import useUI from "../use-UI";
import BSun from "../icons/sun"
import BMoon from "../icons/moon"

export default {
  setup() {
    let { isAboutVisible, darkTheme } = useUI();

    function handleClickAbout() {
      isAboutVisible.value = !isAboutVisible.value;
    }

    function handleThemeClick() {
      darkTheme.value = !darkTheme.value
    }

    function handleClickPlaylists() {
      isAboutVisible.value = false;
    }

    return {
      handleClickAbout,
      handleThemeClick,
      handleClickPlaylists,
      isAboutVisible,
      BMoon,
      BSun,
      darkTheme,
    };
  },
};
</script>

<style lang="scss" scoped>
/* @import "../theme.scss"; */
@import "bootstrap/scss/bootstrap.scss";

.navbar {
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.7);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.7);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.7);
}

.navbar-dark {
  background-color: #444c54;
}

.nav-item {
  font-size: 1em !important;
}

.nav-item-active {
  margin-top: 2px;
  border-bottom: solid #0d6efd 2px;
}

.icon {
  width: 1.5em;
  height: 1.5em;
  color: #eeeeee;
}

.btn:focus {
  box-shadow: none;
}
</style>
