<script setup>
/*
 * @description : a merchantile application where user-interactive frontend and backend work together
 * @author : Gokhan Katar
 * @github : https://github.com/gokhankatar
 * @x : https://twitter.com/gokhan_crypto/
 * @instagram :  https://www.instagram.com/katargokhan96/
 */
</script>

<template>
  <!-- loading bar -->
  <v-progress-circular
    class="loading-bar"
    :size="90"
    :width="9"
    color="blue-grey"
    indeterminate
  ></v-progress-circular>
</template>

<style scoped>
.loading-bar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
