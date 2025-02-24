<template>
  <div class="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-xl mt-12 transition-all duration-300 hover:shadow-2xl">
    <h1 class="text-4xl font-extrabold text-green-900 mb-8 text-center animate__animated animate__fadeInDown">
      Uji Kompetensi IPBI
    </h1>

    <div class="flex justify-center mb-10">
      <router-link to="/soal-1">
        <button class="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold
          hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
          Ikuti Uji Kompetensi
        </button>
      </router-link>
    </div>

    <h2 class="text-2xl font-bold text-green-800 mb-6 animate__animated animate__fadeIn">
      Peserta Terdaftar
    </h2>

    <div class="overflow-x-auto rounded-lg shadow-md animate__animated animate__fadeIn animate__delay-1s">
      <table class="w-full border-collapse bg-white">
        <thead class="bg-green-50 text-green-900">
          <tr>
            <th class="px-6 py-4 text-left font-semibold">Nama</th>
            <th class="px-6 py-4 text-center font-semibold">Status Sertifikasi</th>
            <th class="px-6 py-4 text-center font-semibold">Peringkat</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(participant, index) in participants" :key="index" 
              class="border-b hover:bg-green-50 transition-all duration-200">
            <td class="px-6 py-4 text-gray-800">{{ participant.name }}</td>
            <td class="px-6 py-4 text-center">
              <span :class="participant.certified ? 'text-green-600' : 'text-red-600'" 
                    class="font-medium px-3 py-1 rounded-full bg-opacity-10"
                    :style="{ backgroundColor: participant.certified ? '#dcfce7' : '#fee2e2' }">
                {{ participant.certified ? 'Tersertifikasi' : 'Belum' }}
              </span>
            </td>
            <td class="px-6 py-4 text-center text-gray-700">{{ participant.rank }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const participants = ref([]);

const getParticipants = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/users', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });
    participants.value = response.data;
  } catch (error) {
    console.error('Gagal mengambil data peserta:', error);
  }
};

onMounted(() => {
  if (authStore.accessToken) {
    getParticipants();
  } else {
    console.log('Silakan login terlebih dahulu.');
  }
});
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(to bottom, #f3f4f6, #e5e7eb);
  min-height: 100vh;
}

h1 {
  color: #14532d;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #166534;
}

button {
  transition: all 0.3s ease-in-out;
}

table {
  border-radius: 8px;
  overflow: hidden;
}

th, td {
  padding: 16px;
}

th {
  background: #f0fdf4;
  letter-spacing: 0.5px;
}

tr:hover {
  transform: translateY(-2px);
}

.animate__fadeInDown {
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>