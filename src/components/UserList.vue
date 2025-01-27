<template>
  <div class="p-4 flex justify-between items-center">
    <h1 class="text-3xl font-bold flex-1">User List</h1>
    <router-link
      to="/users/create"
      class="bg-green-500 hover:bg-green-600 text-white rounded-md py-2 px-4 transition-colors"
      >Create a new user</router-link
    >
  </div>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
  >
    <div
      v-for="user in users"
      :key="user.id"
      class="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div class="p-4">
        <h3 class="text-xl font-bold mb-2">{{ user.name }}</h3>
        <p class="text-gray-700">{{ user.email }}</p>
        <router-link
          :to="'/users/' + user.id"
          class="block mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 transition-colors"
          >Details</router-link
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore;
const users = ref([]);
const getUsers = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/users", {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    users.value = response.data.data;
  } catch (error) {
    console.error(error);
  }
};
onMounted(getUsers);
</script>
