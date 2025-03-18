<template>
  <div class="container mx-auto px-4 py-6 max-w-5xl">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Daftar Pengguna</h1>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="text-center text-gray-600 mb-6">
      Memuat data pengguna...
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 rounded-lg text-center">
      <p class="text-sm font-medium text-red-600">{{ error }}</p>
    </div>

    <!-- Filter and Search Section -->
    <div v-if="!isLoading && !error" class="mb-6 flex flex-col gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari pengguna..."
        class="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
      />
      <div class="flex flex-col sm:flex-row gap-4">
        <select
          v-model="filter"
          class="w-full sm:w-auto px-4 py-2 rounded-md border text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
        >
          <option value="all">Semua</option>
          <option value="submitted">Sudah Mengumpulkan</option>
          <option value="in-progress">Dalam Progress</option>
          <option value="not-checked">Belum Diperiksa</option>
          <option value="verified">Sudah Dinilai</option>
        </select>
        <select
          v-model="sortBy"
          class="w-full sm:w-auto px-4 py-2 rounded-md border text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
        >
          <option value="name">Nama</option>
          <option value="created_at">Tanggal Daftar</option>
          <option value="nilai">Nilai Akhir</option>
        </select>
      </div>
    </div>

    <!-- User Table -->
<div v-if="!isLoading && !error" class="overflow-x-auto">
  <table class="min-w-full bg-white rounded-lg shadow-md">
    <thead class="bg-gray-100 text-xs sm:text-sm">
      <tr>
        <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-gray-600 font-semibold">No</th>
        <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-gray-600 font-semibold">Nama</th>
        <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-gray-600 font-semibold">Email</th>
        <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-gray-600 font-semibold hidden md:table-cell">Tanggal Daftar</th>
        <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-gray-600 font-semibold hidden sm:table-cell">Status</th>
        <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-gray-600 font-semibold hidden sm:table-cell">Status Penilaian</th>
        <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-gray-600 font-semibold hidden md:table-cell">Nilai Akhir</th>
        <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-gray-600 font-semibold">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(user, index) in filteredAndSortedUsers"
        :key="user.id"
        class="border-b hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm"
      >
        <td class="py-2 px-2 sm:py-3 sm:px-4">{{ index + 1 }}</td>
        <td class="py-2 px-2 sm:py-3 sm:px-4">{{ user.name }}</td>
        <td class="py-2 px-2 sm:py-3 sm:px-4">{{ user.email }}</td>
        <td class="py-2 px-2 sm:py-3 sm:px-4 hidden md:table-cell">{{ formatDate(user.created_at) }}</td>
        <td class="py-2 px-2 sm:py-3 sm:px-4 hidden sm:table-cell">
          <span :class="user.last_submission_date ? 'text-teal-600' : 'text-orange-600'">
            {{ user.last_submission_date ? 'Sudah Mengumpulkan' : 'Dalam Progress' }}
          </span>
        </td>
        <td class="py-2 px-2 sm:py-3 sm:px-4 hidden sm:table-cell">
          <span :class="user.is_verified ? 'text-green-600' : 'text-red-600'">
            {{ user.is_verified ? 'Sudah Dinilai' : 'Belum Diperiksa' }}
          </span>
        </td>
        <td class="py-2 px-2 sm:py-3 sm:px-4 hidden md:table-cell">{{ user.nilai || '-' }}</td>
        <td class="py-2 px-2 sm:py-3 sm:px-4">
          <router-link
            @click="addToHistory(user)"
            :to="{ name: 'user-detail', params: { userId: user.id } }"
            class="inline-block bg-teal-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm font-medium hover:bg-teal-700 transition-colors duration-200"
          >
            Periksa
          </router-link>
        </td>
      </tr>
    </tbody>
  </table>
</div>

    <!-- No Data Message -->
    <div v-if="!isLoading && !error && filteredAndSortedUsers.length === 0" class="text-center text-gray-600 mt-6">
      Tidak ada data pengguna yang sesuai dengan pencarian atau filter saat ini.
    </div>

    <!-- History Section -->
    <div v-if="!isLoading && !error" class="mt-8">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Riwayat Pemeriksaan Terakhir</h2>
      <div v-if="checkHistory.length === 0" class="text-gray-600">
        Belum ada pengguna yang diperiksa.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg shadow-md">
          <thead class="bg-gray-100 text-xs sm:text-sm">
            <tr>
              <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-gray-600 font-semibold">No</th>
              <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-gray-600 font-semibold">Nama</th>
              <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-gray-600 font-semibold">Email</th>
              <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-gray-600 font-semibold hidden md:table-cell">Waktu Pemeriksaan</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(history, index) in checkHistory"
              :key="index"
              class="border-b hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm"
            >
              <td class="py-2 px-2 sm:py-3 sm:px-4">{{ index + 1 }}</td>
              <td class="py-2 px-2 sm:py-3 sm:px-4">{{ history.name }}</td>
              <td class="py-2 px-2 sm:py-3 sm:px-4">{{ history.email }}</td>
              <td class="py-2 px-2 sm:py-3 sm:px-4 hidden md:table-cell">{{ formatDateTime(history.checked_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
      filter: 'all',
      sortBy: 'name',
      searchQuery: '',
      isLoading: false,
      error: null,
      checkHistory: [],
    };
  },
  computed: {
    filteredAndSortedUsers() {
      let result = this.users.filter(user => !user.is_admin);

      // Filter
      if (this.filter !== 'all') {
        result = result.filter(user => {
          if (this.filter === 'submitted') return user.last_submission_date;
          if (this.filter === 'in-progress') return !user.last_submission_date;
          if (this.filter === 'not-checked') return !user.is_verified;
          if (this.filter === 'verified') return user.is_verified;
          return true;
        });
      }

      // Search
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );
      }

      // Sort
      result.sort((a, b) => {
        if (this.sortBy === 'name') return a.name.localeCompare(b.name);
        if (this.sortBy === 'created_at') return new Date(a.created_at) - new Date(b.created_at);
        if (this.sortBy === 'nilai') return (a.nilai || 0) - (b.nilai || 0);
        return 0;
      });

      return result;
    },
  },
  created() {
    this.fetchUsers();
    this.loadHistory();
  },
  methods: {
    async fetchUsers() {
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
        const response = await axios.get('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        });
        this.users = response.data.data || [];
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
    formatDateTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    addToHistory(user) {
      const historyItem = {
        id: user.id,
        name: user.name,
        email: user.email,
        checked_at: new Date(),
      };
      
      // Tambahkan ke history dan batasi 5 terakhir
      this.checkHistory.unshift(historyItem);
      if (this.checkHistory.length > 5) {
        this.checkHistory.pop();
      }
      
      // Simpan ke localStorage
      localStorage.setItem('checkHistory', JSON.stringify(this.checkHistory));
    },
    loadHistory() {
      const savedHistory = localStorage.getItem('checkHistory');
      if (savedHistory) {
        this.checkHistory = JSON.parse(savedHistory);
      }
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #e5e7eb;
}

th {
  background-color: #f3f4f6;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  table {
    font-size: 0.75rem;
  }

  th,
  td {
    padding: 0.5rem;
  }
}
</style>