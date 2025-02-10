<template>
  <div class="p-4 flex justify-between items-center">
    <h1 class="text-3xl font-bold flex-1">User List</h1>
    
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const users = ref([]);
const getUsers = async () => {
  try {
    const response = await axios.get("http://10.4.8.60:8000/api/users", {
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
