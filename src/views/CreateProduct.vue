<template>
  <v-row>
    <v-col>
      <v-card>
        <div class="text-center">
          <h1 class="my-5">{{ $route.params.id ? "Edit Product" : "Create Product" }}</h1>
        </div>
        <v-card-text>
          <v-form
            v-model="isValid"
            @submit.prevent="validate"
            lazy-validation
            ref="formRef"
          >
            <v-text-field
              v-model="model.name"
              :rules="modelRules.nameRules"
              type="text"
              color="blue-grey"
              required
              autofocus
              clearable
              label="Product name"
              prepend-inner-icon="mdi-pen"
              variant="outlined"
            />
            <v-textarea
              class="my-2"
              v-model="model.description"
              :rules="modelRules.descriptionRules"
              counter="140"
              color="blue-grey"
              required
              autofocus
              clearable
              label="Product details"
              prepend-inner-icon="mdi-comment"
              variant="outlined"
            />
            <v-text-field
              class="my-2"
              v-model="model.price"
              :rules="modelRules.priceRules"
              type="number"
              color="blue-grey"
              prefix="$"
              required
              autofocus
              clearable
              min="1"
              label="Product price"
              prepend-inner-icon="mdi-cash"
              variant="outlined"
            />
            <v-textarea
              class="my-2"
              v-model="model.address"
              :rules="modelRules.addressRules"
              counter="70"
              color="blue-grey"
              required
              autofocus
              clearable
              label="Address"
              prepend-inner-icon="mdi-map-marker"
              variant="outlined"
            />
            <v-select
              class="my-2"
              v-model="model.category"
              :rules="modelRules.categoryRules"
              :items="categoriesData"
              variant="outlined"
              required
              clearable
              item-title="name"
              item-value="id"
              return-object
              label="Category"
            />
            <v-file-input
              class="my-2"
              v-model="model.file"
              :rules="modelRules.file"
              :error="true"
              :error-messages="'errrooor'"
              color="blue-grey"
              :prepend-icon="null"
              prepend-inner-icon="mdi-file"
              required
              variant="outlined"
              label="Product-image"
              accept="image/png,image/jpeg,image/jpg"
              clearable
              show-size
            />

            <v-btn block color="blue-grey" type="submit">{{
              $route.params.id ? "Save" : "Create"
            }}</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { addDoc, collection, getDocs } from "firebase/firestore";
import { getStorage, uploadBytes, ref as fileRef } from "firebase/storage";
import { onMounted, ref, reactive } from "vue";
import { getDb } from "../db/db";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const formRef = ref(null);
const isValid = ref(true);
const db = getDb();

const categoriesData = reactive([]);

// upload image
const upLoadImage = async () => {
  const storage = getStorage();
  const fileName = Date.now().toString() + "_" + model.file[0].name;
  const imageRef = fileRef(storage, "images/" + fileName);
  const data = await uploadBytes(imageRef, model.file[0]);
  return fileName;
};

// create product
const createProduct = async () => {
  try {
    const fileName = await upLoadImage();
    const docRef = await addDoc(collection(db, "products"), {
      name: model.name,
      description: model.description,
      price: model.price,
      address: model.address,
      image: fileName,
      category: model.category,
      userId: "", // from store
    });
    router.replace("/");
  } catch (error) {
    console.error(error);
  }
};

// model for binding
const model = reactive({
  name: "",
  description: "",
  price: 1,
  address: "",
  category: "",
  file: "",
});

// model rules for form validation
const modelRules = reactive({
  nameRules: [
    (v) => !!v || "Product name is required!",
    (v) => (v && v.length >= 2) || "Product name must be longer than 1",
  ],
  descriptionRules: [
    (v) => !!v || "Product detail is required!",
    (v) => (v && v.length >= 10) || "Description must be longer than 9",
  ],
  priceRules: [(v) => !!v || "Price is required!"],
  addressRules: [
    (v) => !!v || "Address is required!",
    (v) => (v && v.length >= 6) || "Description must be longer than 5",
  ],
  categoryRules: [(v) => !!v || "Category is required!"],
  file: false,
});

// form validate
const validate = async () => {
  const { valid } = await formRef.value.validate();
  if (!model.file) {
    modelRules.file = true;
  } else {
    modelRules.file = false;
  }
  if (valid && model.file) {
    if (route.params.id) {
      //todo edit
    } else {
      createProduct();
    }
  }
};

// first of all query from database
onMounted(async () => {
  const qs = await getDocs(collection(db, "categories"));
  qs.forEach((item) => {
    categoriesData.push({
      ...item.data(),
      id: item.id,
    });
  });

  if (route.params.id) {
    //TODO düzenleme
  }
});
</script>
<style scoped></style>
