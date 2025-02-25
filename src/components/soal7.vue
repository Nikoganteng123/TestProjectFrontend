<template>
  <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
      <div class="p-8 space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          Soal 7: Kejuaraan/Lomba Merangkai Bunga
        </h1>

        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="p-4 bg-green-100 text-green-700 rounded-md">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="p-4 bg-red-100 text-red-700 rounded-md">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="submitAnswer" class="space-y-4">
          <div class="flex flex-col space-y-4">
            <div v-for="(field, index) in certificateFields" :key="index">
              <hr v-if="['juara_non_dpp', 'juara_instansi_lain', 'juara_internasional', 'peserta_lomba_1', 'juri_lomba_1'].includes(field.key)" 
                class="border-t border-gray-300 my-4">
              
              <div class="flex flex-col gap-2 p-2">
                <label :for="field.key" 
                  :class="[
                    'text-sm font-medium',
                    savedFiles[field.key] ? 'text-green-600' : 'text-gray-700'
                  ]">
                  {{ field.label }}
                </label>

                <!-- Show when file is saved -->
                <div v-if="savedFiles[field.key]" class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-green-600">File sudah tersimpan</span>
                </div>

                <!-- Show file input when no file is saved -->
                <input v-else type="file" :id="field.key" accept=".pdf"
                  @change="handleFileUpload($event, field.key)" 
                  class="border p-2 rounded-md w-2/3 form-radio" />
              </div>
            </div>
          </div>

          <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-between items-center mt-6">
            <router-link to="/soal-6" 
              class="uniform-button bg-gray-500 text-white rounded-xl py-3 px-6 hover:bg-gray-600 transition-all duration-300 w-full sm:w-auto">
              Previous
            </router-link>
            
            <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button type="submit"
                v-if="Object.keys(uploadedFiles).length > 0"
                :disabled="loading"
                class="uniform-button bg-green-600 text-white rounded-xl py-3 px-6 hover:bg-green-700 transition-all duration-300 w-full sm:w-auto">
                {{ Object.keys(savedFiles).length > 0 ? 'Tambah' : 'Simpan' }}
                <span v-if="loading" class="spinner ml-2"></span>
              </button>

              <button type="button" @click="deleteAllFiles"
                v-if="Object.keys(savedFiles).length > 0"
                :disabled="loading"
                class="uniform-button bg-red-600 text-white rounded-xl py-3 px-6 hover:bg-red-700 transition-all duration-300 w-full sm:w-auto">
                Hapus Semua
                <span v-if="loading" class="spinner ml-2"></span>
              </button>
            </div>

            <router-link to="/soal-8" 
              class="uniform-button bg-blue-600 text-white rounded-xl py-3 px-6 hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto">
              Next
            </router-link>
          </div>
        </form>

        <!-- Question Navigation Bar -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Navigasi Soal</h3>
          <div class="flex flex-wrap gap-2">
            <router-link
              v-for="n in 17" 
              :key="n"
              :to="`/soal-${n}`"
              class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200"
              :class="[
                currentQuestionNumber === n 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 hover:bg-green-500 hover:text-white text-gray-700'
              ]"
            >
              {{ n }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';

const route = useRoute();
const authStore = useAuthStore();
const uploadedFiles = ref({});
const savedFiles = ref({});
const successMessage = ref('');
const errorMessage = ref('');
const loading = ref(false);

const certificateFields = [
  { key: 'juara_nasional_dpp', label: 'a. Juara tingkat Nasional yang diselenggarakan oleh DPP IPBI' },
  { key: 'juara_non_dpp', label: 'b. Juara lomba yang diselenggarakan oleh IPBI selain DPP' },
  { key: 'juara_instansi_lain', label: 'c. Juara lomba yang diselenggarakan oleh instansi lain' },
  { key: 'juara_internasional', label: 'd. Juara lomba merangkai bunga tingkat internasional' },
  { key: 'peserta_lomba_1', label: 'e. Menjadi Peserta Lomba Merangkai Bunga (1)' },
  { key: 'peserta_lomba_2', label: 'Menjadi Peserta Lomba Merangkai Bunga (2)' },
  { key: 'peserta_lomba_3', label: 'Menjadi Peserta Lomba Merangkai Bunga (3)' },
  { key: 'peserta_lomba_4', label: 'Menjadi Peserta Lomba Merangkai Bunga (4)' },
  { key: 'peserta_lomba_5', label: 'Menjadi Peserta Lomba Merangkai Bunga (5)' },
  { key: 'juri_lomba_1', label: 'f. Menjadi Juri Lomba Merangkai Bunga (1)' },
  { key: 'juri_lomba_2', label: 'Menjadi Juri Lomba Merangkai Bunga (2)' },
];

const currentQuestionNumber = computed(() => {
  const match = route.path.match(/\/soal-(\d+)/);
  return match ? parseInt(match[1]) : 7;
});

onMounted(async () => {
  await fetchAnswer();
});

const fetchAnswer = async () => {
  try {
    loading.value = true;
    const response = await axios.get('http://localhost:8000/api/soal7', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });
    
    savedFiles.value = response.data.data || {};
  } catch (error) {
    errorMessage.value = 'Gagal memuat data: ' + (error.response?.data?.message || error.message);
  } finally {
    loading.value = false;
  }
};

const handleFileUpload = (event, field) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf' && file.size <= 2 * 1024 * 1024) {
    uploadedFiles.value[field] = file;
  } else {
    errorMessage.value = 'File harus berupa PDF dan maksimum 2MB';
    event.target.value = '';
  }
};

const deleteAllFiles = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus semua file?')) return;
  
  try {
    loading.value = true;
    await axios.delete('http://localhost:8000/api/soal7', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });
    
    savedFiles.value = {};
    uploadedFiles.value = {};
    successMessage.value = 'Semua file berhasil dihapus';
    setTimeout(() => successMessage.value = '', 3000);
  } catch (error) {
    errorMessage.value = 'Gagal menghapus semua file: ' + (error.response?.data?.message || error.message);
  } finally {
    loading.value = false;
  }
};

const submitAnswer = async () => {
  try {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';
    
    const formData = new FormData();
    let hasFiles = false;

    Object.keys(uploadedFiles.value).forEach((key) => {
      if (uploadedFiles.value[key]) {
        formData.append(key, uploadedFiles.value[key]);
        hasFiles = true;
      }
    });

    if (!hasFiles) {
      errorMessage.value = 'Silakan pilih setidaknya satu file untuk diunggah';
      return;
    }

    const endpoint = Object.keys(savedFiles.value).length > 0 
      ? 'http://localhost:8000/api/update7'
      : 'http://localhost:8000/api/soal7';

    const response = await axios.post(endpoint, formData, {
      headers: { 
        Authorization: `Bearer ${authStore.accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    successMessage.value = response.data.message;
    uploadedFiles.value = {};
    await fetchAnswer();
    setTimeout(() => successMessage.value = '', 3000);
  } catch (error) {
    errorMessage.value = 'Gagal menyimpan: ' + (error.response?.data?.message || error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Keep your existing styles and add these */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #34d399;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>