<template>
  <div
    v-if="isLoading === false && myFavorites.length === 0"
    class="d-flex justify-center align-center"
  >
    <h3 class="text-subtitle-1 text-sm-h3">Sorry no favorites available yet! You are directed to the home page</h3>
  </div>

  <v-table
    v-if="myFavorites.length >= 1"
    class="my-10"
    hover
    v-show="isLoading === false"
  >
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
      <tr v-for="item of myFavorites" :key="item">
        <td class="my-3 text-uppercase">
          <v-img :src="imgUrl + item.image + '?alt=media'" width="100" height="100" />
        </td>
        <td>{{ item.name }}</td>
        <td>{{ item.price }} $</td>
        <td>{{ item.description }}</td>
        <td>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                @click="removeFavorites(item)"
                v-bind="props"
                color="red"
                icon="mdi-delete"
              />
            </template>
            Remove from your favorites
          </v-tooltip>
        </td>
      </tr>
    </tbody>
  </v-table>

  <!-- toast -->
  <v-snackbar v-model="isRemovedFav" color="red"
    >Removed from your favorites !</v-snackbar
  >

  <!-- Loading bar -->
  <Loading v-if="isLoading" />
</template>
<script setup>
import Loading from "../components/Loading.vue";
import { ref, onMounted } from "vue";
import { getDb } from "../db/db";
import { collection, doc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const isLoading = ref(false);
const isRemovedFav = ref(false);
const myFavorites = ref([]);

const imgUrl = import.meta.env.VITE_FIRESTORAGE_IMG_URL;
const db = getDb();
const getMyFavorites = async () => {
  const favRef = collection(db, "favorites");
  const q = query(favRef, where("favUserId", "==", store.getters.getUserId));
  const qs = await getDocs(q);
  if (qs.docs.length === 0) {
    router.replace("/");
  } else {
    qs.forEach((doc) => {
      myFavorites.value.push({
        ...doc.data(),
        id: doc.id,
      });
    });
  }
};

const removeFavorites = async (item) => {
  isRemovedFav.value = true;

  const docRef = doc(db, "favorites", item.id);
  await deleteDoc(docRef);
  const arr = [...myFavorites.value];
  myFavorites.value = [...arr.filter((i) => i.id !== item.id)];
  if (myFavorites.value.length === 0) {
    setTimeout(() => {
      router.replace("/");
    }, 2000);
  }
  setTimeout(() => {
    isRemovedFav.value = false;
  }, 2000);
};

onMounted(() => {
  isLoading.value = true;
  getMyFavorites();
  isLoading.value = false;
});
</script>
<style scoped></style>
