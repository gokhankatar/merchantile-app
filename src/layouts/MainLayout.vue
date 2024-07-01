<template>
  <v-app-bar class="d-flex justify-space-between px-5">
    <v-btn icon="mdi-menu" @click="drawer = !drawer"></v-btn>
    <v-spacer></v-spacer>
    <v-menu min-width="200px" rounded>
      <template v-slot:activator="{ props }">
        <v-btn :="props" icon>
          <v-avatar color="blue-grey">
            <span class="text-subtitle-1 font-weight-bold">{{
              store.getters.getFullName
            }}</span>
          </v-avatar>
        </v-btn>
      </template>

      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-btn
              variant="text"
              color="green"
              class="w-100"
              @click="$router.replace('/my-selled-products')"
              >Selled Products</v-btn
            >

            <v-divider class="my-3" />

            <v-btn variant="outlined" class="w-100 bg-red border-none" @click="onLogout"
              >Logout</v-btn
            >
          </div>
        </v-card-text>
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
      <span
        class="header pa-2 rounded-lg text-h5 text-blue-grey cursor-pointer"
        @click="$router.replace('/')"
      >
        Merchantile App
      </span>
      <div class="mt-12">
        <slot />
      </div>
    </v-container>
  </v-main>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import store from "../store/store";
import { getAuth } from "firebase/auth";
import app from "../db/db";

const route = useRoute();
const router = useRouter();

const drawer = ref(false);
const activeRouteItem = ref(null);

const onLogout = () => {
  const user = getAuth(app);
  localStorage.clear();
  router.replace("/signin");
  user.signOut();
};

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
    title: "Home",
    value: "/",
    icon: "mdi-home",
  },
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
    title: "My Saved Products",
    value: "/my-saved",
    icon: "mdi-content-save",
  },
  {
    title: "My Selled Products",
    value: "/my-selled-products",
    icon: "mdi-check",
  },
  {
    title: "Create/Edit Product",
    value: "/create-product",
    icon: "mdi-plus",
  },
  {
    title: "Categories",
    value: "/categories",
    icon: "mdi-shape",
  },
];
</script>
<style scoped>
.header {
  transition: all 0.2s ease;
}
.header:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
