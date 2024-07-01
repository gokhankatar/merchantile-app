<script setup>
/*
* @description : a merchantile application where user-interactive frontend and backend work together
* @author : Gokhan Katar
* @github : https://github.com/gokhankatar
* @x : https://twitter.com/gokhan_crypto/
* @instagram :  https://www.instagram.com/katargokhan96/
*/

import { ref, onMounted } from "vue";
import { getDb } from "../db/db";
import Loading from "../components/Loading.vue";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useStore } from "vuex";

const store = useStore();

const isLoading = ref(false);
let totalPrice = ref(0);
const mySelledProducts = ref([]);

const imgUrl = import.meta.env.VITE_FIRESTORAGE_IMG_URL;
const db = getDb();

onMounted(async () => {
  isLoading.value = true;

  const mySelledProductsRef = collection(db, "selled");
  const q = query(mySelledProductsRef, where("userId", "==", store.getters.getUserId));
  const qs = await getDocs(q);
  qs.forEach((doc) => {
    totalPrice.value += Number(doc.data().price);
    mySelledProducts.value.push({
      ...doc.data(),
      id: doc.id,
    });
  });

  isLoading.value = false;
});
</script>

<template>
  <div
    v-if="isLoading === false && mySelledProducts.length === 0"
    class="d-flex justify-center align-center"
  >
    <h3 class="text-subtitle-1 text-sm-h3">Sorry no selled products available yet!</h3>
  </div>

  <v-table v-if="isLoading === false && mySelledProducts.length >= 1" class="my-10" hover>
    <thead>
      <tr>
        <th>Preview</th>
        <th>Product</th>
        <th>Price</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of mySelledProducts" :key="item">
        <td class="my-3 text-uppercase">
          <v-img :src="imgUrl + item.image + '?alt=media'" width="100" />
        </td>
        <td>{{ item.name }}</td>
        <td>{{ item.price }} $</td>
        <td>{{ item.description }}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td class="text-green font-weight-bold">
          Total Earn :
          {{ totalPrice }}
          $
        </td>
      </tr>
    </tfoot>
  </v-table>

  <!-- Loading bar -->
  <Loading v-if="isLoading" />
</template>
