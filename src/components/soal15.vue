<template>
    <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
      <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
        <div class="p-8 space-y-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">
            Data 15: Memiliki Kemampuan Floristry di Gaya Merangkai Bunga Lainnya
          </h1>
  
          <form @submit.prevent="submitAnswer" class="space-y-4">
            <div class="flex flex-col space-y-4">
              <div v-for="(field, index) in certificateFields" :key="index">
                <hr v-if="['ikebana_guru', 'rangkaian_tradisional', 'lainnya'].includes(field.key)" 
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
  
                  <!-- Show file input only when no file is saved -->
                  <input v-else type="file" :id="field.key" accept=".pdf"
                    @change="handleFileUpload($event, field.key)" 
                    class="border p-2 rounded-md w-2/3 form-radio" />
                </div>
              </div>
            </div>
  
            <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-between items-center mt-6">
              <router-link to="/soal-14" 
                class="uniform-button bg-gray-500 text-white rounded-xl py-3 px-6 hover:bg-gray-600 transition-all duration-300 w-full sm:w-auto">
                Previous
              </router-link>
              
              <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button type="submit"
                  v-if="Object.keys(uploadedFiles).length > 0"
                  class="uniform-button bg-green-600 text-white rounded-xl py-3 px-6 hover:bg-green-700 transition-all duration-300 w-full sm:w-auto">
                  {{ Object.keys(savedFiles).length > 0 ? 'Tambah' : 'Simpan' }}
                </button>
  
                <button type="button" @click="deleteAllFiles"
                  v-if="Object.keys(savedFiles).length > 0"
                  class="uniform-button bg-red-600 text-white rounded-xl py-3 px-6 hover:bg-red-700 transition-all duration-300 w-full sm:w-auto">
                  Hapus
                </button>
              </div>
  
              <router-link to="/soal-16" 
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
  
  const certificateFields = [
    { key: 'ikebana_murid', label: 'a. Ikebana Level Murid (5 poin)' },
    { key: 'ikebana_guru', label: 'b. Ikebana Level Guru/Prof (15 poin)' },
    { key: 'rangkaian_tradisional', label: 'c. Rangkaian Tradisional Daerah (10 poin)' },
    { key: 'lainnya', label: 'd. Lainnya (5 poin)' }
  ];
  
  // Extract current question number from route
  const currentQuestionNumber = computed(() => {
    const match = route.path.match(/\/soal-(\d+)/);
    return match ? parseInt(match[1]) : 15;
  });
  
  onMounted(async () => {
    await fetchAnswer();
  });
  
  const fetchAnswer = async () => {
    try {
      const response = await axios.get('/api/soal15', {
        headers: { Authorization: `Bearer ${authStore.accessToken}` }
      });
      
      if (response.data && response.data.data) {
        savedFiles.value = response.data.data;
      } else {
        savedFiles.value = {};
      }
    } catch (error) {
      console.error('Error fetching answers:', error.response ? error.response.data : error.message);
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
      await axios.delete('/api/soal15', {
        headers: { Authorization: `Bearer ${authStore.accessToken}` }
      });
  
      savedFiles.value = {};
      uploadedFiles.value = {};
      console.log('Files deleted successfully');
    } catch (error) {
      console.error('Failed to delete files:', error.response ? error.response.data : error.message);
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
        ? '/api/update15'
        : '/api/soal15';
  
      console.log('Submitting to:', endpoint); // Debugging
  
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
      console.error('Failed to save answer:', error.response ? error.response.data : error.message);
    }
  };
  </script>
  
  <style scoped>
  /* Gunakan style yang sama dari soal11.vue atau soal13.vue */
  .min-h-screen {
    background: linear-gradient(to top, #2d6a4f, #f0fdf4);
    padding: 3rem 1.5rem;
    position: relative;
    overflow: hidden;
  }
  
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
  
  .space-y-4 {
    padding: 0 1rem;
  }
  
  .flex.flex-col {
    position: relative;
  }
  
  .text-lg {
    color: #2d6a4f;
    font-weight: 600;
    margin-bottom: 1rem;
    transition: color 0.3s ease;
  }
  
  .form-radio {
    appearance: none;
    border: 2px solid #34d399;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .form-radio:hover:not(:disabled) {
    box-shadow: 0 0 10px rgba(52, 211, 153, 0.4);
  }
  
  label.text-sm {
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  label.text-green-600 {
    text-shadow: 0 2px 4px rgba(52, 211, 153, 0.2);
  }
  
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
  </style>