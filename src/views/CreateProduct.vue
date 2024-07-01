<script setup>
/*
* @description : a merchantile application where user-interactive frontend and backend work together
* @author : Gokhan Katar
* @github : https://github.com/gokhankatar
* @x : https://twitter.com/gokhan_crypto/
* @instagram :  https://www.instagram.com/katargokhan96/
*/

import { addDoc, collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import {
  getStorage,
  uploadBytes,
  ref as storageRef,
  deleteObject,
} from "firebase/storage";
import { onMounted, ref, reactive } from "vue";
import { getDb } from "../db/db";
import { useRoute, useRouter } from "vue-router";
import store from "../store/store";

const route = useRoute();
const router = useRouter();

const formRef = ref(null);
const isValid = ref(true);
const db = getDb();
const imgUrl = import.meta.env.VITE_FIRESTORAGE_IMG_URL;

const categoriesData = reactive([]);

// model for binding
const model = reactive({
  name: "",
  description: "",
  price: 1,
  address: "",
  category: "",
  file: "",
  imageUrl: "",
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
  file: [(v) => !!v || "File is required!"],
});

const upLoadImage = async () => {
  try {
    const storage = getStorage();
    const fileName = Date.now().toString() + "_" + model.file.name;
    const imageRef = storageRef(storage, "images/" + fileName); 
    const data = await uploadBytes(imageRef, model.file);
    return fileName;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
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
      userId: store.getters.getUserId, // from store
    });
    router.replace("/");
  } catch (error) {
    console.error(error);
  }
};

// before delete data for edit product
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

// edit product
const editProduct = async () => {
  try {
    const docRef = doc(db, "products", route.params.id);
    let file = model.imageUrl.split("%2F")[1].split("?")[0];
    if (model.file) {
      await deleteFile(file);
      const newFileName = await upLoadImage();
      file = newFileName;
    }
    const updateData = {
      name: model.name,
      description: model.description,
      price: model.price,
      address: model.address,
      category: model.category,
      userId: store.getters.getUserId,
      image: file,
    };
    await setDoc(docRef, updateData);
    router.replace('/my-products');
  } catch (error) {
    console.error("Error editing product:", error);
  }
};

// form validate
const validate = async () => {
  const { valid } = await formRef.value.validate();
  if (!model.file && model.imageUrl === "") {
    modelRules.file = true;
  } else {
    modelRules.file = false;
  }
  if ((valid && model.file) || model.imageUrl) {
    if (route.params.id) {
      editProduct();
      // todo
    } else {
      createProduct();
    }
  }
};

// get product infos
const getProductDetail = async (id) => {
  const docRef = doc(db, "products", id);
  const ds = await getDoc(docRef);

  if (ds.exists()) {
    model.name = ds.data().name;
    model.description = ds.data().description;
    model.price = ds.data().price;
    model.address = ds.data().address;
    model.category = ds.data().category;
    model.imageUrl = imgUrl + ds.data().image + "?alt=media";
  } else {
    router.replace("/");
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
    getProductDetail(route.params.id);
  }
});
</script>

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
            <v-avatar
              class="mb-4"
              :image="model.imageUrl"
              v-if="model.imageUrl"
              size="80"
            />
            <v-file-input
              class="my-2"
              v-model="model.file"
              :rules="modelRules.file"
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

