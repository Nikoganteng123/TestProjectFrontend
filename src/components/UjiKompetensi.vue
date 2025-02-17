<template>
    <div class="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Uji Kompetensi IPBI</h1>
      
  <div class="flex justify-center mb-8">
    <router-link to="/soal-1">
      <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Mengikuti Uji Kompetensi
      </button>
    </router-link>
  </div>

  
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Peserta yang Sudah Terdaftar</h2>
  
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left">Nama</th>
              <th class="border border-gray-300 px-4 py-2 text-center">Sertifikasi</th>
              <th class="border border-gray-300 px-4 py-2 text-center">Rank</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(participant, index) in participants" :key="index">
              <td class="border border-gray-300 px-4 py-2">{{ participant.name }}</td>
              <td class="border border-gray-300 px-4 py-2 text-center">
                <span v-if="participant.certified" class="text-green-600 font-semibold">Sudah</span>
                <span v-else class="text-red-600 font-semibold">Belum</span>
              </td>
              <td class="border border-gray-300 px-4 py-2 text-center">{{ participant.rank }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import { useAuthStore } from "@/stores/auth";
  
  const authStore = useAuthStore();
  const participants = ref([]);
  
  // Fungsi untuk mendapatkan peserta dari database
  const getParticipants = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/participants/", {
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      });
  
      // Tambahkan rank secara random (Rookie, Intermediate, Professional)
      participants.value = response.data.map(participant => ({
        ...participant,
        rank: getRandomRank()
      }));
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };
  
  // Fungsi untuk menghasilkan rank secara acak
  const getRandomRank = () => {
    const ranks = ["Rookie", "Intermediate", "Professional"];
    return ranks[Math.floor(Math.random() * ranks.length)];
  };
  
  // Fungsi untuk mendaftar uji kompetensi
  const registerForExam = async () => {
    try {
      await axios.post("http://localhost:8000/api/register-exam/", {}, {
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      });
      alert("Anda berhasil terdaftar untuk Uji Kompetensi!");
      getParticipants(); // Refresh daftar peserta
    } catch (error) {
      alert("Gagal mendaftar Uji Kompetensi.");
    }
  };
  
  onMounted(() => {
    getParticipants();
  });
  </script>
  
  <style scoped>
  body {
    font-family: 'Inter', sans-serif;
    background-color: #f3f4f6;
  }
  </style>
  