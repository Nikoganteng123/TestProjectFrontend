<template>
  <!-- Navigation bar -->
  <nav v-if="authStore.isLoggedIn" class="bg-gray-800 p-4 px-8 flex">
    <!-- Home link -->
    <RouterLink to="/" class="text-white hover:text-gray-200 transition-colors"
      >Home</RouterLink
    >
    <!-- Users link -->
    <RouterLink
      to="/users"
      class="ml-4 text-white hover:text-gray-200 transition-colors"
      >Users</RouterLink
    >
    <!-- Logout button -->
    <button
      @click="logout"
      class="ml-auto text-white hover:text-gray-200 transition-colors"
    >
      Logout
    </button>
  </nav>
  <!-- Main content area -->
  <div class="p-4">
    <!-- Render the current route -->
    <RouterView />
  </div>
</template>

<script setup>
// Import hooks from Vuex and Vue Router
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
// Initialize objects
const authStore = useAuthStore();
const router = useRouter();
// Define logout method
const logout = () => {
  authStore.logout(); // Clear authentication state
  router.push({ name: "login" }); // Redirect to login route
};
</script>
<style></style>
