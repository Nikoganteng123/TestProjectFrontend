<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 text-gray-700">
      <div class="flex items-center justify-center">
        <h2 class="text-2xl font-bold">Register Akun</h2>
      </div>

      <!-- Notifikasi Error -->
      <div v-if="errorMessage" class="bg-red-100 text-red-700 rounded-lg p-4">
        {{ errorMessage }}
      </div>

      <!-- Form Memasukkan Nomor HP & Kirim OTP -->
      <form
        v-if="!isOtpRequested"
        @submit.prevent="requestOtp"
        class="space-y-4"
      >
        <div>
          <label for="nomorhp" class="block text-sm font-medium text-gray-700"
            >Nomor HP</label
          >
          <input
            id="nomorhp"
            type="text"
            v-model.trim="nomor"
            required
            class="mt-1 block w-full px-3 py-2 border rounded-md"
            placeholder="Masukkan Nomor HP"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Kirim OTP
        </button>
      </form>

      <!-- Form Verifikasi OTP -->
      <form
        v-if="isOtpRequested && !isVerified"
        @submit.prevent="verifyOtp"
        class="space-y-4"
      >
        <div>
          <label for="otp" class="block text-sm font-medium text-gray-700"
            >Kode OTP</label
          >
          <input
            id="otp"
            type="text"
            v-model.trim="kodeOtp"
            required
            class="mt-1 block w-full px-3 py-2 border rounded-md"
            placeholder="Masukkan kode OTP"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Verifikasi OTP
        </button>
      </form>

      <!-- Form Registrasi Akun (Setelah OTP Diverifikasi) -->
      <!-- Form Registrasi Akun (Setelah OTP Diverifikasi) -->
      <form
        v-if="isVerified"
        @submit.prevent="registerAccount"
        class="space-y-4"
      >
        <div>
          <label for="nama" class="block text-sm font-medium text-gray-700"
            >Nama</label
          >
          <input
            id="nama"
            type="text"
            v-model.trim="nama"
            required
            class="mt-1 block w-full px-3 py-2 border rounded-md"
            placeholder="Masukkan nama lengkap"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            id="email"
            type="email"
            v-model.trim="email"
            required
            class="mt-1 block w-full px-3 py-2 border rounded-md"
            placeholder="Masukkan email"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            id="password"
            type="password"
            v-model.trim="password"
            required
            class="mt-1 block w-full px-3 py-2 border rounded-md"
            placeholder="Buat password"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Daftar Akun
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
const nomor = ref(""); // Nomor HP
const kodeOtp = ref(""); // Kode OTP
const email = ref("");
const password = ref("");
const isOtpRequested = ref(false);
const isVerified = ref(false);
const errorMessage = ref(null);

// Mengirim OTP ke Nomor HP
async function requestOtp() {
  try {
    const response = await axios.post("http://localhost:8000/api/otp/send", {
      nomor: nomor.value, // Kirim nomor yang benar
    });
    alert(response.data.message);
    isOtpRequested.value = true;
  } catch (error) {
    console.error(error);
    errorMessage.value =
      error.response?.data?.message || "Terjadi kesalahan saat mengirim OTP";
    alert(errorMessage.value);
  }
}

// Verifikasi OTP
async function verifyOtp() {
  try {
    const response = await axios.post("http://localhost:8000/api/otp/verify", {
      nomor: nomor.value, // Kirim nomor yang benar
      otp: kodeOtp.value, // Kirim kode OTP yang benar
    });
    alert(response.data.message);
    isVerified.value = true;
  } catch (error) {
    console.error(error);
    errorMessage.value =
      error.response?.data?.message || "Kode OTP salah atau kadaluarsa";
    alert(errorMessage.value);
  }
}

// Mendaftarkan Akun Setelah OTP Valid
async function registerAccount() {
  try {
    const response = await axios.post("http://localhost:8000/api/users", {
      name: nama.value,
      nomor: nomor.value, // Kirim nomor yang benar
      email: email.value,
      password: password.value,
    });
    alert(response.data.message);
    router.push({ name: "login" }); // Redirect ke halaman login setelah registrasi
  } catch (error) {
    console.error(error);
    errorMessage.value =
      error.response?.data?.message || "Gagal mendaftarkan akun";
    alert(errorMessage.value);
  }
}
</script>
