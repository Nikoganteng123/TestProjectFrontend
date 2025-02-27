<template>
  <div class="min-h-screen p-6 bg-gray-100">
    <h1 class="text-3xl font-bold text-emerald-700 mb-6">Admin Dashboard</h1>
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-500">Loading...</div>
    
    <!-- Users List -->
    <div v-else-if="users.length" class="grid gap-4">
      <div
        v-for="user in users"
        :key="user.id"
        class="p-4 bg-white rounded shadow flex justify-between items-center"
      >
        <div>
          <p class="font-semibold">{{ user.name }}</p>
          <p class="text-gray-600">{{ user.email }}</p>
          <p class="text-sm text-gray-500">Joined: {{ new Date(user.created_at).toLocaleDateString() }}</p>
        </div>
        <button
          class="bg-emerald-600 text-white py-1 px-3 rounded hover:bg-emerald-700"
          @click="$router.push({ name: 'UserDetails', params: { userId: user.id } })"
        >
          View Details
        </button>
      </div>
    </div>
    <div v-else class="text-red-500">No users found</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await axios.get('http://localhost:8000/api/admin/users');
    users.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
});
</script>