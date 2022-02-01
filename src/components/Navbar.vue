<template>
  <nav class="navbar navbar-expand-lg navbar-dark py-0">
    <div class="container-fluid align-items-stretch">
      <a class="navbar-brand fw-bold py-2" href="#">YTPlay</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- <ul class="navbar-nav ms-auto ms-2 py-0 my-0"> -->
      <!--   <li -->
      <!--     class="nav-item d-flex align-items-center" -->
      <!--     :class="{ 'nav-item-active': !isAboutVisible }" -->
      <!--   > -->
      <!--     <a -->
      <!--       @click.prevent="handleClickPlaylists" -->
      <!--       class="nav-link py-0 px-3 my-0" -->
      <!--       aria-current="page" -->
      <!--       href="#" -->
      <!--     > -->
      <!--       Playlists -->
      <!--     </a> -->
      <!--   </li> -->
      <!--   <li -->
      <!--     class="nav-item d-flex align-items-center" -->
      <!--     :class="{ 'nav-item-active': isAboutVisible }" -->
      <!--   > -->
      <!--     <a -->
      <!--       @click.prevent="handleClickAbout" -->
      <!--       class="nav-link py-0 px-3 my-0" -->
      <!--       aria-current="page" -->
      <!--       href="#" -->
      <!--     > -->
      <!--       About -->
      <!--     </a> -->
      <!--   </li> -->
      <!-- </ul> -->
    </div>
  </nav>
</template>

<script>
import useUI from "../use-UI";

export default {
  setup() {
    let { isAboutVisible } = useUI();

    function handleClickAbout() {
      isAboutVisible.value = !isAboutVisible.value;
    }

    function handleClickPlaylists() {
      isAboutVisible.value = false;
    }

    return {
      handleClickAbout,
      handleClickPlaylists,
      isAboutVisible,
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
</style>
