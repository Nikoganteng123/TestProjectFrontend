<template>
  <div class="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-xl mt-12 transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
    <!-- Background Decorative Circles -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="circle circle-1 animate-float-slow"></div>
      <div class="circle circle-2 animate-float"></div>
      <div class="circle circle-3 animate-float-fast"></div>
    </div>

    <h1 class="text-4xl font-extrabold text-green-900 mb-8 text-center animate__animated animate__fadeInDown">
      Pemetaan Data Guru IPBI
    </h1>

    <div class="flex justify-center mb-10">
      <button
        @click="checkAvailabilityAndRedirect"
        :disabled="isChecking"
        class="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
      >
        <span class="relative z-10">{{ isChecking ? 'Memeriksa...' : 'Mulai Pemetaan Data' }}</span>
        <span class="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
      </button>
    </div>

    <!-- Pesan Ketersediaan dengan Countdown -->
    <div v-if="availabilityMessage" class="text-center mb-10 animate__animated animate__fadeIn">
      <div class="bg-gradient-to-r from-gray-100 to-gray-50 p-6 rounded-xl shadow-md max-w-md mx-auto">
        <p :class="canTakeTest ? 'text-green-600' : 'text-red-600'" class="font-semibold text-lg mb-4">
          {{ availabilityMessage }}
        </p>
        <div v-if="!canTakeTest && remainingDays > 0" class="relative flex justify-center items-center">
          <svg class="w-24 h-24 transform -rotate-90">
            <circle
              class="text-gray-200"
              stroke-width="8"
              stroke="currentColor"
              fill="transparent"
              r="38"
              cx="48"
              cy="48"
            />
            <circle
              class="text-green-600 transition-all duration-1000 ease-linear"
              stroke-width="8"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="dashOffset"
              stroke-linecap="round"
              stroke="currentColor"
              fill="transparent"
              r="38"
              cx="48"
              cy="48"
            />
          </svg>
          <span class="absolute text-3xl font-extrabold text-green-600 glowing-number animate-pulse transition-all duration-300 hover:scale-110">
            {{ remainingDays }}
          </span>
        </div>
        <p v-if="!canTakeTest && remainingDays > 0" class="text-gray-600 mt-4">
          Tunggu {{ remainingDays }} hari untuk mencoba lagi!
          Jika anda ingin membukanya lagi silahkan hubungi Admin IPBI
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const participants = ref([]);
const isChecking = ref(false);
const canTakeTest = ref(null);
const availabilityMessage = ref('');
const remainingSeconds = ref(0);
const remainingDays = ref(0);
let timer = null;

const circumference = computed(() => 2 * Math.PI * 38);
const dashOffset = computed(() => {
  // Asumsikan cooldown maksimum adalah 30 hari untuk visualisasi
  const progress = remainingDays.value / 30;
  return circumference.value * (1 - progress);
});

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

const checkAvailabilityAndRedirect = async () => {
  if (!authStore.accessToken) {
    console.log('Silakan login terlebih dahulu.');
    router.push('/login');
    return;
  }

  isChecking.value = true;
  try {
    const response = await axios.get('http://localhost:8000/api/check-availability', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });

    const { can_take_test, next_available_date, remaining_seconds } = response.data;
    canTakeTest.value = can_take_test;
    remainingSeconds.value = remaining_seconds;
    remainingDays.value = Math.ceil(remaining_seconds / (24 * 60 * 60)); // Konversi detik ke hari

    if (can_take_test) {
      availabilityMessage.value = 'Selamat, Anda dapat mengikuti Pemetaan Data Guru sekarang!';
      setTimeout(() => {
        router.push('/soal-1');
      }, 1500);
    } else {
      availabilityMessage.value = 'Anda sudah pernah menyelesaikan Pemetaan Data Guru IPBI sebelumnya.';
      startCountdown(remaining_seconds);
    }
  } catch (error) {
    console.error('Gagal memeriksa ketersediaan:', error.response ? error.response.data : error.message);
    availabilityMessage.value = 'Terjadi kesalahan. Silakan coba lagi nanti.';
  } finally {
    isChecking.value = false;
  }
};

const startCountdown = (seconds) => {
  remainingSeconds.value = seconds;
  remainingDays.value = Math.ceil(seconds / (24 * 60 * 60));
  
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value -= 1;
      remainingDays.value = Math.ceil(remainingSeconds.value / (24 * 60 * 60));
    } else {
      clearInterval(timer);
      checkAvailabilityAndRedirect();
    }
  }, 1000); // Update setiap detik untuk memperbarui hari jika diperlukan
};

onMounted(() => {
  if (authStore.accessToken) {
    getParticipants();
  } else {
    console.log('Silakan login terlebih dahulu.');
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
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

/* Decorative Circles */
.circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent 70%);
  opacity: 0.15;
}
.circle-1 { width: 150px; height: 150px; top: 10%; left: -40px; }
.circle-2 { width: 120px; height: 120px; bottom: 15%; right: -30px; }
.circle-3 { width: 80px; height: 80px; top: 50%; left: 85%; }

/* Glowing Number */
.glowing-number {
  text-shadow: 0 0 10px rgba(22, 163, 74, 0.8), 0 0 20px rgba(22, 163, 74, 0.6), 0 0 30px rgba(22, 163, 74, 0.4);
}

/* Animations */
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-float-slow { animation: float 8s ease-in-out infinite; }
.animate-float-fast { animation: float 4s ease-in-out infinite; }
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.animate__fadeInDown {
  animation: fadeInDown 0.8s ease-out;
}
@keyframes fadeInDown {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-pulse {
  animation: pulse 1.5s infinite ease-in-out;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
}
</style>