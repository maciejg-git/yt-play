<template>
  <div class="about p-5">
    <div class="mb-5">
      <h5 class="mb-4">
        <i class="mdi mdi-play me-2"></i>
        How to add playlist
      </h5>
      <p class="mb-0 ms-5">
        Add comma seperated playlist IDs in URL
      </p>
      <p class="d-inline-block m-2 ms-5">
        <a href="https://ytplay.netlify.app/playlist/PL6KKV5307aucIh814g2_yPUztUhLGCPbt,PL6KKV5307auf79PLK0fTDnuMfP3sOOchX">
          https://ytplay.netlify.app/playlist/PL6KKV5307aucIh814g2_yPUztUhLGCPbt,PL6KKV5307auf79PLK0fTDnuMfP3sOOchX
        </a>
      </p>
      <p class="ms-5">
        or click
        <i class="mdi mdi-playlist-music mdi-24px"></i>
      </p>
    </div>
    <div class="mb-5">
      <h5 class="mb-4">
        <i class="mdi mdi-play me-2"></i>
        Search is not working
      </h5>
      <p class="ms-5">
        Search is temporary disabled because of YouTube API quota.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  setup(props) {
    
    return {
      
    }
  }
}
</script>

<style scoped>
.about {
  position: absolute;
  width: 50%;
}
</style>
