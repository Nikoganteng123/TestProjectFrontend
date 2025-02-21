<template>
    <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
      <!-- Info Popup -->
      <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      enter-to-class="opacity-100 translate-y-0 sm:scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0 sm:scale-100"
      leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    >
      <div v-if="showPopup" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div 
            class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 backdrop-blur-sm" 
            aria-hidden="true"
            @click="showPopup = false"
          ></div>

          <!-- Center modal -->
          <div class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="relative px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
              <!-- Close button with hover effect -->
              <button 
                @click="showPopup = false" 
                class="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all duration-200 focus:outline-none"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <!-- Icon -->
              <div class="sm:flex sm:items-start">
                <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-green-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <!-- Content -->
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                    Informasi Penting
                  </h3>
                  <div class="mt-4">
                    <div class="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
                      <p class="text-green-700 font-medium">
                        Perhatian!
                      </p>
                      <p class="mt-2 text-green-600">
                        Untuk soal selanjutnya, penilaian berlaku selama 2 (dua) tahun di hitung dari 2 (dua) tahun tahun sebelum tanggal isian.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                @click="showPopup = false"
                class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  
      <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-8 space-y-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">
            Soal 6: Penghargaan dalam Bidang Floristry
          </h1>
  
          <form @submit.prevent="submitAnswer" class="space-y-4">
            <!-- Section A: Penghargaan Daerah -->
            <div class="flex flex-col space-y-4">
              <div class="flex flex-col gap-2 p-2">
                <label for="penghargaan_daerah" 
                  :class="[
                    'text-sm font-medium',
                    savedFiles.penghargaan_daerah ? 'text-green-600' : 'text-gray-700'
                  ]">
                  a. Penghargaan tingkat daerah, Kabupaten / Provinsi
                </label>
  
                <div v-if="savedFiles.penghargaan_daerah" class="text-green-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>File sudah tersimpan</span>
                </div>
  
                <input v-else type="file" id="penghargaan_daerah" accept=".pdf"
                  @change="handleFileUpload($event, 'penghargaan_daerah')" 
                  class="border p-2 rounded-md w-2/3" />
              </div>
  
              <!-- Section B: Penghargaan Nasional -->
              <hr class="border-t border-gray-300 my-4">
              <div class="flex flex-col gap-2 p-2">
                <label for="penghargaan_nasional" 
                  :class="[
                    'text-sm font-medium',
                    savedFiles.penghargaan_nasional ? 'text-green-600' : 'text-gray-700'
                  ]">
                  b. Penghargaan tingkat Nasional
                </label>
  
                <div v-if="savedFiles.penghargaan_nasional" class="text-green-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>File sudah tersimpan</span>
                </div>
  
                <input v-else type="file" id="penghargaan_nasional" accept=".pdf"
                  @change="handleFileUpload($event, 'penghargaan_nasional')" 
                  class="border p-2 rounded-md w-2/3" />
              </div>
  
              <!-- Section C: Penghargaan International -->
              <hr class="border-t border-gray-300 my-4">
              <div class="flex flex-col gap-2 p-2">
                <label for="penghargaan_internasional" 
                  :class="[
                    'text-sm font-medium',
                    savedFiles.penghargaan_internasional ? 'text-green-600' : 'text-gray-700'
                  ]">
                  c. Penghargaan tingkat International
                </label>
  
                <div v-if="savedFiles.penghargaan_internasional" class="text-green-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>File sudah tersimpan</span>
                </div>
  
                <input v-else type="file" id="penghargaan_internasional" accept=".pdf"
                  @change="handleFileUpload($event, 'penghargaan_internasional')" 
                  class="border p-2 rounded-md w-2/3" />
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
                  Hapus Semua File
                </button>
              </div>
  
              <router-link to="/soal-7" 
                class="bg-blue-600 text-white rounded-xl py-3 px-6 hover:bg-blue-700 transition-all duration-300">
                Next
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/auth';
  
  const authStore = useAuthStore();
  const uploadedFiles = ref({});
  const savedFiles = ref({});
  const totalNilai = ref(0);
  const showPopup = ref(true);
  
  // Field mapping for frontend to backend
  const fieldMapping = {
    'penghargaan_daerah': 'penghargaan_daerah',
    'penghargaan_nasional': 'penghargaan_nasional',
    'penghargaan_internasional': 'penghargaan_internasional'
  };
  
  onMounted(async () => {
    await fetchAnswer();
  });

  // Extract current question number from route
const currentQuestionNumber = computed(() => {
  const match = route.path.match(/\/soal-(\d+)/)
  return match ? parseInt(match[1]) : 1
})
  
  const fetchAnswer = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/soal6', {
        headers: { Authorization: `Bearer ${authStore.accessToken}` }
      });
      
      if (response.data && response.data.data) {
        const backendData = response.data.data;
        const mappedData = {};
        
        Object.entries(backendData).forEach(([key, value]) => {
          if (fieldMapping[key] && value) {
            mappedData[key] = value;
          }
        });
        
        savedFiles.value = mappedData;
        totalNilai.value = backendData.nilai || calculateNilai();
      } else {
        savedFiles.value = {};
        totalNilai.value = 0;
      }
    } catch (error) {
      console.error('Error fetching answers:', error);
      savedFiles.value = {};
      totalNilai.value = 0;
    }
  };
  
  const calculateNilai = () => {
    let nilai = 0;
    
    // Calculate based on scoring rules
    if (savedFiles.value.penghargaan_daerah) nilai += 5;     // Daerah: 5 points
    if (savedFiles.value.penghargaan_nasional) nilai += 10;  // Nasional: 10 points
    if (savedFiles.value.penghargaan_internasional) nilai += 15; // International: 15 points
    
    // Maximum score is 30
    return Math.min(nilai, 30);
  };
  
  const handleFileUpload = (event, field) => {
    const file = event.target.files[0];
    if (file) {
      uploadedFiles.value[field] = file;
      console.log(`File uploaded for field '${field}':`, file.name);
    }
  };
  
  const deleteAllFiles = async () => {
    try {
      await axios.delete('http://localhost:8000/api/soal6', {
        headers: { Authorization: `Bearer ${authStore.accessToken}` }
      });
  
      savedFiles.value = {};
      uploadedFiles.value = {};
      totalNilai.value = 0;
    } catch (error) {
      console.error('Failed to delete all files:', error);
      alert('Failed to delete files. Please try again.');
    }
  };
  
  const submitAnswer = async () => {
    try {
      const formData = new FormData();
      let hasFiles = false;
  
      Object.entries(uploadedFiles.value).forEach(([key, file]) => {
        if (file) {
          formData.append(fieldMapping[key] || key, file);
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
      let errorMessage = 'Failed to save answer.';
      if (error.response?.data?.message) {
        errorMessage += ` ${error.response.data.message}`;
      }
      alert(errorMessage);
    }
  };
  </script>
  
  <style scoped>
  .bg-gradient-to-t {
    background: linear-gradient(to top, #66bb6a, #ffffff);
  }
  </style>