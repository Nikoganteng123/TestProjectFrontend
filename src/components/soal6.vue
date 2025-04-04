<template>
  <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
      <div class="p-8 space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          Data 6: Penghargaan dalam Bidang Floristry
        </h1>

        <form @submit.prevent="submitAnswer" class="space-y-6 p-6">
          <div class="flex flex-col space-y-4">
            <div v-for="(field, index) in awardFields" :key="index" class="flex flex-col gap-2">
              <div class="flex items-center justify-between gap-4 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-all duration-200">
                <!-- Label -->
                <label :for="field.key" 
                  :class="[
                    'text-sm font-medium flex-1',
                    savedFiles[field.key] ? 'text-green-600' : 'text-gray-700'
                  ]">
                  {{ field.label }}
                </label>

                <!-- Status atau Input File -->
                <div class="flex items-center gap-2">
                  <!-- Status ketika file tersimpan -->
                  <div v-if="savedFiles[field.key]" class="text-green-600 flex items-center gap-1 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Tersimpan</span>
                  </div>

                  <!-- Input File jika belum tersimpan -->
                  <div v-else class="relative">
                    <input type="file" :id="field.key" accept=".pdf,image/*"
                      @change="handleFileUpload($event, field.key)"
                      class="hidden-file-input" />
                    <label :for="field.key" class="upload-button">
                      {{ uploadedFiles[field.key] ? truncateFileName(uploadedFiles[field.key].name) : 'Upload' }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-between items-center mt-6">
            <router-link to="/soal-5" 
              class="uniform-button bg-gray-500 text-white hover:bg-gray-600">
              Sebelumnya
            </router-link>
            
            <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button type="submit"
                v-if="Object.keys(uploadedFiles).length > 0"
                class="uniform-button bg-green-600 text-white hover:bg-green-700">
                {{ Object.keys(savedFiles).length > 0 ? 'Tambah' : 'Simpan' }}
              </button>

              <button type="button" @click="deleteAllFiles"
                v-if="Object.keys(savedFiles).length > 0"
                class="uniform-button bg-red-600 text-white hover:bg-red-700">
                Hapus
              </button>
            </div>

            <router-link to="/soal-7" 
              class="uniform-button bg-blue-600 text-white hover:bg-blue-700">
              Lanjut
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

const awardFields = [
  { key: 'penghargaan_daerah', label: 'a. Penghargaan tingkat daerah, Kabupaten / Provinsi' },
  { key: 'penghargaan_nasional', label: 'b. Penghargaan tingkat Nasional' },
  { key: 'penghargaan_internasional', label: 'c. Penghargaan tingkat International' }
];

// Extract current question number from route
const currentQuestionNumber = computed(() => {
  const match = route.path.match(/\/soal-(\d+)/);
  return match ? parseInt(match[1]) : 1;
});

onMounted(async () => {
  await fetchAnswer();
});

const fetchAnswer = async () => {
  try {
    const response = await axios.get('/api/soal6', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    });
    
    if (response.data && response.data.data) {
      savedFiles.value = response.data.data;
    } else {
      savedFiles.value = {};
    }
  } catch (error) {
    console.error('Error fetching answers:', error);
    savedFiles.value = {};
  }
};

const handleFileUpload = (event, field) => {
  const file = event.target.files[0];
  if (file) {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (allowedTypes.includes(file.type) && file.size <= 2 * 1024 * 1024) {
      uploadedFiles.value[field] = file;
    } else {
      alert('File harus berupa PDF atau gambar (JPG, PNG, GIF, BMP, WEBP) dan maksimum 2MB');
      event.target.value = ''; // Reset input
    }
  }
};

const deleteAllFiles = async () => {
  try {
    await axios.delete('/api/soal6', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    });

    savedFiles.value = {};
    uploadedFiles.value = {};
  } catch (error) {
    console.error('Failed to delete all files:', error);
    alert('Gagal menghapus file: ' + (error.response?.data?.message || error.message));
  }
};

const submitAnswer = async () => {
  try {
    const formData = new FormData();
    let hasFiles = false;

    Object.keys(uploadedFiles.value).forEach((key) => {
      if (uploadedFiles.value[key]) {
        formData.append(key, uploadedFiles.value[key]);
        hasFiles = true;
      }
    });

    if (!hasFiles) {
      console.warn('No files selected');
      return;
    }

    const endpoint = Object.keys(savedFiles.value).length > 0 
      ? '/api/update6'
      : '/api/soal6';

    const response = await axios.post(endpoint, formData, {
      headers: { 
        Authorization: `Bearer ${authStore.accessToken}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Answer saved successfully:', response.data);
    uploadedFiles.value = {};
    await fetchAnswer();
  } catch (error) {
    console.error('Failed to save answer:', error);
    alert('Gagal menyimpan jawaban: ' + (error.response?.data?.message || error.message));
  }
};

// Fungsi untuk memotong nama file jika terlalu panjang
const truncateFileName = (name) => {
  return name.length > 15 ? `${name.substring(0, 12)}...` : name;
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
.space-y-6 {
  padding: 0 1rem;
}

/* Field Container */
.bg-gray-50 {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

/* Label */
.text-sm {
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.text-green-600 {
  text-shadow: 0 1px 2px rgba(52, 211, 153, 0.2);
}

/* Hidden File Input dan Upload Button */
.hidden-file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.upload-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #ecfdf5;
  border: 2px solid #34d399;
  border-radius: 0.5rem;
  color: #2d6a4f;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upload-button:hover {
  background: #d1fae5;
  border-color: #2d6a4f;
  color: #1f4d36;
  transform: scale(1.05);
}

/* Uniform Button Styling */
.uniform-button {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  width: 100px;
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

.uniform-button.bg-green-600:hover {
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
}

.bg-green-600.text-white {
  background: linear-gradient(135deg, #2d6a4f, #34d399);
}

.w-10.h-10:hover:not(.bg-green-600) {
  background: #34d399;
  color: white;
  transform: scale(1.1);
}

/* Animations */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>