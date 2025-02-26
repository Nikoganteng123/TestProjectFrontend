<template>
    <div class="min-h-screen p-6 bg-gray-100">
      <h1 class="text-3xl font-bold text-emerald-700 mb-6">Admin Dashboard</h1>
      <div v-if="users.length" class="grid gap-4">
        <div
          v-for="user in users"
          :key="user.id"
          class="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
          @click="viewUserDetail(user.id)"
        >
          <p class="text-lg font-semibold">{{ user.name }}</p>
          <p class="text-sm text-gray-600">{{ user.email }}</p>
          <p class="text-xs text-gray-400">{{ new Date(user.created_at).toLocaleDateString() }}</p>
        </div>
      </div>
      <p v-else class="text-gray-500">No users found.</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/auth';
  
  const router = useRouter();
  const authStore = useAuthStore();
  const users = ref([]);
  
  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/users');
      users.value = response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  });
  
  const viewUserDetail = (userId) => {
    router.push({ name: 'userdetails', params: { userId } });
  };
  </script>