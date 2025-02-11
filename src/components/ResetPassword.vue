<template>
    <div class="min-h-screen flex items-center justify-center">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <h2 class="text-2xl font-bold text-center">Set New Password</h2>
  
        <!-- Success Message -->
        <div v-if="successMessage" class="bg-green-100 text-green-700 p-4 rounded-md">
          {{ successMessage }}
        </div>
  
        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-100 text-red-700 p-4 rounded-md">
          {{ errorMessage }}
        </div>
  
        <form @submit.prevent="resetPassword">
          <input v-model="email" type="email" required class="w-full px-3 py-2 border rounded-md" placeholder="Email" disabled />
          <input v-model="password" type="password" required class="w-full px-3 py-2 border rounded-md mt-3" placeholder="New Password" />
          <input v-model="password_confirmation" type="password" required class="w-full px-3 py-2 border rounded-md mt-3" placeholder="Confirm Password" />
          
          <button type="submit" class="w-full bg-green-700 text-white py-2 mt-3 rounded-md" :disabled="isLoading">
            {{ isLoading ? "Changing..." : "Change Password" }}
          </button>
          <router-link to="/login" class="block text-center text-green-700 mt-3">
            Back to Login
          </router-link>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import axios from "axios";
  
  const route = useRoute();
  const email = ref("");
  const password = ref("");
  const password_confirmation = ref("");
  const errorMessage = ref(null);
  const successMessage = ref(null);
  const isLoading = ref(false);
  
  const resetPassword = async () => {
    errorMessage.value = null;
    successMessage.value = null;
  
    if (password.value !== password_confirmation.value) {
      errorMessage.value = "Passwords do not match.";
      return;
    }
  
    isLoading.value = true;
  
    try {
      await axios.post("http://localhost:8000/api/password/reset", {
        email: email.value,
        password: password.value,
        password_confirmation: password_confirmation.value,
        token: route.query.token, // Ambil token dari URL
      });
  
      successMessage.value = "Password changed successfully. You can now log in.";
      password.value = "";
      password_confirmation.value = "";
    } catch (error) {
      errorMessage.value = error.response?.data?.message || "Failed to reset password.";
    } finally {
      isLoading.value = false;
    }
  };
  
  onMounted(() => {
    email.value = route.query.email || "";
  });
  </script>
  