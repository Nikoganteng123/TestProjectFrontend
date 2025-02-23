<template>
  <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="p-8 space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          Soal 6: Penghargaan dalam Bidang Floristry
        </h1>

        <form @submit.prevent="submitAnswer" class="space-y-4">
          <div class="flex flex-col space-y-4">
            <div v-for="(field, index) in awardFields" :key="index">              
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

                <!-- Show file input only when no file is saved -->
                <input v-else type="file" :id="field.key" accept=".pdf"
                  @change="handleFileUpload($event, field.key)" 
                  class="border p-2 rounded-md w-2/3" />
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center mt-6">
            <router-link to="/soal-5" 
              class="bg-gray-500 text-white rounded-xl py-3 px-6 hover:bg-gray-600 transition-all duration-300">
              Previous
            </router-link>
            
            <div class="flex gap-3">
              <button type="submit"
                v-if="Object.keys(uploadedFiles).length > 0"
                class="bg-green-600 text-white rounded-xl py-3 px-6 hover:bg-green-700 transition-all duration-300">
                {{ Object.keys(savedFiles).length > 0 ? 'Tambah Jawaban' : 'Simpan Jawaban' }}
              </button>

              <button type="button" @click="deleteAllFiles"
                v-if="Object.keys(savedFiles).length > 0"
                class="bg-red-600 text-white rounded-xl py-3 px-6 hover:bg-red-700 transition-all duration-300">
                Hapus
              </button>
            </div>

            <router-link to="/soal-7" 
              class="bg-blue-600 text-white rounded-xl py-3 px-6 hover:bg-blue-700 transition-all duration-300">
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
import { useRoute } from 'vue-router'

const route = useRoute()
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
  const match = route.path.match(/\/soal-(\d+)/)
  return match ? parseInt(match[1]) : 1
})

onMounted(async () => {
    await fetchAnswer();
});

const fetchAnswer = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/soal6', {
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
        uploadedFiles.value[field] = file;
    }
};

const deleteAllFiles = async () => {
    try {
        await axios.delete('http://localhost:8000/api/soal6', {
            headers: { Authorization: `Bearer ${authStore.accessToken}` }
        });

        savedFiles.value = {};
        uploadedFiles.value = {};
    } catch (error) {
        console.error('Failed to delete all files:', error);
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
            ? 'http://localhost:8000/api/update6'
            : 'http://localhost:8000/api/soal6';

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
    }
};
</script>

<style scoped>
.bg-gradient-to-t {
    background: linear-gradient(to top, #66bb6a, #ffffff);
}
</style>