<template>
    <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
      <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-8 space-y-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">
            Soal 3: Apakah anda memiliki kemampuan mengajar dalam bahasa asing?
          </h1>
  
          <form @submit.prevent="submitAnswer" class="space-y-6">
            <!-- Bahasa Inggris Selection -->
            <div class="space-y-4">
              <label class="text-lg font-medium text-gray-900">Pilih kemampuan Bahasa Inggris:</label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input type="radio" id="dasar" value="Dasar" v-model="inputData.bahasa_inggris" class="h-4 w-4 text-green-600">
                  <label for="dasar"
                    :class="[
                      'ml-2',
                      savedData.bahasa_inggris === 'Dasar' ? 'text-green-600 font-medium' : 'text-gray-700'
                    ]">
                    a. Bahasa Inggris Dasar
                  </label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="fasih" value="Fasih" v-model="inputData.bahasa_inggris" class="h-4 w-4 text-green-600">
                  <label for="fasih"
                    :class="[
                      'ml-2',
                      savedData.bahasa_inggris === 'Fasih' ? 'text-green-600 font-medium' : 'text-gray-700'
                    ]">
                    b. Bahasa Inggris Fasih
                  </label>
                </div>
              </div>
            </div>
  
            <!-- Bahasa Asing Lain -->
            <div class="space-y-4">
              <label class="text-lg font-medium text-gray-900">c. Bahasa Asing lain (maksimal 4 bahasa):</label>
              <div class="space-y-3">
                <div v-for="n in 4" :key="n" class="flex flex-col">
                  <input type="text" :placeholder="`Masukkan bahasa asing ${n}`"
                    v-model="inputData[`bahasa_lain${n}`]"
                    :class="[
                      'border rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent',
                      savedData[`bahasa_lain${n}`] ? 'border-green-500' : ''
                    ]">
                  <div v-if="savedData[`bahasa_lain${n}`]" class="text-green-600 text-sm mt-1">
                    ✓ Tersimpan: {{ savedData[`bahasa_lain${n}`] }}
                  </div>
                </div>
              </div>
            </div>
  
            <div class="flex justify-between items-center mt-6">
              <router-link to="/soal-2"
                class="bg-gray-500 text-white rounded-xl py-3 px-6 hover:bg-gray-600 transition-all duration-300">
                Previous
              </router-link>
  
              <div class="flex gap-3">
                <button type="submit"
                  class="bg-green-600 text-white rounded-xl py-3 px-6 hover:bg-green-700 transition-all duration-300">
                  {{ hasExistingData ? 'Update Jawaban' : 'Simpan Jawaban' }}
                </button>
  
                <button type="button" @click="deleteAnswer"
                  class="bg-red-600 text-white rounded-xl py-3 px-6 hover:bg-red-700 transition-all duration-300">
                  Hapus Jawaban
                </button>
              </div>
  
              <router-link to="/soal-4"
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
  import { ref, onMounted, reactive } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/auth';
  
  const authStore = useAuthStore();
  const hasExistingData = ref(false);
  
  // Data yang sedang diinput
  const inputData = reactive({
    bahasa_inggris: null,
    bahasa_lain1: '',
    bahasa_lain2: '',
    bahasa_lain3: '',
    bahasa_lain4: ''
  });
  
  // Data yang sudah tersimpan di database
  const savedData = reactive({
    bahasa_inggris: null,
    bahasa_lain1: '',
    bahasa_lain2: '',
    bahasa_lain3: '',
    bahasa_lain4: ''
  });
  
  onMounted(async () => {
    await fetchAnswer();
  });
  
  const fetchAnswer = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/soal3', {
        headers: { Authorization: `Bearer ${authStore.accessToken}` }
      });
  
      if (response.data) {
        // Perbarui data yang tersimpan
        Object.assign(savedData, {
          bahasa_inggris: response.data.bahasa_inggris || null,
          bahasa_lain1: response.data.bahasa_lain1 || '',
          bahasa_lain2: response.data.bahasa_lain2 || '',
          bahasa_lain3: response.data.bahasa_lain3 || '',
          bahasa_lain4: response.data.bahasa_lain4 || ''
        });
        
        // Perbarui data input dengan nilai yang sama
        Object.assign(inputData, {
          bahasa_inggris: response.data.bahasa_inggris || null,
          bahasa_lain1: response.data.bahasa_lain1 || '',
          bahasa_lain2: response.data.bahasa_lain2 || '',
          bahasa_lain3: response.data.bahasa_lain3 || '',
          bahasa_lain4: response.data.bahasa_lain4 || ''
        });
        
        hasExistingData.value = true;
      }
    } catch (error) {
      console.error('Error fetching answer:', error);
    }
  };
  
  const submitAnswer = async () => {
    try {
      const endpoint = 'http://localhost:8000/api/soal3';
      const method = hasExistingData.value ? 'put' : 'post';
  
      const response = await axios[method](endpoint, inputData, {
        headers: { Authorization: `Bearer ${authStore.accessToken}` }
      });
  
      console.log('Answer saved successfully:', response.data);
      
      // Update saved data after successful submission
      Object.assign(savedData, inputData);
      hasExistingData.value = true;
    } catch (error) {
      console.error('Failed to save answer:', error);
    }
  };
  
  const deleteAnswer = async () => {
    try {
      await axios.delete('http://localhost:8000/api/soal3', {
        headers: { Authorization: `Bearer ${authStore.accessToken}` }
      });
  
      // Reset both input and saved data
      Object.assign(inputData, {
        bahasa_inggris: null,
        bahasa_lain1: '',
        bahasa_lain2: '',
        bahasa_lain3: '',
        bahasa_lain4: ''
      });
      
      Object.assign(savedData, {
        bahasa_inggris: null,
        bahasa_lain1: '',
        bahasa_lain2: '',
        bahasa_lain3: '',
        bahasa_lain4: ''
      });
      
      hasExistingData.value = false;
    } catch (error) {
      console.error('Failed to delete answer:', error);
    }
  };
  </script>
  
  <style scoped>
  .bg-gradient-to-t {
    background: linear-gradient(to top, #66bb6a, #ffffff);
  }
  </style>