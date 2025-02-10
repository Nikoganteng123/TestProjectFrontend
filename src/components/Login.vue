<template>
  <!-- Main wrapper div to create a full height layout with flexbox for centering the content -->
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
    style="background-image: url('src/assets/loginbackground.jpg')"
  >
    <!-- Form container with a fixed width and spaced children -->
    <div
      class="max-w-md w-full space-y-8 bg-white bg-opacity-80 p-8 rounded-xl shadow-lg"
    >
      <!-- Logo and title -->
      <div class="flex items-center justify-center mb-6">
        <!-- SVG icon for the logo -->
        <img src="/src/assets/logoipbi.jpg" alt="Logo" class="h-12 w-auto" />
        <!-- Title text -->
        <h2 class="text-2xl font-bold text-center">
          Ikatan Perangkai Bunga Indonesia
        </h2>
      </div>
      <!-- Error message container -->
      <div v-if="errorMessage">
        <p class="bg-red-100 text-red-700 rounded-lg p-4">{{ errorMessage }}</p>
      </div>
      <!-- Login form with onSubmit event handler -->
      <form class="mt-8 space-y-6" @submit.prevent="onSubmit">
        <!-- Hidden input for remember -->
        <input type="hidden" name="remember" value="true" />
        <!-- Input fields container -->
        <div class="rounded-md shadow-sm -space-y-px">
          <!-- Email input field -->
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              v-model="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <!-- Password input field -->
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              v-model="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>
        <!-- Login button container -->
        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
          <!-- Tombol Register -->
          <button
            @click="goToRegisterPage"
            class="group relative w-full flex justify-center py-2 px-4 mt-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Register
          </button>
          <button
            @click="goToHomePage"
            class="group relative w-full flex justify-center py-2 px-4 mt-3 text-sm font-thin rounded-md text-green-700 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Back to Home Page
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
const goToRegisterPage = () => {
  router.push({ name: "register" });
};
const goToHomePage = () => {
  router.push({ name: "home" });
};

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const errorMessage = ref(null);

async function onSubmit() {
  try {
    await axios.get("https://3a81-103-149-116-67.ngrok-free.app/sanctum/csrf-cookie");
    const response = await axios.post("https://3a81-103-149-116-67.ngrok-free.app/api/login", {
      email: email.value,
      password: password.value,
    });
    authStore.setAccessToken(response.data.access_token);
    console.log("Login successful");
    router.push({ name: "home" });
  } catch (error) {
    if (
      error.response &&
      error.response.status === 422 &&
      error.response.data.errors &&
      error.response.data.errors.email
    ) {
      errorMessage.value = error.response.data.errors.email[0];
    } else {
      errorMessage.value = "An error occurred: " + error.message;
    }
    console.error(errorMessage.value);
  }
}
</script>

<style scoped>
/* Styles */
.bg-cover {
  background-size: cover;
}

.bg-center {
  background-position: center;
}

.bg-opacity-80 {
  background-color: rgba(255, 255, 255, 0.8);
}

h2 {
  color: #178677;
}
</style>
