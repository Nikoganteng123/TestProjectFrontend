<template>
  <div class="container mx-auto px-6 py-10 max-w-5xl">
    <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Daftar Pengguna</h1>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="text-center text-gray-600 mb-6">
      Memuat data pengguna...
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 rounded-lg text-center">
      <p class="text-sm font-medium text-red-600">{{ error }}</p>
    </div>

    <!-- Filter Section -->
    <div v-if="!isLoading && !error" class="mb-6 flex flex-wrap gap-4 justify-center">
      <button
        @click="setFilter('all')"
        :class="[
          'px-4 py-2 rounded-md font-medium transition-colors duration-200',
          filter === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        ]"
      >
        Semua
      </button>
      <button
        @click="setFilter('submitted')"
        :class="[
          'px-4 py-2 rounded-md font-medium transition-colors duration-200',
          filter === 'submitted' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        ]"
      >
        Sudah Mengumpulkan
      </button>
      <button
        @click="setFilter('in-progress')"
        :class="[
          'px-4 py-2 rounded-md font-medium transition-colors duration-200',
          filter === 'in-progress' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        ]"
      >
        Dalam Progress
      </button>
      <button
        @click="setFilter('not-checked')"
        :class="[
          'px-4 py-2 rounded-md font-medium transition-colors duration-200',
          filter === 'not-checked' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        ]"
      >
        Belum Diperiksa
      </button>
      <button
        @click="setFilter('verified')"
        :class="[
          'px-4 py-2 rounded-md font-medium transition-colors duration-200',
          filter === 'verified' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        ]"
      >
        Sudah Dinilai
      </button>
    </div>

    <!-- User List -->
    <div v-if="!isLoading && !error" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ user.name }}</h2>
        <p class="text-gray-600 mb-1">
          <strong>Email:</strong> {{ user.email }}
        </p>
        <p class="text-gray-600 mb-1">
          <strong>Tanggal Daftar:</strong> {{ formatDate(user.created_at) }}
        </p>
        <p class="text-gray-600 mb-1">
          <strong>Status:</strong>
          <span :class="user.last_submission_date ? 'text-teal-600' : 'text-orange-600'">
            {{ user.last_submission_date ? 'Sudah Mengumpulkan' : 'Dalam Progress' }}
          </span>
        </p>
        <p class="text-gray-600 mb-3">
          <strong>Nilai:</strong>
          <span :class="user.is_verified ? 'text-green-600' : 'text-red-600'">
            {{ user.is_verified ? 'Sudah Dinilai' : 'Belum Diperiksa' }}
          </span>
        </p>
        <p class="text-gray-600 mb-4">
          <strong>Nilai Akhir:</strong> {{ user.nilai || '-' }}
        </p>
        <router-link
          :to="{ name: 'user-detail', params: { userId: user.id } }"
          class="inline-block bg-teal-600 text-white px-4 py-2 rounded-md font-medium hover:bg-teal-700 transition-colors duration-200"
        >
          Lihat Detail
        </router-link>
      </div>
    </div>

    <!-- No Data Message -->
    <div v-if="!isLoading && !error && filteredUsers.length === 0" class="text-center text-gray-600">
      Tidak ada data pengguna yang sesuai dengan filter saat ini.
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      users: [],
      filter: 'all', // Default filter: tampilkan semua
      isLoading: false,
      error: null,
    };
  },
  computed: {
    filteredUsers() {
      if (this.filter === 'all') {
        return this.users;
      }
      return this.users.filter(user => {
        if (this.filter === 'submitted') {
          return user.last_submission_date;
        }
        if (this.filter === 'in-progress') {
          return !user.last_submission_date;
        }
        if (this.filter === 'not-checked') {
          return !user.is_verified;
        }
        if (this.filter === 'verified') {
          return user.is_verified;
        }
        return true;
      });
    },
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      const authStore = useAuthStore();
      this.isLoading = true;
      this.error = null;

      // Periksa apakah token tersedia
      if (!authStore.accessToken) {
        this.error = 'Silakan login terlebih dahulu.';
        this.isLoading = false;
        this.$router.push({ name: 'login' });
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        });
        console.log('Response from API:', response.data); // Debugging
        this.users = response.data.data || []; // Pastikan data ada, jika tidak set ke array kosong
      } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        if (error.response) {
          if (error.response.status === 401) {
            this.error = 'Sesi Anda telah habis. Silakan login kembali.';
            this.$router.push({ name: 'login' });
          } else if (error.response.status === 403) {
            this.error = 'Anda tidak memiliki izin untuk mengakses data ini.';
          } else {
            this.error = error.response.data.message || 'Gagal memuat data pengguna.';
          }
        } else {
          this.error = 'Tidak dapat terhubung ke server. Pastikan server berjalan.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'Tidak ada';
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    },
    setFilter(filterType) {
      this.filter = filterType;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px; /* Sudah ada di Tailwind container, tapi kita override dengan max-w-5xl */
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>