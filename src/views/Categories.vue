<template>
  <div
    v-if="isLoading === false && categoriesData.length === 0"
    class="d-flex justify-center align-center"
  >
    <h3 class="text-subtitle-1 text-sm-h3">Sorry no categories available yet!</h3>
  </div>

  <v-table class="my-10" hover v-show="isLoading === false">
    <thead>
      <tr>
        <th>Category</th>
        <th>See</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="item of categoriesData" :key="item">
        <td class="my-3 text-uppercase">{{ item.name }}</td>
        <td>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                @click="$router.replace('/?q=' + item.name + '-' + item.id)"
                v-bind="props"
                color="blue-grey"
                icon="mdi-eye"
              />
            </template>
            Go to category
          </v-tooltip>
        </td>
      </tr>
    </tbody>
  </v-table>

  <!-- Loading bar -->
  <Loading v-if="isLoading" />
</template>
<script setup>
import Loading from "../components/Loading.vue";
import { ref, onMounted } from "vue";
import { getDb } from "../db/db";
import { collection, getDocs } from "firebase/firestore";

const db = getDb();
const isLoading = ref(false);
const categoriesData = ref([]);

onMounted(async () => {
  isLoading.value = true;
  const qs = await getDocs(collection(db, "categories"));
  qs.forEach((doc) => {
    categoriesData.value.push({
      ...doc.data(),
      id: doc.id,
    });
  });
  isLoading.value = false;
});
</script>
