<template>
  <!-- Main wrapper div to create a full height layout with flexbox for centering the
  content -->
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px6 lg:px-8"
  >
    <!-- Form container with a fixed width and spaced children -->
    <div class="max-w-md w-full space-y-8 text-gray-700">
      <!-- Logo and title -->
      <div class="flex items-center justify-center">
        <!-- SVG icon for the logo -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-10 h-10"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-
.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513
7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0
01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        <!-- Title text -->
        <h2 class="text-2xl font-bold">Online Shop</h2>
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
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outlinenone focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outlinenone focus:ring-blue-500 focus:border-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>
        <!-- Login button container -->
        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border bordertransparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
// Import required dependencies and hooks
import { ref } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
// Initialize required variables and hooks
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
// Reactive data to store user input and error messages
const email = ref("");
const password = ref("");
const errorMessage = ref(null);
// Function to handle form submission
async function onSubmit() {
  try {
    // Fetch CSRF token
    await axios.get("http://localhost:8000/sanctum/csrf-cookie");
    // Send login request
    const response = await axios.post("http://localhost:8000/api/login", {
      email: email.value,
      password: password.value,
    });
    // Save access token and navigate to the home page
    authStore.setAccessToken(response.data.access_token);
    console.log("Login successful");
    router.push({ name: "home" });
  } catch (error) {
    // Check if the error is due to validation
    if (
      error.response &&
      error.response.status === 422 &&
      error.response.data.errors &&
      error.response.data.errors.email
    ) {
      // Set the error message from the server response
      errorMessage.value = error.response.data.errors.email[0];
    } else {
      // Set a generic error message
      errorMessage.value = "An error occurred: " + error.message;
    }
    console.error(errorMessage.value);
  }
}
</script>
<style>
/* styles here */
</style>
