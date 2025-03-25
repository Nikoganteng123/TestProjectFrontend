<template>
  <div class="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-xl mt-20 transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
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
        <span class="absolute inset-0 bg-white opacity-0 Hover:opacity-20 transition-opacity duration-300"></span>
      </button>
    </div>

    <!-- Pesan Ketersediaan -->
    <div v-if="availabilityMessage" class="text-center mb-10 animate__animated animate__fadeIn">
      <div class="bg-gradient-to-r from-gray-100 to-gray-50 p-6 rounded-xl shadow-md max-w-md mx-auto">
        <p :class="canTakeTest ? 'text-green-600' : 'text-red-600'" class="font-semibold text-lg">
          {{ availabilityMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isChecking = ref(false);
const canTakeTest = ref(null);
const availabilityMessage = ref('');

const checkAvailabilityAndRedirect = async () => {
  if (!authStore.accessToken) {
    console.log('Silakan login terlebih dahulu.');
    router.push('/login');
    return;
  }

  isChecking.value = true;
  try {
    const response = await axios.get('/api/check-availability', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });

    const { can_take_test, message } = response.data;
    canTakeTest.value = can_take_test;
    availabilityMessage.value = message;

    if (can_take_test) {
      setTimeout(() => {
        router.push('/soal-1');
      }, 1500);
    }
  } catch (error) {
    console.error('Gagal memeriksa ketersediaan:', error.response ? error.response.data : error.message);
    availabilityMessage.value = 'Terjadi kesalahan. Silakan coba lagi nanti.';
  } finally {
    isChecking.value = false;
  }
};

onMounted(() => {
  if (!authStore.accessToken) {
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

button {
  transition: all 0.3s ease-in-out;
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
</style>