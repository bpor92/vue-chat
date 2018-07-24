<template>
  <v-layout row justify-center>
    <v-dialog v-model="loading" persistent transition="fade-transition" fullscreen content-class="loading-dialog">
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate :size="70" :width="7" color="white"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.loading-dialog{
  background-color: rgba(125, 120, 120, 0.3);
  opacity: 0.5;
}
</style>
