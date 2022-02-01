<template>
  <div class="dropdown">
    <i class="mdi mdi-dots-vertical mdi-dropdown-icon" data-bs-toggle="dropdown"></i>
    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
      <li>
        <a @click.prevent="emit('close-playlist')" class="dropdown-item d-flex align-items-center" href="#">
          <i class="mdi mdi-close mdi-dropdown-menu-icon pe-1"></i>
          Close playlist
        </a>
      </li>
      <li><hr class="dropdown-divider"></li>
      <li>
        <a @click.prevent="emit('reload-playlist')" class="dropdown-item d-flex align-items-center" href="#">
          <i class="mdi mdi-reload mdi-dropdown-menu-icon pe-1"></i>
          Reload playlist
        </a>
      </li>
      <li><hr class="dropdown-divider"></li>
      <li v-if="!playlist.local">
        <a @click.prevent="emit('save-playlist')" class="dropdown-item d-flex align-items-center" href="#">
          <i class="mdi mdi-star mdi-dropdown-menu-icon pe-1"></i>
          Save playlist
        </a>
      </li>
      <li v-else>
        <a @click.prevent="emit('delete-playlist')" class="dropdown-item d-flex align-items-center" href="#">
      <i class="mdi mdi-star-outline mdi-dropdown-menu-icon pe-1"></i>
          Delete playlist
        </a>
      </li>
      <li ><hr class="dropdown-divider"></li>
      <!-- <li v&#45;show="playlist.local"> -->
      <!--   <a class="dropdown&#45;item d&#45;flex align&#45;items&#45;center" href="#"> -->
      <!--     <i class="mdi mdi&#45;chevron&#45;right mdi&#45;dropdown&#45;icon pr&#45;1"></i> -->
      <!--     Move to right -->
      <!--   </a> -->
      <!-- </li> -->
      <!-- <li v&#45;show="playlist.local"> -->
      <!--   <a class="dropdown&#45;item d&#45;flex align&#45;items&#45;center" href="#"> -->
      <!--     <i class="mdi mdi&#45;chevron&#45;left mdi&#45;dropdown&#45;icon pr&#45;1"></i> -->
      <!--     Move to left -->
      <!--   </a> -->
      <!-- </li> -->
      <!-- <li v&#45;show="playlist.local"><hr class="dropdown&#45;divider"></li> -->
      <li>
        <a class="dropdown-item d-flex align-items-center" href="#">
          <i class="mdi mdi-youtube mdi-dropdown-menu-icon pe-1"></i>
          Open in youtube
        </a>
      </li>
      <li>
        <a @click.prevent="emit('edit-in-youtube')" class="dropdown-item d-flex align-items-center" href="#">
          <i class="mdi mdi-youtube mdi-dropdown-menu-icon pe-1"></i>
          Edit in youtube
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    playlist: Object,
  },
  setup(props, { emit }) {
    return {
      emit,
    }
  }
}
</script>

<style scoped>
.mdi-dropdown-icon:before {
  font-size: 1.45em;
}
.mdi-dropdown-menu-icon:before {
  font-size: 1.25em;
}
</style>
