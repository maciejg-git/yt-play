<template>
  <div class="row align-items-center py-3 pt-4 pe-3">

    <!-- FILTER -->

    <div class="col-4 ms-auto border-right">
      <input 
        @input="debounceFilterInput"
        type="search" 
        class="form-control form-control-sm" 
        placeholder="Filter"
      >
    </div>

    <!-- SEARCH -->

    <div class="col-4">
      <input 
        v-model="searchString" 
        type="search" 
        class="form-control form-control-sm" 
      >
    </div>
    <div class="col-auto">
      <button @click="" class="btn btn-primary btn-sm" disabled>
        Search
      </button>
    </div>

    <!-- PLAYLIST DROPDOWN -->

    <div class="col-auto ms-auto pe-1">
      <i 
        @click="handleShowPanel"
        class="mdi mdi-playlist-music mdi-appbar-icon" 
      ></i>
    </div>
  </div>

</template>

<script>
import { ref } from 'vue'
import useYoutube from '../use-youtube'
import useUI from '../use-UI'
import useStore from '../use-store'
import { debounce } from 'lodash'

export default {
  setup(props) {
    let searchString = ref('');

    let { 
      searchRemote,
    } = useYoutube();

    let {
      toggleSidePanel,
    } = useUI();

    let state = useStore();

    let debounceFilterInput = debounce(e => {
      state.filter = e.target.value;
    }, 200)

    function handleSearch() {
      searchRemote(searchString.value);
    }

    function handleShowPanel() {
      toggleSidePanel()
    }

    return {
      searchString,
      state,
      // youtube
      searchRemote,
      handleSearch,
      debounceFilterInput,
      handleShowPanel,
    }
  }
}
</script>

<style scoped>
.border-right {
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: var(--border-color) !important;
}

.mdi-appbar-icon {
  font-size: 1.8em;
  line-height: 1.2em;
}
</style>
