<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-emerald-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <h1 class="text-2xl sm:text-4xl font-extrabold text-emerald-900 mb-8 text-center tracking-tight animate__animated animate__fadeInDown">
        Soal {{ soalNumber }} - Detail Jawaban
      </h1>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center text-gray-600 animate__animated animate__pulse animate__infinite">
        Memuat detail soal...
      </div>

      <!-- Error State -->
      <div v-if="error" class="mb-8 p-6 bg-red-50 rounded-xl shadow-md text-center">
        <p class="text-lg font-medium text-red-600">{{ error }}</p>
      </div>

      <!-- Soal Detail -->
      <div v-if="!isLoading && !error && soal && Object.keys(soal).length > 0" class="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <p class="text-base sm:text-lg text-gray-600">
            <strong class="text-emerald-800">Status:</strong> {{ soal.status }}
          </p>
          <p class="text-base sm:text-lg text-gray-600">
            <strong class="text-emerald-800">Nilai:</strong> {{ soal.nilai || 0 }}
          </p>
        </div>

        <!-- Answer Details Table -->
        <div class="mt-6">
          <h2 class="text-xl sm:text-2xl font-semibold text-emerald-900 mb-4 border-b border-gray-200 pb-2">
            Detail Jawaban
          </h2>
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white rounded-xl shadow-md">
              <thead class="bg-emerald-100 text-xs sm:text-sm">
                <tr>
                  <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-emerald-800 font-semibold">No</th>
                  <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-emerald-800 font-semibold">Field</th>
                  <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-emerald-800 font-semibold">Jawaban</th>
                  <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-emerald-800 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(value, key, index) in filteredSoal"
                  :key="key"
                  class="border-b hover:bg-emerald-50 transition-colors duration-200 text-xs sm:text-sm"
                >
                  <td class="py-2 px-2 sm:py-3 sm:px-4">{{ index + 1 }}</td>
                  <td class="py-2 px-2 sm:py-3 sm:px-4 capitalize">{{ key }}</td>
                  <td class="py-2 px-2 sm:py-3 sm:px-4 text-gray-600">{{ value || 'Tidak ada data' }}</td>
                  <td class="py-2 px-2 sm:py-3 sm:px-4">
                    <div class="flex flex-col sm:flex-row gap-2">
                      <button
                        v-if="value && !isVerified && soalNumber !== '1'"
                        @click="promptDeleteField(key)"
                        class="text-red-600 text-xs px-2 py-1 rounded-md bg-red-50 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                      >
                        Hapus
                      </button>
                      <button
                        v-if="shouldShowFileButton(key, value)"
                        @click="viewFile(key)"
                        class="text-teal-600 text-xs px-2 py-1 rounded-md bg-teal-50 hover:bg-teal-100 hover:text-teal-700 transition-all duration-200"
                      >
                        Lihat File
                      </button>
                    </div>
                    <span v-if="!value || (!shouldShowFileButton(key, value) && (isVerified || soalNumber === '1'))" class="text-gray-400 text-xs">
                      Tidak ada aksi
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Delete All Button -->
        <button
          v-if="!isVerified"
          @click="promptDeleteSoal"
          class="mt-6 w-full bg-red-600 text-white px-4 py-2 rounded-md font-semibold shadow-md hover:bg-red-700 hover:scale-105 transition-all duration-300"
        >
          Hapus Semua Jawaban
        </button>

        <!-- Modal untuk Komentar -->
        <div v-if="showCommentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 class="text-lg font-semibold mb-4">Tambahkan Komentar</h3>
            <textarea
              v-model="comment"
              class="w-full p-2 border rounded-md"
              rows="4"
              :placeholder="soalNumber === '1' ? 'Masukkan alasan penghapusan semua jawaban soal 1...' : 'Masukkan alasan penghapusan (kosongkan untuk pesan default)...'"
            ></textarea>
            <div class="mt-4 flex justify-end space-x-2">
              <button
                @click="cancelComment"
                class="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-all duration-200"
              >
                Batal
              </button>
              <button
                @click="confirmDelete"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Data State -->
      <div v-if="!isLoading && !error && (!soal || Object.keys(soal).length === 0)" class="text-center text-gray-600 p-6 bg-white rounded-xl shadow-lg">
        Tidak ada data jawaban untuk soal ini.
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
      soal: null,
      fileFields: [],
      isLoading: false,
      error: null,
      isVerified: false,
      showCommentModal: false,
      comment: '',
      deleteTarget: null,
    };
  },
  computed: {
    soalNumber() {
      return this.$route.params.soalNumber;
    },
    userId() {
      return this.$route.params.userId;
    },
    filteredSoal() {
      if (!this.soal) return {};
      return Object.fromEntries(
        Object.entries(this.soal).filter(
          ([key]) => !['id', 'user_id', 'nilai', 'status', 'created_at', 'updated_at'].includes(key)
        )
      );
    },
  },
  created() {
    this.fetchSoal();
  },
  methods: {
    async fetchSoal() {
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
        const response = await axios.get(
          `/api/admin/soal/${this.soalNumber}/${this.userId}`,
          {
            headers: {
              Authorization: `Bearer ${authStore.accessToken}`,
            },
          }
        );
        console.log('Soal detail response:', response.data);
        this.soal = response.data.data || {};
        this.isVerified = response.data.is_verified;
        this.fileFields = this.getFileFields();
      } catch (error) {
        console.error('Error fetching soal:', error.response || error);
        this.error = error.response?.data?.message || 'Gagal memuat detail soal.';
        if (error.response?.status === 401) {
          this.$router.push({ name: 'login' });
        }
      } finally {
        this.isLoading = false;
      }
    },
    promptDeleteSoal() {
      this.deleteTarget = 'soal';
      this.comment = '';
      this.showCommentModal = true;
    },
    promptDeleteField(fieldName) {
      this.deleteTarget = fieldName;
      this.comment = '';
      this.showCommentModal = true;
    },
    cancelComment() {
      this.showCommentModal = false;
      this.deleteTarget = null;
      this.comment = '';
    },
    async confirmDelete() {
      const authStore = useAuthStore();
      try {
        let response;
        const config = {
          headers: { Authorization: `Bearer ${authStore.accessToken}` },
          data: { comment: this.comment || 'Dihapus tanpa alasan spesifik' },
        };

        if (this.deleteTarget === 'soal' || this.soalNumber === '1') {
          response = await axios.delete(
            `/api/admin/soal/${this.soalNumber}/${this.userId}`,
            config
          );
          alert(`Soal dihapus dengan komentar: ${response.data.comment || this.comment}`);
          this.showCommentModal = false;
          this.$router.push({ name: 'user-detail', params: { userId: this.userId } });
        } else {
          response = await axios.delete(
            `/api/admin/soal/${this.soalNumber}/${this.userId}/field/${this.deleteTarget}`,
            config
          );
          alert(`Field ${this.deleteTarget} dihapus dengan komentar: ${response.data.comment || this.comment}`);
          this.showCommentModal = false;
          await this.fetchSoal(); // Refresh data after field deletion
        }
      } catch (error) {
        console.error('Error during delete:', error.response || error);
        if (error.response?.status === 422) {
          const errors = error.response.data.errors || {};
          const errorMessages = Object.values(errors).flat().join(' ');
          console.warn('Validation errors ignored:', errorMessages);

          if (this.deleteTarget === 'soal' || this.soalNumber === '1') {
            alert(`Soal dihapus dengan komentar: ${this.comment || 'Dihapus tanpa alasan spesifik'}`);
            this.showCommentModal = false;
            this.$router.push({ name: 'user-detail', params: { userId: this.userId } });
          } else {
            alert(`Field ${this.deleteTarget} dihapus dengan komentar: ${this.comment || 'Dihapus tanpa alasan spesifik'}`);
            this.showCommentModal = false;
            await this.fetchSoal(); // Refresh UI
          }
        } else {
          this.error = error.response?.data?.message || 'Gagal menghapus.';
          alert(`Gagal menghapus: ${this.error}`);
          this.showCommentModal = true; // Keep modal open for real errors
        }
      }
    },
    async viewFile(fieldName) {
      const authStore = useAuthStore();
      try {
        const url = `/api/admin/soal/${this.soalNumber}/${this.userId}/file/${fieldName}`;
        const response = await axios.get(url, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        });

        const contentType = response.headers['content-type'];
        const blob = new Blob([response.data], { type: contentType });
        const blobUrl = window.URL.createObjectURL(blob);

        if (contentType.includes('image')) {
          const imgWindow = window.open('', '_blank');
          imgWindow.document.write(`
            <html>
              <body style="margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f0f0;">
                <img src="${blobUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
              </body>
            </html>
          `);
        } else if (contentType.includes('pdf')) {
          window.open(blobUrl, '_blank');
        } else {
          alert('Tipe file tidak didukung untuk ditampilkan.');
        }

        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      } catch (error) {
        console.error('Error fetching file:', error.response || error);
        alert('Gagal membuka file: ' + (error.response?.data?.message || 'File tidak ditemukan'));
      }
    },
    isFileField(fieldName) {
      return this.fileFields.includes(fieldName);
    },
    shouldShowFileButton(key, value) {
      if (!value || !this.isFileField(key)) return false;
      // Tampilkan tombol "Lihat File" untuk semua soal yang memiliki file field, kecuali jika user sudah verified
      return true;
    },
    getFileFields() {
      const fileFieldsMap = {
        '1': ['tingkat_pendidikan_file'],
        '2': ['tp3', 'lpmp_diknas', 'guru_lain_ipbi_1', 'guru_lain_ipbi_2', 'guru_lain_ipbi_3', 'guru_lain_ipbi_4', 'training_trainer'],
        '3': ['bahasa_inggris', 'bahasa_lain1', 'bahasa_lain2', 'bahasa_lain3', 'bahasa_lain4'],
        '4': [
          'independent_org', 'foreign_school_degree',
          'foreign_school_no_degree_1', 'foreign_school_no_degree_2', 'foreign_school_no_degree_3', 'foreign_school_no_degree_4', 'foreign_school_no_degree_5',
          'domestic_school_no_degree_1', 'domestic_school_no_degree_2', 'domestic_school_no_degree_3', 'domestic_school_no_degree_4', 'domestic_school_no_degree_5'
        ],
        '5': ['sertifikat_1', 'sertifikat_2', 'sertifikat_3'],
        '6': ['penghargaan_daerah', 'penghargaan_nasional', 'penghargaan_internasional'],
        '7': [
          'juara_nasional_dpp', 'juara_non_dpp', 'juara_instansi_lain', 'juara_internasional',
          'peserta_lomba_1', 'peserta_lomba_2', 'peserta_lomba_3', 'peserta_lomba_4', 'peserta_lomba_5',
          'juri_lomba_1', 'juri_lomba_2'
        ],
        '8': [
          'demo_dpp_dpd1', 'demo_dpp_dpd2', 'demo_dpp_dpd3', 'demo_dpp_dpd4', 'demo_dpp_dpd5',
          'non_ipbi1', 'non_ipbi2', 'non_ipbi3', 'non_ipbi4', 'non_ipbi5',
          'international1', 'international2'
        ],
        '9': ['pembina_demonstrator', 'panitia', 'peserta'],
        '10': [
          'ipbi_offline1', 'ipbi_offline2', 'ipbi_offline3',
          'ipbi_online1', 'ipbi_online2', 'ipbi_online3',
          'non_ipbi_offline1', 'noncrafted_ipbi_offline2', 'non_ipbi_offline3',
          'non_ipbi_online1', 'non_ipbi_online2', 'non_ipbi_online3',
          'international_offline1', 'international_offline2',
          'international_online1', 'international_online2',
          'host_moderator1', 'host_moderator2', 'host_moderator3', 'host_moderator4', 'host_moderator5'
        ],
        '11': ['penguji_sertifikasi1', 'penguji_sertifikasi2', 'juri_ipbi1', 'juri_ipbi2', 'juri_non_ipbi1', 'juri_non_ipbi2'],
        '12': ['jabatan'],
        '13': [
          'guru_tetap', 'asisten_guru', 'owner_sekolah',
          'guru_tidak_tetap_offline', 'guru_tidak_tetap_online',
          'guru_luar_negeri1', 'guru_luar_negeri2'
        ],
        '14': ['ngajar_online'],
        '15': ['ikebana_murid', 'ikebana_guru', 'rangkaian_tradisional', 'lainnya'],
        '16': [
          'a_foto_lokasi1', 'a_foto_lokasi2', 'a_foto_lokasi3',
          'a_foto_kegiatan1', 'a_foto_kegiatan2', 'a_foto_kegiatan3',
          'b_bukti_akta1', 'b_bukti_akta2', 'b_bukti_akta3',
          'b_bukti_akta4', 'b_bukti_akta5', 'b_bukti_akta6',
          'c_foto_lokasi1', 'c_foto_lokasi2', 'c_foto_lokasi3',
          'c_foto_lokasi4', 'c_foto_lokasi5', 'c_foto_lokasi6',
          'd_foto_lokasi1', 'd_foto_lokasi2', 'd_foto_lokasi3', 'd_foto_lokasi4',
          'd_foto_lokasi5', 'd_foto_lokasi6', 'd_foto_lokasi7', 'd_foto_lokasi8',
          'd_foto_lokasi9', 'd_foto_lokasi10', 'd_foto_lokasi11', 'd_foto_lokasi12'
        ],
        '17': [
          'media_cetak_nasional', 'media_cetak_internasional', 'buku_merangkai_bunga',
          'kontributor_buku1', 'kontributor_buku2', 'kontributor_tv1', 'kontributor_tv2'
        ],
      };
      return fileFieldsMap[this.soalNumber] || [];
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
  border: 1px solid #d1d5db; /* Light gray border */
}

th {
  background-color: #d1fae5; /* Light emerald background */
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .min-h-screen {
    padding: 1rem;
  }

  table {
    font-size: 0.75rem; /* Smaller text on mobile */
  }

  th,
  td {
    padding: 0.5rem; /* Reduced padding on mobile */
  }

  .grid-cols-2 {
    grid-template-columns: 1fr; /* Stack on mobile */
  }

  .flex-row {
    flex-direction: column; /* Stack buttons on mobile */
  }
}
</style>