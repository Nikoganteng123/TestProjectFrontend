<template>
  <div class="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0 bg-cover bg-center z-0" style="background-image: url('src/assets/loginbackground.jpg')"></div>
    <!-- Decorative Elements -->
    <div class="flower-1"></div>
    <div class="flower-2"></div>
    <div class="flower-3"></div>

    <!-- Form Container -->
    <div class="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 relative z-10 transition-all duration-300 hover:shadow-3xl">
      <!-- Logo and Title -->
      <div class="flex items-center justify-center mb-8 animate__animated animate__fadeIn animate__delay-1s">
        <img src="/src/assets/logoipbi.jpg" alt="Logo" class="h-14 w-auto transition-all duration-300 hover:scale-105" />
        <h2 class="text-3xl font-bold text-emerald-700 ml-4">IPBI Register</h2>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 rounded-lg animate__animated animate__shakeX">
        <p class="text-sm font-medium text-red-600">{{ errorMessage }}</p>
      </div>

      <!-- Step 1: Request OTP -->
      <form v-if="!isOtpRequested" @submit.prevent="requestOtp" class="space-y-6 animate__animated animate__fadeInUp animate__delay-2s">
        <div class="group">
          <label for="nomorhp" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Nomor HP</label>
          <input
            id="nomorhp"
            type="text"
            v-model.trim="nomor"
            required
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Masukkan Nomor HP"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-emerald-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-emerald-700 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
        >
          Kirim OTP
        </button>
      </form>

      <!-- Step 2: Verify OTP -->
      <form v-if="isOtpRequested && !isVerified" @submit.prevent="verifyOtp" class="space-y-6 animate__animated animate__fadeInUp animate__delay-2s">
        <div class="group">
          <label for="otp" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Kode OTP</label>
          <input
            id="otp"
            type="text"
            v-model.trim="kodeOtp"
            required
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Masukkan kode OTP"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-emerald-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-emerald-700 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
        >
          Verifikasi OTP
        </button>
      </form>

      <!-- Step 3: Register Account -->
      <form v-if="isVerified" @submit.prevent="registerAccount" class="space-y-6 animate__animated animate__fadeInUp animate__delay-2s">
        <div class="group">
          <label for="nama" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Nama Lengkap</label>
          <input
            id="nama"
            type="text"
            v-model.trim="nama"
            required
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Nama Lengkap"
          />
        </div>
        <div class="group">
          <label for="email" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Email</label>
          <input
            id="email"
            type="email"
            v-model.trim="email"
            required
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Email"
          />
        </div>
        <div class="group">
          <label for="password" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Password</label>
          <input
            id="password"
            type="password"
            v-model.trim="password"
            required
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Buat Password"
          />
        </div>
        <div class="space-y-4">
          <button
            type="submit"
            class="w-full bg-emerald-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-emerald-700 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
          >
            Daftar Akun
          </button>
          <button
            @click="goToLoginPage"
            class="w-full text-emerald-700 py-3 px-6 rounded-full font-medium hover:text-emerald-800 hover:bg-emerald-50 transition-all duration-300"
          >
            Sudah punya akun? Login di sini
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const nomor = ref("");
const kodeOtp = ref("");
const nama = ref("");
const email = ref("");
const password = ref("");
const isOtpRequested = ref(false);
const isVerified = ref(false);
const errorMessage = ref(null);

const goToLoginPage = () => {
  router.push({ name: "login" });
};

async function requestOtp() {
  try {
    const response = await axios.post("http://localhost:8000/api/otp/send", {
      nomor: nomor.value,
    });
    alert(response.data.message);
    isOtpRequested.value = true;
    errorMessage.value = null; // Reset error message saat request OTP berhasil
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Terjadi kesalahan saat mengirim OTP";
  }
}

async function verifyOtp() {
  try {
    const response = await axios.post("http://localhost:8000/api/otp/verify", {
      nomor: nomor.value,
      otp: kodeOtp.value,
    });
    alert(response.data.message);
    isVerified.value = true;
    errorMessage.value = null; // Reset error message saat OTP berhasil diverifikasi
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Kode OTP salah atau kadaluarsa";
  }
}

async function registerAccount() {
  try {
    const response = await axios.post("http://localhost:8000/api/register", {
      name: nama.value,
      email: email.value,
      password: password.value,
    });
    alert(response.data.message);
    router.push({ name: "login" });
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Gagal mendaftarkan akun";
  }
}
</script>

<style scoped>
/* Decorative Flowers */
.flower-1, .flower-2, .flower-3 {
  @apply absolute w-72 h-72 rounded-full opacity-10;
  background: radial-gradient(circle, #34d399 0%, transparent 70%);
}

.flower-1 {
  top: -4rem;
  right: 15%;
  animation: float 7s ease-in-out infinite;
}

.flower-2 {
  bottom: 15%;
  left: -4rem;
  animation: float 8s ease-in-out infinite 1s;
}

.flower-3 {
  bottom: -4rem;
  right: 25%;
  animation: float 9s ease-in-out infinite 2s;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-25px) scale(1.05); }
}

/* Shadow Enhancement */
.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Transitions */
.transition-all {
  transition: all 0.3s ease-in-out;
}

/* Animations Import */
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
</style>