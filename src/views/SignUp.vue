<template>
  <v-card rounded="xl" class="card-wrapper mx-auto d-flex flex-column ga-2 px-5 py-1">
    <div class="text-center">
      <h1 class="mb-2 mt-10 text-uppercase">Register</h1>
      <img src="../assets/logo-gksoftware.png" class="w-50" />
    </div>

    <div>
      <v-form
        class="d-flex flex-column ga-1"
        ref="formRef"
        @submit.prevent="validate"
        v-model="valid"
        lazy-validation
      >
        <v-text-field
          v-model="model.fullName"
          :rules="modelRules.fullNameRules"
          prepend-inner-icon="mdi-account"
          label="Full name"
          color="blue-grey"
          type="email"
          variant="outlined"
          clearable
        />
        <v-text-field
          v-model="model.email"
          :rules="modelRules.emailRules"
          prepend-inner-icon="mdi-email"
          label="Email"
          color="blue-grey"
          type="email"
          variant="outlined"
          clearable
        />
        <v-text-field
          v-model="model.password"
          :rules="modelRules.passwordRules"
          prepend-inner-icon="mdi-lock"
          label="Password"
          color="blue-grey"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          clearable
        >
          <template v-slot:append-inner>
            <v-icon
              :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click="togglePasswordVisibility"
            />
          </template>
        </v-text-field>
        <v-btn block size="x-large" color="blue-grey" type="submit" variant="outlined"
          >Register</v-btn
        >
      </v-form>
    </div>

    <v-card-actions>
      <a @click="$router.replace('signin')" class="register-link mx-auto">
        Already have an account? Login.
      </a>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { getDb } from "../db/db";
import { ref, reactive } from "vue";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const api_key = import.meta.env.VITE_FIREBASE_API_KEY;
const model = reactive({ fullName: "", email: "", password: "" });
const formRef = ref(null);

// signUp and createUser
const db = getDb();
const signUp = () => {
  axios
    .post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${api_key}`, {
      email: model.email,
      password: model.password,
      returnSecureToken: true,
    })
    .then((res) => { 
      createUser({ // as a parameter of userData
        id: res.data.localId,
        email: model.email,
        fullName: model.fullName,
      });
    });
};

const createUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, "users"), userData);
    router.replace("/signin");
  } catch (error) {
    console.log("You have an error:", error);
  }
};

const validate = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    signUp();
  }
};

// form validations
const modelRules = reactive({
  fullNameRules: [
    (v) => !!v || "Your name and surname is required!",
    (v) => (v && v.length >= 5) || "Name and surname must be longer than 4",
  ],
  emailRules: [
    (v) => !!v || "Email is required!",
    (v) => /.+@.+\..+/.test(v) || "Email must be valid",
  ],
  passwordRules: [
    (v) => !!v || "Password is required!",
    (v) => (v && v.length >= 6) || "Your password must be longer than 5",
  ],
});

const showPassword = ref(false);
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>
<style scoped>
.register-link {
  text-decoration: none;
  color: rgb(158, 151, 151);
  transition: all 0.5s ease;
  cursor: pointer;
}
.register-link:hover {
  color: #fff;
  text-decoration: underline;
}

.card-wrapper {
  box-shadow: 0 0 3rem #607d8b;
}
</style>
