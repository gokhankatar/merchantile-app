<template>
  <v-card rounded="xl" class="card-wrapper mx-auto d-flex flex-column ga-2 pa-5">
    <div class="text-center">
      <h1 class="mb-2 mt-10 text-uppercase">Login</h1>
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
          v-model="model.email"
          prepend-inner-icon="mdi-email"
          :rules="modelRules.emailRules"
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
          >Login</v-btn
        >
        <p v-if="error" class="my-1 text-subtitle text-center font-weight-bold text-red">
          Email or password is wrong!
        </p>
      </v-form>
    </div>

    <v-card-actions>
      <a @click="$router.replace('/signup')" class="register-link mx-auto">
        Don't have an account? Sign up now
      </a>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import axios from "axios";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getDb } from "../db/db";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const api_key = import.meta.env.VITE_FIREBASE_API_KEY;
const error = ref(false);

// form and validations
const formRef = ref(null);
const model = reactive({ email: "", password: "" });

const modelRules = reactive({
  emailRules: [
    (v) => !!v || "Email is required!",
    (v) => /.+@.+\..+/.test(v) || "Email must be valid",
  ],
  passwordRules: [
    (v) => !!v || "Password is required!",
    (v) => (v && v.length >= 6) || "Your password must be longer than 5",
  ],
});

// signin
const db = getDb();
const onLogin = () => {
  axios
    .post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api_key}`,
      {
        email: model.email,
        password: model.password,
        returnSecureToken: true,
      }
    )
    .then(async (res) => {
      // auth expires date
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      localStorage.setItem("expDate", Date.now() + Number(res.data.expiresIn) * 1000);

      // get userInfo from docs
      const docRef = collection(db, "users");
      const q = query(docRef, where("id", "==", res.data.localId));
      const qs = await getDocs(q);
      const userData = qs.docs[0].data();

      // save to store
      localStorage.setItem("userName", userData.fullName);
      store.commit("setFullName", userData.fullName);
      store.commit("setUserInfo", res.data);

      // after login with successfully
      error.value = false;
      router.replace("/");
    })
    // ! error state
    .catch((e) => {
      error.value = true;
      console.log(e);
    });
};

const validate = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    onLogin();
  }
};

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
