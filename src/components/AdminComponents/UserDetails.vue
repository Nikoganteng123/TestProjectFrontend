<template>
  <div class="min-h-screen p-6 bg-gray-100">
    <h1 class="text-3xl font-bold text-emerald-700 mb-6">{{ user?.name }}'s Submissions</h1>
    
    <div v-if="loading" class="text-center text-gray-500">Loading...</div>
    
    <div v-else-if="user" class="mb-4">
      <p>Email: {{ user.email }}</p>
      <p>Total Nilai: {{ totalNilai }}</p>
    </div>
    <div v-else class="text-red-500">Failed to load user data</div>
    
    <div v-if="!loading" class="grid gap-6">
      <soal-card
        v-for="(soal, key) in soals"
        :key="key"
        :soal-number="key.replace('soal', '')"
        :soal-data="soal"
        :user-id="userId"
        @delete-soal="deleteSoal"
        @preview-file="previewFile"
        @delete-field="deleteField"
      />
    </div>
    
    <button
      class="mt-6 bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700"
      @click="$router.push({ name: 'AdminDashboard' })"
    >
      Back to Dashboard
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import SoalCard from '@/components/AdminComponents/SoalCard.vue';

const route = useRoute();
const userId = route.params.userId;
const user = ref(null);
const soals = ref({});
const totalNilai = ref(0);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await axios.get(`http://localhost:8000/api/admin/users/${userId}`);
    user.value = response.data.user;
    soals.value = response.data.soals;
    totalNilai.value = response.data.totalNilai;
  } catch (error) {
    console.error('Error fetching user details:', error);
  } finally {
    loading.value = false;
  }
});

const deleteSoal = async (soalNumber) => {
  if (confirm(`Are you sure you want to delete the entire Soal ${soalNumber}?`)) {
    try {
      await axios.delete(`http://localhost:8000/api/admin/soal/${soalNumber}/${userId}`);
      soals.value[`soal${soalNumber}`] = null;
      totalNilai.value = Object.values(soals.value)
        .filter(s => s && s.nilai)
        .reduce((sum, s) => sum + (s.nilai || 0), 0);
    } catch (error) {
      console.error('Error deleting soal:', error);
      alert('Failed to delete soal. Please try again.');
    }
  }
};

const deleteField = async (soalNumber, fieldName) => {
  if (confirm(`Are you sure you want to delete ${fieldName} from Soal ${soalNumber}?`)) {
    try {
      await axios.delete(`http://localhost:8000/api/admin/soal/${soalNumber}/${userId}/field/${fieldName}`);
      // Update UI tanpa reload
      if (soals.value[`soal${soalNumber}`]) {
        soals.value[`soal${soalNumber}`][fieldName] = null;
      }
    } catch (error) {
      console.error('Error deleting field:', error);
      alert('Failed to delete field. Please try again.');
    }
  }
};

const previewFile = (soalNumber, fieldName) => {
  const url = `http://localhost:8000/api/admin/soal/${soalNumber}/${userId}/file/${fieldName}`;
  window.open(url, '_blank');
};
</script>