<script setup>
/*
* @description : a merchantile application where user-interactive frontend and backend work together
* @author : Gokhan Katar
* @github : https://github.com/gokhankatar
* @x : https://twitter.com/gokhan_crypto/
* @instagram :  https://www.instagram.com/katargokhan96/
*/

import { onMounted, ref } from "vue";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getDb } from "../db/db";
import { useRoute, useRouter } from "vue-router";
import store from "../store/store";

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const imgUrl = import.meta.env.VITE_FIRESTORAGE_IMG_URL;
const isAddedFav = ref(false);
const isAddedSave = ref(false);
let productDetailData = ref({});
let userData = ref({});

// added favorites
const addMyFavorites = async (item) => {
  const favRef = collection(db, "favorites");
  const q = query(favRef, where("favUserId", "==", store.getters.getUserId));
  const qs = await getDocs(q);
  const isExist = qs.docs.length;

  // add favorites collection in database
  if (!isExist) {
    const docRef = await addDoc(collection(db, "favorites"), {
      ...item,
      favUserId: store.getters.getUserId,
    });
    const val = { ...productDetailData.value };
    val.isFav = true;
    productDetailData.value = val;

    isAddedFav.value = true;
    setTimeout(() => {
      isAddedFav.value = false;
    }, 2000);
  }
  // remove from favorites collection in database
  else {
    const q = query(
      favRef,
      where("favUserId", "==", store.getters.getUserId),
      where("id", "==", item.id)
    );
    const qs = await getDocs(q);
    await deleteDoc(qs.docs[0].ref);
    const val = { ...productDetailData.value };
    val.isFav = false;
    productDetailData.value = val;
  }
};

// added saved
const addMySaved = async (item) => {
  const savedRef = collection(db, "saved");
  const q = query(savedRef, where("savedUserId", "==", store.getters.getUserId));
  const qs = await getDocs(q);
  const isExist = qs.docs.length;

  // add saved collection in database
  if (!isExist) {
    const docRef = await addDoc(collection(db, "saved"), {
      ...item,
      savedUserId: store.getters.getUserId,
    });
    const val = { ...productDetailData.value };
    val.isSaved = true;
    productDetailData.value = val;

    isAddedSave.value = true;
    setTimeout(() => {
      isAddedSave.value = false;
    }, 2000);
  }
  // remove from saved collection in database
  else {
    const q = query(
      savedRef,
      where("savedUserId", "==", store.getters.getUserId),
      where("id", "==", item.id)
    );
    const qs = await getDocs(q);
    await deleteDoc(qs.docs[0].ref);
    const val = { ...productDetailData.value };
    val.isSaved = false;
    productDetailData.value = val;
  }
};

// control favorite item
const getMyFavorites = async () => {
  const favRef = collection(db, "favorites");
  const q = query(
    favRef,
    where("favUserId", "==", store.getters.getUserId),
    where("id", "==", route.params.id)
  );
  const qs = await getDocs(q);
  return qs.docs.length > 0;
};

// control saved item
const getMySaved = async () => {
  const favRef = collection(db, "saved");
  const q = query(
    favRef,
    where("savedUserId", "==", store.getters.getUserId),
    where("id", "==", route.params.id)
  );
  const qs = await getDocs(q);
  return qs.docs.length > 0;
};

const db = getDb();
const getData = async (id) => {
  const docRef = doc(db, "products", id);
  const ds = await getDoc(docRef);

  if (ds.exists()) {
    const isFav = await getMyFavorites();
    const isSaved = await getMySaved();
    const d = {
      ...ds.data(),
      id: ds.id,
      isFav: false,
      isSaved: false,
    };
    productDetailData.value = { ...d, isSaved, isFav };
    const userRef = collection(db, "users");
    const q = query(userRef, where("id", "==", d.userId));
    const qs = await getDocs(q);
    userData.value = qs.docs[0].data();
  } else {
    router.replace("/");
  }
};

onMounted(() => {
  isLoading.value = true;
  getData(route.params.id);
  isLoading.value = false;
});
</script>

<template>
  <v-row v-if="isLoading == false">
    <div class="my-10 w-100 d-flex flex-column align-sm-center flex-sm-row ga-2 ga-sm-5">
      <v-img
        :src="imgUrl + productDetailData.image + '?alt=media'"
        class="rounded"
        max-height="400px"
        max-width="700"
      />
      <div>
        <v-tooltip v-if="userData?.id !== $store.getters.getUserId" location="top">
          <template v-slot:activator="{ props }">
            <v-icon
              @click="addMySaved(productDetailData)"
              class="cursor-pointer"
              v-bind="props"
              color="primary"
              :icon="
                productDetailData.isSaved == false
                  ? 'mdi-bookmark-outline'
                  : 'mdi-bookmark'
              "
            />
          </template>
          Save
        </v-tooltip>

        <v-tooltip v-if="userData?.id !== $store.getters.getUserId" location="top">
          <template v-slot:activator="{ props }">
            <v-icon
              @click="addMyFavorites(productDetailData)"
              class="cursor-pointer"
              v-bind="props"
              color="red"
              :icon="productDetailData.isFav == false ? 'mdi-heart-outline' : 'mdi-heart'"
            />
          </template>
          Favorite
        </v-tooltip>

        <h2 class="text-h2 my-5">Seller Info</h2>
        <p>
          <span class="text-subtitle-1 text-primary font-weight-bold">Seller :</span>
          {{ userData?.fullName }}
        </p>
        <p>
          <span class="text-subtitle-1 text-primary font-weight-bold">Email :</span>
          {{ userData?.email }}
        </p>
        <h2 class="text-h2 my-5">Product Info</h2>
        <p>
          <span class="text-subtitle-1 text-primary font-weight-bold">Address :</span>
          {{ productDetailData?.address }}
        </p>
        <p>
          <span class="text-subtitle-1 text-primary font-weight-bold">Price :</span>
          {{ productDetailData?.price }} $
        </p>
        <p>
          <span class="text-subtitle-1 text-primary font-weight-bold">Description :</span>
          {{ productDetailData?.description }}
        </p>
        <p>
          <span class="text-subtitle-1 text-primary font-weight-bold">Category :</span>
          {{ productDetailData?.category?.name }}
        </p>
      </div>
    </div>
  </v-row>

  <!-- toast -->
  <v-snackbar v-model="isAddedFav" color="red">Added to your favorites</v-snackbar>
  <v-snackbar v-model="isAddedSave" color="primary">Added to your saved</v-snackbar>

  <!-- loading bar -->
  <v-progress-circular
    class="loading-bar"
    v-if="isLoading"
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
