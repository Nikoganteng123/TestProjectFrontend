<template>
    <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
      <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-8 space-y-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">
            Soal 4: Apakah anda memiliki sertifikasi dari Lembaga Floristy Asing dan Dalam Negeri?
          </h1>
  
          <form @submit.prevent="submitAnswer" class="space-y-4">
            <!-- Section A: Organisasi Independent -->
            <div class="flex flex-col space-y-4">
              <div class="flex flex-col gap-2 p-2">
                <label for="independent_org" 
                  :class="[
                    'text-sm font-medium',
                    savedFiles.independent_org ? 'text-green-600' : 'text-gray-700'
                  ]">
                  a. Dari organisasi Independent (AIFD, CFD, dll)
                </label>
  
                <!-- Show when file is saved -->
                <div v-if="savedFiles.independent_org" class="text-green-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>File sudah tersimpan</span>
                </div>
  
                <!-- Show file input only when no file is saved -->
                <input v-else type="file" id="independent_org" accept=".pdf"
                  @change="handleFileUpload($event, 'independent_org')" 
                  class="border p-2 rounded-md w-2/3" />
              </div>
  
              <!-- Section B: Sekolah Luar Negeri dengan Gelar -->
              <hr class="border-t border-gray-300 my-4">
              <div class="flex flex-col gap-2 p-2">
                <label for="foreign_school_degree" 
                  :class="[
                    'text-sm font-medium',
                    savedFiles.foreign_school_degree ? 'text-green-600' : 'text-gray-700'
                  ]">
                  b. Dari sekolah merangkai bunga luar negeri (mendapat gelar-gelar)
                </label>
  
                <!-- Show when file is saved -->
                <div v-if="savedFiles.foreign_school_degree" class="text-green-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>File sudah tersimpan</span>
                </div>
  
                <!-- Show file input only when no file is saved -->
                <input v-else type="file" id="foreign_school_degree" accept=".pdf"
                  @change="handleFileUpload($event, 'foreign_school_degree')" 
                  class="border p-2 rounded-md w-2/3" />
              </div>
  
              <!-- Section C: Sekolah Luar Negeri tanpa Gelar -->
              <hr class="border-t border-gray-300 my-4">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">
                  c. Dari sekolah merangkai bunga luar negeri (tidak mendapatkan gelar)
                </label>
                <div class="space-y-3">
                  <div v-for="i in 5" :key="`foreign_no_degree_${i}`" class="flex flex-col gap-2 p-2">
                    <label :for="`foreign_school_no_degree_${i}`" 
                      :class="[
                        'text-sm font-medium',
                        savedFiles[`foreign_school_no_degree_${i}`] ? 'text-green-600' : 'text-gray-700'
                      ]">
                      File {{ i }}
                    </label>
  
                    <!-- Show when file is saved -->
                    <div v-if="savedFiles[`foreign_school_no_degree_${i}`]" class="text-green-600 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>File sudah tersimpan</span>
                    </div>
  
                    <!-- Show file input only when no file is saved -->
                    <input v-else type="file" :id="`foreign_school_no_degree_${i}`" accept=".pdf"
                      @change="handleFileUpload($event, `foreign_school_no_degree_${i}`)" 
                      class="border p-2 rounded-md w-2/3" />
                  </div>
                </div>
              </div>
  
              <!-- Section D: Sekolah Dalam Negeri tanpa Gelar -->
              <hr class="border-t border-gray-300 my-4">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">
                  d. Dari sekolah merangkai bunga dalam negeri (tidak mendapatkan gelar)
                </label>
                <div class="space-y-3">
                  <div v-for="i in 5" :key="`domestic_no_degree_${i}`" class="flex flex-col gap-2 p-2">
                    <label :for="`domestic_school_no_degree_${i}`" 
                      :class="[
                        'text-sm font-medium',
                        savedFiles[`domestic_school_no_degree_${i}`] ? 'text-green-600' : 'text-gray-700'
                      ]">
                      File {{ i }}
                    </label>
  
                    <!-- Show when file is saved -->
                    <div v-if="savedFiles[`domestic_school_no_degree_${i}`]" class="text-green-600 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>File sudah tersimpan</span>
                    </div>
  
                    <!-- Show file input only when no file is saved -->
                    <input v-else type="file" :id="`domestic_school_no_degree_${i}`" accept=".pdf"
                      @change="handleFileUpload($event, `domestic_school_no_degree_${i}`)" 
                      class="border p-2 rounded-md w-2/3" />
                  </div>
                </div>
              </div>
            </div>
  
            <div class="flex justify-between items-center mt-6">
              <router-link to="/soal-3" 
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
  
              <router-link to="/soal-5" 
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
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/auth';
  
  const authStore = useAuthStore();
  const uploadedFiles = ref({});
  const savedFiles = ref({});
  const totalNilai = ref(0);
  
  // Mapping nama field di frontend dengan backend - PERBAIKAN MAPPING UNTUK SECTION A & D
  const fieldMapping = {
    // Option A - pastikan mapping sudah benar
    'independent_org': 'independent_org',
    
    // Option B
    'foreign_school_degree': 'foreign_school_degree',
    
    // Option C
    'foreign_school_no_degree_1': 'foreign_school_no_degree_1',
    'foreign_school_no_degree_2': 'foreign_school_no_degree_2',
    'foreign_school_no_degree_3': 'foreign_school_no_degree_3',
    'foreign_school_no_degree_4': 'foreign_school_no_degree_4',
    'foreign_school_no_degree_5': 'foreign_school_no_degree_5',
    
    // Option D - pastikan mapping sudah benar
    'domestic_school_no_degree_1': 'domestic_school_no_degree_1',
    'domestic_school_no_degree_2': 'domestic_school_no_degree_2',
    'domestic_school_no_degree_3': 'domestic_school_no_degree_3',
    'domestic_school_no_degree_4': 'domestic_school_no_degree_4',
    'domestic_school_no_degree_5': 'domestic_school_no_degree_5'
  };
  
  // Reverse mapping untuk konversi dari backend ke frontend
  const reverseFieldMapping = Object.entries(fieldMapping).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
  
  // Helper untuk debug, menampilkan mapping lengkap
  const logFieldMappings = () => {
    console.table(fieldMapping);
    console.log('REVERSE MAPPINGS:');
    console.table(reverseFieldMapping);
  };
  
  onMounted(async () => {
    logFieldMappings(); // Log semua field mappings ketika komponen di-mount
    await fetchAnswer();
  });
  
  const fetchAnswer = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/soal4', {
        headers: { Authorization: `Bearer ${authStore.accessToken}` }
      });
      
      if (response.data && response.data.data) {
        const backendData = response.data.data;
        const mappedData = {};
        
        console.log("Data from backend:", backendData);
        
        // Konversi nama field dari backend ke frontend
        Object.entries(backendData).forEach(([key, value]) => {
          if (reverseFieldMapping[key] && value) {
            mappedData[reverseFieldMapping[key]] = value;
            console.log(`Mapped backend field '${key}' to frontend field '${reverseFieldMapping[key]}'`);
          } else if (key !== 'nilai' && key !== 'id' && value) {
            console.warn(`No mapping found for backend field: '${key}'`);
          }
        });
        
        console.log("Final mapped data for frontend:", mappedData);
        savedFiles.value = mappedData;
        totalNilai.value = backendData.nilai || calculateNilai();
      } else {
        savedFiles.value = {};
        totalNilai.value = 0;
      }
    } catch (error) {
      console.error('Error fetching answers:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      savedFiles.value = {};
      totalNilai.value = 0;
    }
  };
  
  const calculateNilai = () => {
    let nilai = 0;
    
    // Hitung sesuai aturan penilaian
    if (savedFiles.value.independent_org) nilai += 8;
    if (savedFiles.value.foreign_school_degree) nilai += 7;
    
    // Hitung untuk sekolah luar negeri tanpa gelar (3 poin per file)
    for (let i = 1; i <= 5; i++) {
      if (savedFiles.value[`foreign_school_no_degree_${i}`]) nilai += 3;
    }
    
    // Hitung untuk sekolah dalam negeri tanpa gelar (3 poin per file)
    for (let i = 1; i <= 5; i++) {
      if (savedFiles.value[`domestic_school_no_degree_${i}`]) nilai += 3;
    }
    
    return nilai;
  };
  
  const handleFileUpload = (event, field) => {
    const file = event.target.files[0];
    if (file) {
      uploadedFiles.value[field] = file;
      
      // Log file upload dengan mapping info
      console.log(`File uploaded for field '${field}':`, file.name, 
        `(Maps to backend field: '${fieldMapping[field] || "NO MAPPING FOUND!"}')`);
      
      // Extra checking for problematic fields
      if (field === 'independent_org' || field.startsWith('domestic_school_no_degree_')) {
        if (!fieldMapping[field]) {
          console.error(`CRITICAL: No backend mapping found for ${field}!`);
        }
      }
    }
  };
  
  const deleteAllFiles = async () => {
    try {
      await axios.delete('http://localhost:8000/api/soal4', {
        headers: { Authorization: `Bearer ${authStore.accessToken}` }
      });
  
      savedFiles.value = {};
      uploadedFiles.value = {};
      totalNilai.value = 0;
    } catch (error) {
      console.error('Failed to delete all files:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
    }
  };
  
  const submitAnswer = async () => {
    try {
      const formData = new FormData();
      let hasFiles = false;
  
      // Debug information for uploaded files
      console.log("Files ready to upload:", Object.keys(uploadedFiles.value));
      console.log("Option A field present:", uploadedFiles.value.hasOwnProperty('independent_org'));
      console.log("Option D fields present:", Object.keys(uploadedFiles.value)
        .filter(key => key.startsWith('domestic_school_no_degree_')));
  
      // SPECIAL HANDLING FOR OPTION A - Ensure it's properly mapped and added
      if (uploadedFiles.value.independent_org) {
        const backendField = fieldMapping['independent_org'];
        console.log(`CRITICAL CHECK - Mapping 'independent_org' to '${backendField}'`);
        formData.append(backendField, uploadedFiles.value.independent_org);
        hasFiles = true;
      }
  
      // SPECIAL HANDLING FOR OPTION D - Ensure they're properly mapped and added
      Object.keys(uploadedFiles.value)
        .filter(key => key.startsWith('domestic_school_no_degree_'))
        .forEach(key => {
          const backendField = fieldMapping[key];
          console.log(`CRITICAL CHECK - Mapping '${key}' to '${backendField}'`);
          if (backendField) {
            formData.append(backendField, uploadedFiles.value[key]);
            hasFiles = true;
          } else {
            console.error(`No mapping found for ${key}!`);
          }
        });
  
      // Handle all remaining files (options B and C)
      Object.keys(uploadedFiles.value).forEach((key) => {
        // Skip options A and D as we've already handled them
        if (key !== 'independent_org' && !key.startsWith('domestic_school_no_degree_')) {
          if (uploadedFiles.value[key]) {
            const backendFieldName = fieldMapping[key] || key;
            console.log(`Standard processing - Mapping '${key}' to '${backendFieldName}'`);
            formData.append(backendFieldName, uploadedFiles.value[key]);
            hasFiles = true;
          }
        }
      });
  
      // Log all FormData entries for verification
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1] instanceof File ? pair[1].name : pair[1]}`);
      }
  
      if (!hasFiles) {
        console.warn('No files selected');
        return;
      }
  
      const endpoint = Object.keys(savedFiles.value).length > 0 
        ? 'http://localhost:8000/api/update4'
        : 'http://localhost:8000/api/soal4';
  
      console.log("Submitting to endpoint:", endpoint);
  
      const response = await axios.post(endpoint, formData, {
        headers: { 
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'multipart/form-data' 
        },
        timeout: 60000 // Increase timeout to 60 seconds
      });
  
      console.log('Answer saved successfully:', response.data);
      uploadedFiles.value = {};
      await fetchAnswer();
    } catch (error) {
      handleSubmissionError(error);
    }
  };
  
  // Separate function to handle submission errors
  const handleSubmissionError = (error) => {
    console.error('Failed to save answer:', error);
    
    // More detailed error logging
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    
    // Alert user of error with specific details if available
    let errorMessage = 'Failed to save answer.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage += ` Server says: ${error.response.data.message}`;
    } else if (error.message) {
      errorMessage += ` Error: ${error.message}`;
    }
    
    alert(errorMessage);
  };
  </script>
  
  <style scoped>
  .bg-gradient-to-t {
    background: linear-gradient(to top, #66bb6a, #ffffff);
  }
  </style>