<template>
  <div class="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10 transform transition-all hover:scale-105">
    <!-- Title Section with smooth fade-in -->
    <h1 class="text-3xl font-bold text-green-800 mb-6 text-center animate__animated animate__fadeIn">
      Uji Kompetensi IPBI
    </h1>

    <!-- Button to Start the Test with smooth hover effect -->
    <div class="flex justify-center mb-8">
      <router-link to="/soal-1">
        <button class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 ease-in-out">
          Ikuti Uji Kompetensi
        </button>
      </router-link>
    </div>

    <!-- Participants List Section with animated fade-in -->
    <h2 class="text-2xl font-semibold text-green-700 mb-4 animate__animated animate__fadeIn">
      Peserta yang Sudah Terdaftar
    </h2>

    <!-- Table Section with fade-in effect -->
    <div class="overflow-x-auto animate__animated animate__fadeIn animate__delay-1s">
      <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-green-100">
          <tr>
            <th class="border border-gray-300 px-4 py-2 text-left">Nama</th>
            <th class="border border-gray-300 px-4 py-2 text-center">Poin</th>
            <th class="border border-gray-300 px-4 py-2 text-center">Rank</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(participant, index) in participants" 
            :key="index" 
            class="transition-transform transform hover:scale-105 hover:bg-green-50"
          >
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

// Function to get participants from the database
const getParticipants = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/users", {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });

    // Map through the participants to assign random ranks and get the required data
    participants.value = response.data.map(participant => ({
      name: participant.name,  // Assuming `name` is a field in the database
      certified: participant.certified,  // Assuming `certified` is a field to determine if a participant is certified
      rank: getRandomRank(), // Random rank for demonstration
    }));
  } catch (error) {
    console.error("Error fetching participants:", error);
  }
};

// Function to return a random rank
const getRandomRank = () => {
  const ranks = ["Rookie", "Intermediate", "Professional"];
  return ranks[Math.floor(Math.random() * ranks.length)];
};

// Fetch participants on component mount
onMounted(() => {
  getParticipants();
});
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
  background-color: #f3f4f6;
}

h1 {
  color: #1f6f43; /* Dark Green */
}

h2 {
  color: #228B22; /* Forest Green */
}

/* Button animation */
button {
  transition: all 0.3s ease-in-out;
}

button:hover {
  transform: scale(1.05);
  background-color: #4CAF50; /* Bright Green */
}

/* Table row hover effect */
tr {
  transition: all 0.3s ease;
}

tr:hover {
  transform: scale(1.05);
  background-color: #f0f8f0; /* Light Green */
}

table {
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: center;
}

/* Add background color to table header */
th {
  background-color: #dff0d8; /* Light Green */
}

/* Smooth transitions for elements */
.animate__fadeIn {
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* Custom hover effect for table rows */
tr:hover {
  background-color: #e8f5e9;
  transition: background-color 0.3s ease;
}

</style>
