<template>
  <v-row class="d-flex flex-wrap ga-5">
    <v-col
      v-for="item of productData"
      :key="item"
      cols="12"
      sm="12"
      xs="12"
      md="4"
      lg="4"
      xl="4"
    >
      <v-card class="card" hover>
        <v-img
          :src="imgUrl + item.image + '?alt=media'"
          :lazy-src="imgUrl + item.image + '?alt=media'"
          max-height="300px"
          contain
          cover
          object-position="center"
        />
        <v-card-title>{{ item.name }}</v-card-title>
        <v-card-subtitle class="my-2">{{ item.price }} $</v-card-subtitle>
        <v-card-subtitle>
          <v-chip size="small" prepend-icon="mdi-shape">{{ item.category.name }}</v-chip>
        </v-card-subtitle>

        <v-card-actions>
          <v-btn
            class="bg-blue-grey border-none"
            size="small"
            rounded="xl"
            variant="outlined"
            >detail</v-btn
          >

          <v-spacer></v-spacer>
          <v-tooltip v-if="item.userId !== $store.getters.getUserId" location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                @click="addMySaved(item)"
                v-bind="props"
                color="primary"
                :icon="item.isSaved == false ? 'mdi-bookmark-outline' : 'mdi-bookmark'"
              />
            </template>
            Save
          </v-tooltip>

          <v-tooltip v-if="item.userId !== $store.getters.getUserId" location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                @click="addMyFavorites(item)"
                v-bind="props"
                color="red"
                :icon="item.isFav == false ? 'mdi-heart-outline' : 'mdi-heart'"
              />
            </template>
            Favorite
          </v-tooltip>

          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                @click="shareData(item)"
                v-bind="props"
                color="green"
                icon="mdi-share"
              />
            </template>
            Share
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <v-snackbar v-model="isAddedFav" color="red">Added to your favorites</v-snackbar>
  <v-snackbar v-model="isAddedSave" color="primary">Added to your saved</v-snackbar>
</template>

<script setup>
import { onMounted, ref } from "vue";
import store from "../store/store";
import { useRoute } from "vue-router";
import { getDb } from "../db/db";
import { collection, getDocs, where, query, addDoc, deleteDoc } from "firebase/firestore";

const route = useRoute();

const myFavorites = ref([]);
const mySaved = ref([]);
const isAddedFav = ref(false);
const isAddedSave = ref(false);

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
    const arr = [...productData.value];
    const idx = arr.findIndex((i) => i.id === item.id);
    arr[idx].isFav = true;
    productData.value = [...arr];

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
    const arr = [...productData.value];
    const idx = arr.findIndex((i) => i.id === item.id);
    arr[idx].isFav = false;
    productData.value = [...arr];
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
    const arr = [...productData.value];
    const idx = arr.findIndex((i) => i.id === item.id);
    arr[idx].isSaved = true;
    productData.value = [...arr];

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
    const arr = [...productData.value];
    const idx = arr.findIndex((i) => i.id === item.id);
    arr[idx].isSaved = false;
    productData.value = [...arr];
  }
};

// control favorite item
const getMyFavorites = async () => {
  const favRef = collection(db, "favorites");
  const q = query(favRef, where("favUserId", "==", store.getters.getUserId));
  const qs = await getDocs(q);
  qs.forEach((doc) => {
    myFavorites.value.push(doc.data());
  });
};

// control saved item
const getMySaved = async () => {
  const favRef = collection(db, "saved");
  const q = query(favRef, where("savedUserId", "==", store.getters.getUserId));
  const qs = await getDocs(q);
  qs.forEach((doc) => {
    mySaved.value.push(doc.data());
  });
};

// share
const shareData = async (item) => {
  try {
    const sharedData = {
      title: item.name,
      text: item.description,
      url: window.location.origin,
    };
    await navigator.share(sharedData);
  } catch (error) {
    console.error(error);
  }
};

const imgUrl = import.meta.env.VITE_FIRESTORAGE_IMG_URL;
const productData = ref([]);
const db = getDb();

onMounted(async () => {
  await getMyFavorites();
  await getMySaved();

  if (route.query.q) {
  } else {
    const qs = await getDocs(collection(db, "products"));
    qs.forEach((doc) => {
      const data = doc.data();
      const findedFav = myFavorites.value.find(
        (f) => f.favUserId == store.getters.getUserId && f.id == doc.id
      );
      const findedSaved = mySaved.value.find(
        (f) => f.savedUserId == store.getters.getUserId && f.id == doc.id
      );

      if (findedFav) {
        data.isFav = true;
      } else {
        data.isFav = false;
      }

      if (findedSaved) {
        data.isSaved = true;
      } else {
        data.isSaved = false;
      }

      productData.value.push({
        ...data,
        id: doc.id,
      });
    });
  }
});
</script>

<style scoped>
.card {
  transition: all 0.4s ease;
}
.card:hover {
  scale: 1.1;
  box-shadow: 0 0 2rem #668290;
}
</style>
