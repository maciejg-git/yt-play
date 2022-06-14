<template>
  <div class="dropdown">
    <i
      class="mdi mdi-dots-vertical mdi-dropdown-icon"
      data-bs-toggle="dropdown"
    ></i>
    <ul
      class="dropdown-menu dropdown-menu-right"
      aria-labelledby="dropdownMenuButton"
    >
      <li>
        <a
          @click.prevent="emit('close-playlist')"
          class="dropdown-item d-flex align-items-center"
          href="#"
        >
          <i class="mdi mdi-close mdi-dropdown-menu-icon pe-1"></i>
          Close playlist
        </a>
      </li>
      <li><hr class="dropdown-divider" /></li>
      <li>
        <a
          @click.prevent="emit('reload-playlist')"
          class="dropdown-item d-flex align-items-center"
          href="#"
        >
          <i class="mdi mdi-reload mdi-dropdown-menu-icon pe-1"></i>
          Reload playlist
        </a>
      </li>
      <li><hr class="dropdown-divider" /></li>
      <li v-if="!playlist.local">
        <a
          @click.prevent="emit('save-playlist')"
          class="dropdown-item d-flex align-items-center"
          href="#"
        >
          <i class="mdi mdi-star mdi-dropdown-menu-icon pe-1"></i>
          Add to favorites
        </a>
      </li>
      <li v-else>
        <a
          @click.prevent="emit('delete-playlist')"
          class="dropdown-item d-flex align-items-center"
          href="#"
        >
          <i class="mdi mdi-star-outline mdi-dropdown-menu-icon pe-1"></i>
          Remove from favorites
        </a>
      </li>
      <li><hr class="dropdown-divider" /></li>
      <li>
        <a class="dropdown-item d-flex align-items-center" href="#">
          <i class="mdi mdi-youtube mdi-dropdown-menu-icon pe-1"></i>
          Open in youtube
        </a>
      </li>
      <li>
        <a
          @click.prevent="emit('edit-in-youtube')"
          class="dropdown-item d-flex align-items-center"
          href="#"
        >
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
    };
  },
};
</script>

<style scoped>
.mdi-dropdown-icon:before {
  font-size: 1.45em;
}
.mdi-dropdown-menu-icon:before {
  font-size: 1.25em;
}
</style>
