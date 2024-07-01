<template>
  <div
    v-if="isLoading === false && myProductsData.length === 0"
    class="d-flex justify-center align-center"
  >
    <h3 class="text-subtitle-1 text-sm-h4 text-md-h3">
      Sorry no products available yet!
    </h3>
  </div>

  <v-table v-if="isLoading == false && myProductsData.length > 0" class="my-10" hover>
    <thead>
      <tr>
        <th>Preview</th>
        <th>Product</th>
        <th>Price</th>
        <th>Description</th>
        <th>Edit/Delete</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="item of myProductsData" :key="item">
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
                @click="setSelled(item)"
                v-bind="props"
                color="green"
                icon="mdi-check"
              />
            </template>
            Mark as sold
          </v-tooltip>

          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                @click="$router.replace('/edit-product/' + item.id)"
                v-bind="props"
                color="primary"
                icon="mdi-file-edit"
              />
            </template>
            Edit your product
          </v-tooltip>

          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                @click="deleteMyProduct(item)"
                v-bind="props"
                color="red"
                icon="mdi-delete"
              />
            </template>
            Delete
          </v-tooltip>
        </td>

        <!-- v-dialog -->
        <v-dialog
          v-model="dialog"
          max-width="400"
          transition="dialog-bottom-transition"
          close-on-back
        >
          <v-card class="bg-blue-grey pa-2">
            <v-card-text class="text-justify"
              >Are you sure you want to delete the product?</v-card-text
            >
            <v-card-actions class="d-flex">
              <v-btn
                @click="cancelProduct"
                class="border-none bg-warning"
                variant="outlined"
                >Close</v-btn
              >
              <v-btn
                @click="removeMyProduct"
                class="border-none bg-red"
                variant="outlined"
                >Delete</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </tr>
    </tbody>
  </v-table>

  <!-- toast -->
  <v-snackbar v-model="isRemovedProduct" color="red"
    >Removed from your products !</v-snackbar
  >

  <!-- Loading bar -->
  <Loading v-if="isLoading" />
</template>
<script setup>
import { ref, onMounted } from "vue";
import { getDb } from "../db/db.js";
import Loading from "../components/Loading.vue";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useStore } from "vuex";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const isLoading = ref(false);
const dialog = ref(false);
const isRemovedProduct = ref(false);
const actionItem = ref({});
const myProductsData = ref([]);
const db = getDb();
const imgUrl = import.meta.env.VITE_FIRESTORAGE_IMG_URL;

const cancelProduct = () => {
  dialog.value = false;
  actionItem.value = {};
};

const setSelled = async (item) => {
  try {
    const docRef = doc(db, "products", item.id);
    await deleteDoc(docRef);
    addDoc(collection(db, "selled"), item).then(() => {
      router.replace("/my-selled-products");
    });
  } catch (error) {
    console.error(error);
  }
};

// before update actionItem for deleting
const deleteMyProduct = (item) => {
  dialog.value = !dialog.value;
  actionItem.value = item;
};

// remove product from firebase/storage
const deleteFile = async (img) => {
  try {
    const storage = getStorage();
    const fName = img;
    const fileRef = storageRef(storage, "images/" + fName);
    const response = await deleteObject(fileRef);
  } catch (error) {
    console.error(error);
  }
};

// remove from database and update myProductsData
const removeMyProduct = async () => {
  try {
    await deleteFile(actionItem.value.image);
    const docRef = doc(db, "products", actionItem.value.id);
    await deleteDoc(docRef);
    myProductsData.value = myProductsData.value.filter(
      (product) => product.id !== actionItem.value.id
    );
    dialog.value = false;
    isRemovedProduct.value = true;
    setTimeout(() => {
      isRemovedProduct.value = false;
    }, 2000);
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  isLoading.value = true;

  const myProductRef = collection(db, "products");
  const q = query(myProductRef, where("userId", "==", store.getters.getUserId));
  const qs = await getDocs(q);
  qs.forEach((doc) => {
    myProductsData.value.push({
      ...doc.data(),
      id: doc.id,
    });
  });

  isLoading.value = false;
});
</script>
<style scoped></style>
