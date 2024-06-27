<template>
  <v-app-bar>
    <v-btn icon="mdi-menu" @click="drawer = !drawer"></v-btn>
    <v-spacer></v-spacer>
    <v-menu min-width="200px" rounded>
      <template v-slot:activator="{ props }">
        <v-btn :="props" icon>
          <v-avatar color="blue-grey">
            <span class="text-subtitle-1 font-weight-bold">GK</span>
          </v-avatar>
        </v-btn>
      </template>

      <v-card>
        <v-card-text>Text</v-card-text>
      </v-card>
    </v-menu>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" location="left" permanent>
    <v-list>
      <v-list-item
        @click="$router.replace(item.value)"
        class="cursor-pointer"
        v-for="item of items"
        :key="item"
        active-color="blue-grey"
        :active="$route.path !== '/' && item.value == activeRouteItem?.value"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <v-container>
      <div class="cursor-pointer" @click="$router.replace('/')">Anasayfa</div>
      <div class="mt-12">
        <slot />
      </div>
    </v-container>
  </v-main>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const drawer = ref(true);
const activeRouteItem = ref(null);

watch(
  () => route.path,
  (newPath) => {
    activeRouteItem.value = items.find((x) => x.value.includes(route.path));
  }
);

onMounted(() => {
  activeRouteItem.value = items.find((x) => x.value.includes(route.path));
});

const items = [
  {
    title: "My Products",
    value: "/my-products",
    icon: "mdi-box-shadow",
  },
  {
    title: "My Favorites",
    value: "/my-favorites",
    icon: "mdi-heart",
  },
  {
    title: "Create Product",
    value: "/create-product",
    icon: "mdi-plus",
  },
  {
    title: "Saved Products",
    value: "/my-saved",
    icon: "mdi-content-save",
  },
  {
    title: "Categories",
    value: "/categories",
    icon: "mdi-shape",
  },
];
</script>
<style scoped></style>
