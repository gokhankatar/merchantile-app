<template>
  <v-app theme="dark">
    <v-container>
      <component :is="$route.meta.layout">
        <router-view />
      </component>
    </v-container>
  </v-app>
</template>

<script setup>
import { initFirebase } from "./db/db";

// first of all initialized firebase
initFirebase();
</script>
