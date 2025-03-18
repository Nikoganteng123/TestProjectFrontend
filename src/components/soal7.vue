<template>
  <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
      <div class="p-8 space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          Data 7: Kejuaraan/Lomba Merangkai Bunga
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
                <div v-if="savedFiles[field.key]" class="text-green-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>File sudah tersimpan</span>
                </div>

                <!-- Show file input when no file is saved -->
                <input v-else type="file" :id="field.key" accept=".pdf"
                  @change="handleFileUpload($event, field.key)" 
                  class="file-input block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer transition-all duration-200" />
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
  { key: 'juara_nasional_dpp', label: 'a. Juara tingkat Nasional yang diselenggarakan oleh DPP IPBI ' },
  { key: 'juara_non_dpp', label: 'b. Juara lomba yang diselenggarakan oleh IPBI selain DPP ' },
  { key: 'juara_instansi_lain', label: 'c. Juara lomba yang diselenggarakan oleh instansi lain ' },
  { key: 'juara_internasional', label: 'd. Juara lomba merangkai bunga tingkat internasional ' },
  { key: 'peserta_lomba_1', label: 'e. Menjadi Peserta Lomba Merangkai Bunga (1) ' },
  { key: 'peserta_lomba_2', label: 'Menjadi Peserta Lomba Merangkai Bunga (2) ' },
  { key: 'peserta_lomba_3', label: 'Menjadi Peserta Lomba Merangkai Bunga (3' },
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
    const response = await axios.get('/api/soal7', {
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
    await axios.delete('/api/soal7', {
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
      ? '/api/update7'
      : '/api/soal7';

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
/* Container Utama */
.min-h-screen {
  background: linear-gradient(to top, #2d6a4f, #f0fdf4);
  padding: 3rem 1.5rem;
  position: relative;
  overflow: hidden;
}

/* Card Container */
.max-w-2xl {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(45, 106, 79, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

@media (min-width: 640px) {
  .max-w-2xl {
    backdrop-filter: blur(10px);
  }
}

.max-w-2xl:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(45, 106, 79, 0.25);
}

/* Heading */
.text-3xl {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1f4d2b;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #2d6a4f, #34d399);
  -webkit-background-clip: text;
  background-clip: text;
  animation: fadeInDown 0.5s ease-out;
}

/* Form Styling */
.space-y-4 {
  padding: 0 1rem;
}

/* Label dan Input Container */
.flex.flex-col {
  position: relative;
}

.text-lg {
  color: #2d6a4f;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

/* File Input */
.file-input {
  background: white;
  border: 2px solid #34d399;
  border-radius: 0.5rem;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.file-input:hover:not(:disabled) {
  border-color: #2d6a4f;
  box-shadow: 0 0 10px rgba(52, 211, 153, 0.2);
}

.file-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.3);
}

/* Label untuk Input */
label.text-sm {
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

label.text-green-600 {
  text-shadow: 0 2px 4px rgba(52, 211, 153, 0.2);
}

/* Uniform Button Styling */
.uniform-button {
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-width: 150px;
  text-align: center;
}

.uniform-button.bg-green-600 {
  background: linear-gradient(135deg, #2d6a4f, #34d399);
}

.uniform-button.bg-red-600 {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.uniform-button.bg-blue-600 {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
}

.uniform-button.bg-gray-500 {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.uniform-button.bg-green-600:hover:not(:disabled) {
  background: linear-gradient(135deg, #1f4d36, #22c55e);
}

.uniform-button.bg-red-600:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

.uniform-button.bg-blue-600:hover {
  background: linear-gradient(135deg, #1e40af, #2563eb);
}

.uniform-button.bg-gray-500:hover {
  background: linear-gradient(135deg, #4b5563, #374151);
}

.uniform-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: all 0.6s ease;
}

.uniform-button:hover::before {
  left: 100%;
}

/* Question Navigation */
.border-t {
  border-color: rgba(45, 106, 79, 0.2);
}

.text-lg.font-medium {
  color: #2d6a4f;
  animation: fadeInUp 0.5s ease-out 0.2s both;
}

.flex.flex-wrap {
  gap: 0.75rem;
}

/* Navigation Buttons */
.w-10.h-10 {
  background: #f0fdf4;
  color: #4a4a4a;
  font-weight: 600;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.bg-green-600.text-white {
  background: linear-gradient(135deg, #2d6a4f, #34d399);
}

.w-10.h-10:hover:not(.bg-green-600) {
  background: #34d399;
  color: white;
  transform: scale(1.1);
}

.w-10.h-10::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(52, 211, 153, 0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.w-10.h-10:hover::after {
  opacity: 1;
}

/* Spinner */
.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #34d399;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>