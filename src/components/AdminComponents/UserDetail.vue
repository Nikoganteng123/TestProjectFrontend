<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-emerald-50 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <h1 class="text-4xl font-extrabold text-emerald-900 mb-10 text-center tracking-tight animate__animated animate__fadeInDown">
        Detail Pengguna: {{ user?.name || 'Memuat...' }}
      </h1>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center text-gray-600 animate__animated animate__pulse animate__infinite">
        Memuat data pengguna...
      </div>

      <!-- Error State -->
      <div v-if="error" class="mb-8 p-6 bg-red-50 rounded-xl shadow-md text-center">
        <p class="text-lg font-medium text-red-600">{{ error }}</p>
      </div>

      <!-- User Info Card -->
      <div v-if="!isLoading && !error && user" class="bg-white p-8 rounded-xl shadow-lg mb-10 transition-all duration-300 hover:shadow-xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <p class="text-lg text-gray-700">
            <strong class="text-emerald-800">Email:</strong> {{ user.email }}
          </p>
          <p class="text-lg text-gray-700">
            <strong class="text-emerald-800">Status:</strong>
            <span :class="user.is_verified ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'">
              {{ user.is_verified ? 'Sudah Dinilai' : 'Belum Dinilai' }}
            </span>
          </p>
          <p class="text-lg text-gray-700">
            <strong class="text-emerald-800">Total Nilai:</strong>
            <span v-if="!isEditingTotal" class="font-semibold text-emerald-700">{{ totalNilai }}</span>
            <input
              v-else
              v-model.number="editedTotalNilai"
              type="number"
              class="font-semibold text-emerald-700 border rounded px-2 py-1 w-20"
              @keypress.enter="confirmUpdateAndVerify"
            >
            <button
              v-if="!user.is_verified"
              @click="toggleEditTotal"
              class="ml-2 text-sm text-emerald-600 hover:text-emerald-800"
            >
              {{ isEditingTotal ? 'Batal' : 'Edit' }}
            </button>
          </p>
        </div>
        <div class="mt-6 flex space-x-4">
          <button
            v-if="!user.is_verified && !isEditingTotal"
            @click="verifyUser"
            class="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-emerald-700 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Verifikasi Uji Kompetensi
          </button>
          <button
            v-if="isEditingTotal"
            @click="confirmUpdateAndVerify"
            class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Simpan & Verifikasi
          </button>
          <button
            v-if="user.is_verified"
            @click="unverifyUser"
            class="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-red-700 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Batalkan Verifikasi
          </button>
        </div>
      </div>

      <!-- Submissions Section -->
      <div v-if="!isLoading && !error">
        <h2 class="text-3xl font-semibold text-emerald-900 mb-8 text-center tracking-tight animate__animated animate__fadeInUp">
          Daftar Nilai Soal
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(soal, key) in soals"
            :key="key"
            class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <p class="font-semibold text-emerald-800 text-lg capitalize">{{ key }}</p>
            <p class="text-gray-600">
              Nilai: <span class="font-medium text-emerald-700">{{ soal?.nilai || 0 }}</span>
            </p>
            <router-link
              v-if="soal"
              :to="{ name: 'soal-detail', params: { userId: user.id, soalNumber: key.replace('soal', '') } }"
              class="inline-block mt-3 bg-teal-500 text-white px-4 py-2 rounded-md font-medium hover:bg-teal-600 transition-all duration-300"
            >
              {{ user.is_verified ? 'Lihat Detail' : 'Periksa Soal' }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import 'animate.css';

export default {
  data() {
    return {
      user: null,
      soals: {},
      totalNilai: 0,
      editedTotalNilai: 0,
      isEditingTotal: false,
      isLoading: false,
      error: null,
    };
  },
  created() {
    this.fetchUserDetail();
  },
  methods: {
    async fetchUserDetail() {
      const authStore = useAuthStore();
      this.isLoading = true;
      this.error = null;

      if (!authStore.accessToken) {
        this.error = 'Silakan login terlebih dahulu.';
        this.isLoading = false;
        this.$router.push({ name: 'login' });
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8000/api/admin/users/${this.$route.params.userId}`, {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        });
        console.log('User detail response:', response.data);
        this.user = response.data.user;
        this.soals = response.data.soals;
        this.totalNilai = response.data.totalNilai;
        this.editedTotalNilai = this.totalNilai; // Inisialisasi nilai edit
      } catch (error) {
        console.error('Error fetching user detail:', error.response || error);
        this.error = error.response?.data?.message || 'Gagal memuat detail pengguna.';
        if (error.response?.status === 401) {
          this.$router.push({ name: 'login' });
        }
      } finally {
        this.isLoading = false;
      }
    },
    async verifyUser() {
      const authStore = useAuthStore();
      if (!confirm('Apakah Anda yakin ingin memverifikasi pengguna ini?')) return;

      try {
        await axios.post(
          `http://localhost:8000/api/admin/users/${this.$route.params.userId}/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authStore.accessToken}`,
            },
          }
        );
        this.fetchUserDetail(); // Refresh data setelah verifikasi
        alert('Pengguna telah diverifikasi!');
      } catch (error) {
        console.error('Error verifying user:', error.response || error);
        alert('Gagal memverifikasi pengguna: ' + (error.response?.data?.message || 'Kesalahan tidak diketahui'));
      }
    },
    toggleEditTotal() {
      this.isEditingTotal = !this.isEditingTotal;
      if (!this.isEditingTotal) {
        this.editedTotalNilai = this.totalNilai; // Reset ke nilai awal jika batal
      }
    },
    confirmUpdateAndVerify() {
      const confirmation = confirm(
        'Anda akan mengubah nilai Guru secara manual (Tidak berdasarkan perhitungan pemeriksaan). Pastikan anda memberikan nilai yang tepat!'
      );
      if (confirmation) {
        this.verifyUserWithCustomScore();
      }
    },
    async verifyUserWithCustomScore() {
      const authStore = useAuthStore();
      try {
        const response = await axios.post(
          `http://localhost:8000/api/admin/users/${this.$route.params.userId}/verify`,
          {
            total_nilai: this.editedTotalNilai, // Kirim nilai yang diinput admin
          },
          {
            headers: {
              Authorization: `Bearer ${authStore.accessToken}`,
            },
          }
        );
        console.log('Verification response:', response.data);
        this.totalNilai = response.data.totalNilai || this.editedTotalNilai;
        this.isEditingTotal = false;
        this.fetchUserDetail(); // Refresh data dari server
        alert('Nilai berhasil diperbarui dan pengguna telah diverifikasi!');
      } catch (error) {
        console.error('Error verifying user with custom score:', error.response || error);
        alert('Gagal memperbarui nilai dan verifikasi: ' + (error.response?.data?.message || 'Kesalahan tidak diketahui'));
      }
    },
    async unverifyUser() {
      const authStore = useAuthStore();
      if (!confirm('Apakah Anda yakin ingin membatalkan verifikasi pengguna ini? Nilai dan status verifikasi akan direset.')) return;

      try {
        await axios.post(
          `http://localhost:8000/api/admin/users/${this.$route.params.userId}/unverify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authStore.accessToken}`,
            },
          }
        );
        this.fetchUserDetail(); // Refresh data setelah pembatalan verifikasi
        alert('Verifikasi pengguna telah dibatalkan!');
      } catch (error) {
        console.error('Error unverifying user:', error.response || error);
        alert('Gagal membatalkan verifikasi: ' + (error.response?.data?.message || 'Kesalahan tidak diketahui'));
      }
    },
  },
};
</script>

<style scoped>
button,
a {
  transition: all 0.3s ease-in-out;
}

.grid > div {
  transition: all 0.3s ease-in-out;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>