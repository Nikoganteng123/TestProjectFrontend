<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
    style="background-image: url('src/assets/loginbackground.jpg')"
  >
    <div class="max-w-md w-full space-y-8 bg-white bg-opacity-80 p-8 rounded-xl shadow-lg">
      <div class="flex items-center justify-center mb-6">
        <img src="/src/assets/logoipbi.jpg" alt="Logo" class="h-12 w-auto" />
        <h2 class="text-2xl font-bold text-center ml-2">Ikatan Perangkai Bunga Indonesia</h2>
      </div>
      
      <div v-if="errorMessage" class="bg-red-100 text-red-700 rounded-lg p-4">
        {{ errorMessage }}
      </div>
      
      <form v-if="!isOtpRequested" @submit.prevent="requestOtp" class="space-y-4">
        <div>
          <input
            id="nomorhp"
            type="text"
            v-model.trim="nomor"
            required
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Masukkan Nomor HP"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800"
        >
          Kirim OTP
        </button>
      </form>
      
      <form v-if="isOtpRequested && !isVerified" @submit.prevent="verifyOtp" class="space-y-4">
        <div>
          <input
            id="otp"
            type="text"
            v-model.trim="kodeOtp"
            required
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Masukkan kode OTP"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800"
        >
          Verifikasi OTP
        </button>
      </form>
      
      <form v-if="isVerified" @submit.prevent="registerAccount" class="space-y-4">
        <div>
          <input
            id="nama"
            type="text"
            v-model.trim="nama"
            required
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Nama Lengkap"
          />
        </div>
        <div>
          <input
            id="email"
            type="email"
            v-model.trim="email"
            required
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Email"
          />
        </div>
        <div>
          <input
            id="password"
            type="password"
            v-model.trim="password"
            required
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Buat Password"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800"
        >
          Daftar Akun
        </button>
        <button
          @click="goToLoginPage"
          class="w-full text-center text-green-700 hover:text-green-800"
        >
          Sudah punya akun? Login di sini
        </button>
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
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Kode OTP salah atau kadaluarsa";
  }
}

async function registerAccount() {
  try {
    const response = await axios.post("http://localhost:8000/api/users", {
      name: nama.value,
      nomor: nomor.value,
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
.bg-cover {
  background-size: cover;
}

.bg-center {
  background-position: center;
}

.bg-opacity-80 {
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
