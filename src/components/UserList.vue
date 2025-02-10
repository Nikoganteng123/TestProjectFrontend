<template>
  <div class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">User Profile</h2>

    <div v-if="user">
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <button @click="isEditing = true" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Edit Profile
      </button>
    </div>

    <div v-else>
      <p>Loading profile...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const user = ref(null);

const getUser = async () => {
  try {
    const response = await axios.get("http://10.4.8.60:8000/api/users/", {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    user.value = response.data; // Sesuaikan dengan format respons API
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

onMounted(getUser);
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
