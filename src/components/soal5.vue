<template>
    <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
      <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-8 space-y-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">
            Soal 5: Sertifikasi Kompetensi di Bidang Merangkai Bunga
          </h1>
  
          <form @submit.prevent="submitAnswer" class="space-y-4">
            <!-- Section A: Sertifikat Level 1 -->
            <div class="flex flex-col space-y-4">
              <div class="flex flex-col gap-2 p-2">
                <label for="sertifikat_1" 
                  :class="[
                    'text-sm font-medium',
                    savedFiles.sertifikat_1 ? 'text-green-600' : 'text-gray-700'
                  ]">
                  a. Sertifikat Kompetensi Level 1/ jenjang
                </label>
  
                <!-- Show when file is saved -->
                <div v-if="savedFiles.sertifikat_1" class="text-green-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>File sudah tersimpan</span>
                </div>
  
                <!-- Show file input only when no file is saved -->
                <input v-else type="file" id="sertifikat_1" accept=".pdf"
                  @change="handleFileUpload($event, 'sertifikat_1')" 
                  class="border p-2 rounded-md w-2/3" />
              </div>
  
              <!-- Section B: Sertifikat Level 2 -->
              <hr class="border-t border-gray-300 my-4">
              <div class="flex flex-col gap-2 p-2">
                <label for="sertifikat_2" 
                  :class="[
                    'text-sm font-medium',
                    savedFiles.sertifikat_2 ? 'text-green-600' : 'text-gray-700'
                  ]">
                  b. Sertifikat Kompetensi Level 2/ jenjang
                </label>
  
                <!-- Show when file is saved -->
                <div v-if="savedFiles.sertifikat_2" class="text-green-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>File sudah tersimpan</span>
                </div>
  
                <!-- Show file input only when no file is saved -->
                <input v-else type="file" id="sertifikat_2" accept=".pdf"
                  @change="handleFileUpload($event, 'sertifikat_2')" 
                  class="border p-2 rounded-md w-2/3" />
              </div>
  
              <!-- Section C: Sertifikat Level 3 -->
              <hr class="border-t border-gray-300 my-4">
              <div class="flex flex-col gap-2 p-2">
                <label for="sertifikat_3" 
                  :class="[
                    'text-sm font-medium',
                    savedFiles.sertifikat_3 ? 'text-green-600' : 'text-gray-700'
                  ]">
                  c. Sertifikat Kompetensi Level 3/ jenjang
                </label>
  
                <!-- Show when file is saved -->
                <div v-if="savedFiles.sertifikat_3" class="text-green-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>File sudah tersimpan</span>
                </div>
  
                <!-- Show file input only when no file is saved -->
                <input v-else type="file" id="sertifikat_3" accept=".pdf"
                  @change="handleFileUpload($event, 'sertifikat_3')" 
                  class="border p-2 rounded-md w-2/3" />
              </div>
            </div>
  
            <div class="flex justify-between items-center mt-6">
              <router-link to="/soal-4" 
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
  
              <router-link to="/soal-6" 
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
  
  // Field mapping for frontend to backend
  const fieldMapping = {
    'sertifikat_1': 'sertifikat_1',
    'sertifikat_2': 'sertifikat_2',
    'sertifikat_3': 'sertifikat_3'
  };
  
  onMounted(async () => {
    await fetchAnswer();
  });
  
  const fetchAnswer = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/soal5', {
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
    if (savedFiles.value.sertifikat_1) nilai += 3; // Level 1: 3 points
    if (savedFiles.value.sertifikat_2) nilai += 4; // Level 2: 4 points
    if (savedFiles.value.sertifikat_3) nilai += 5; // Level 3: 5 points
    
    // Maximum score is 12
    return Math.min(nilai, 12);
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
      await axios.delete('http://localhost:8000/api/soal5', {
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
        ? 'http://localhost:8000/api/update5'
        : 'http://localhost:8000/api/soal5';
  
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