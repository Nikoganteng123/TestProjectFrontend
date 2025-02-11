<template>
  <!-- Main wrapper div to create a full height layout with flexbox for centering the content -->
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
    style="background-image: url('src/assets/loginbackground.jpg')"
  >
    <!-- Form container with a fixed width and spaced children -->
    <div class="max-w-md w-full space-y-8 bg-white bg-opacity-80 p-8 rounded-xl shadow-lg">
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

      <!-- Success message container -->
      <div v-if="successMessage">
        <p class="bg-green-100 text-green-700 rounded-lg p-4">{{ successMessage }}</p>
      </div>

      <!-- Forgot Password form with onSubmit event handler -->
      <form @submit.prevent="sendResetLink" class="mt-8 space-y-6">
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
            placeholder="Enter your email"
            :disabled="isLoading"
          />
        </div>

        <!-- Send reset link button -->
        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="isLoading"
          >
            {{ isLoading ? "Sending..." : "Send Reset Link" }}
          </button>
        </div>

        <!-- Back to login link -->
        <div>
          <router-link
            to="/login"
            class="group relative w-full flex justify-center py-2 px-4 mt-3 text-sm font-thin rounded-md text-green-700 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Back to Login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const successMessage = ref(null);
const errorMessage = ref(null);
const isLoading = ref(false);

const sendResetLink = async () => {
  if (!email.value.trim()) {
    errorMessage.value = "Please enter a valid email address.";
    successMessage.value = null;
    return;
  }

  isLoading.value = true; // Set loading state to true

  try {
    await axios.post("http://10.4.12.215:8000/api/password/email", {
      email: email.value,
    });
    successMessage.value = "Password reset link has been sent to your email.";
    errorMessage.value = null;
  } catch (error) {
    errorMessage.value = "Failed to send reset link. Please try again.";
    successMessage.value = null;
  } finally {
    isLoading.value = false; // Reset loading state
  }
};
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
