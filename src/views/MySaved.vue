<script setup>
/*
* @description : a merchantile application where user-interactive frontend and backend work together
* @author : Gokhan Katar
* @github : https://github.com/gokhankatar
* @x : https://twitter.com/gokhan_crypto/
* @instagram :  https://www.instagram.com/katargokhan96/
*/

import Loading from "../components/Loading.vue";
import { ref, onMounted } from "vue";
import { getDb } from "../db/db";
import { collection, doc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const isLoading = ref(false);
const isRemovedSaved = ref(false);
const mySaved = ref([]);

const imgUrl = import.meta.env.VITE_FIRESTORAGE_IMG_URL;
const db = getDb();
const getMySaved = async () => {
  const savedRef = collection(db, "saved");
  const q = query(savedRef, where("savedUserId", "==", store.getters.getUserId));
  const qs = await getDocs(q);
  if (qs.docs.length === 0) {
    router.replace("/");
  } else {
    qs.forEach((doc) => {
      mySaved.value.push({
        ...doc.data(),
        id: doc.id,
      });
    });
  }
};

const removeSaved = async (item) => {
  isRemovedSaved.value = true;

  const docRef = doc(db, "saved", item.id);
  await deleteDoc(docRef);
  const arr = [...mySaved.value];
  mySaved.value = [...arr.filter((i) => i.id !== item.id)];
  if (mySaved.value.length === 0) {
    setTimeout(() => {
      router.replace("/");
    }, 2000);
  }
  setTimeout(() => {
    isRemovedSaved.value = false;
  }, 2000);
};

onMounted(() => {
  isLoading.value = true;
  getMySaved();
  isLoading.value = false;
});
</script>

<template>
  <div
    v-if="isLoading === false && mySaved.length === 0"
    class="d-flex justify-center align-center"
  >
    <h3 class="text-subtitle-1 text-sm-h3">
      Sorry no saved available yet! You are directed to the home page
    </h3>
  </div>

  <v-table v-if="isLoading === false && mySaved.length >= 1" class="my-10" hover>
    <thead>
      <tr>
        <th>Preview</th>
        <th>Product</th>
        <th>Price</th>
        <th>Description</th>
        <th>Delete</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="item of mySaved" :key="item">
        <td class="my-3 text-uppercase">
          <v-img :src="imgUrl + item.image + '?alt=media'" width="100" />
        </td>
        <td>{{ item.name }}</td>
        <td>{{ item.price }} $</td>
        <td>{{ item.description }}</td>
        <td>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                @click="removeSaved(item)"
                v-bind="props"
                color="red"
                icon="mdi-delete"
              />
            </template>
            Remove from your saved
          </v-tooltip>
        </td>
      </tr>
    </tbody>
  </v-table>

  <!-- toast -->
  <v-snackbar v-model="isRemovedSaved" color="red">Removed from your saved !</v-snackbar>

  <!-- Loading bar -->
  <Loading v-if="isLoading" />
</template>


