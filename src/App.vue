<script setup>
/*
* @description : a merchantile application where user-interactive frontend and backend work together
* @author : Gokhan Katar
* @github : https://github.com/gokhankatar
* @x : https://twitter.com/gokhan_crypto/
* @instagram :  https://www.instagram.com/katargokhan96/
*/

import { initFirebase } from "./db/db";
import store from "./store/store";
import { useRouter } from "vue-router";

const router = useRouter();

// first of all initialized firebase
initFirebase();

// auth control
const controlUser = () => {
  const userInfo = localStorage.getItem("userInfo");
  const expDate = localStorage.getItem("expDate");
  const userName = localStorage.getItem("userName");

  try {
    if (Date.now() > Number(expDate)) {
      store.commit("setUserInfo", {});
      localStorage.clear();
      router.replace("/signin");
    }

    // auto logout
    const time = Number(expDate) - Date.now();
    setTimeout(() => {
      store.commit("setUserInfo", {});
      localStorage.clear();
      router.replace("/signin");
    }, time);

    store.commit("setUserInfo", JSON.parse(userInfo));
    store.commit("setFullName", userName);
  } catch (error) {
    console.error(error);
  }
};

controlUser();
</script>

<template>
  <v-app theme="dark">
    <v-container>
      <component :is="$route.meta.layout">
        <router-view />
      </component>
    </v-container>
  </v-app>
</template>


