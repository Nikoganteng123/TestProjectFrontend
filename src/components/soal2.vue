<template>
    <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
      <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-8 space-y-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">
            Soal 2: Apakah kamu punya sertifikat Pendidikan Guru Merangkai Bunga?
          </h1>
  
          <form @submit.prevent="submitAnswer" class="space-y-4">
            <div class="flex flex-col space-y-4">
              <div v-for="(field, index) in certificateFields" :key="index">
                <!-- Pemisah antar bagian -->
                <hr v-if="field.key === 'lpmp_diknas' || field.key === 'guru_lain_ipbi_1' || field.key === 'training_trainer'" class="border-t border-gray-300 my-4">
                
                <div class="flex flex-col gap-2 p-2">
                  <label :for="field.key" :class="['text-sm font-medium', uploadedFiles[field.key]?.length ? 'text-green-600' : 'text-gray-700']">
                    {{ field.label }}
                    <span v-if="uploadedFiles[field.key]?.length" class="text-green-500">✔ File tersimpan</span>
                  </label>
                  <input type="file" v-if="shouldShowInput(field.key)" :id="field.key" accept=".pdf" @change="handleFileUpload($event, field.key)" class="border p-2 rounded-md w-2/3" />
                </div>
              </div>
            </div>
  
            <div class="flex justify-between items-center mt-6">
              <router-link to="/soal-1" class="bg-gray-500 text-white rounded-xl py-3 px-6 hover:bg-gray-600 transition-all duration-300">
                Previous
              </router-link>
              <button type="submit" class="bg-green-600 text-white rounded-xl py-3 px-6 hover:bg-green-700 transition-all duration-300">
                {{ isEditMode ? 'Ubah Jawaban' : 'Simpan Jawaban' }}
              </button>
              <button v-if="isEditMode" type="button" @click="deleteAnswer" class="bg-red-500 text-white rounded-xl py-3 px-6 hover:bg-red-600 transition-all duration-300">
                Hapus Jawaban
              </button>
              <router-link to="/soal-3" class="bg-blue-600 text-white rounded-xl py-3 px-6 hover:bg-blue-700 transition-all duration-300">
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
  const isEditMode = ref(false);
  
  const certificateFields = [
    { key: 'tp3', label: 'a. Sertifikat TP3' },
    { key: 'lpmp_diknas', label: 'b. Sertifikat Pelatihan LPMP/Diknas' },
    { key: 'guru_lain_ipbi_1', label: 'c. Sertifikat Guru selain dari IPBI 1' },
    { key: 'guru_lain_ipbi_2', label: '2' },
    { key: 'guru_lain_ipbi_3', label: '3' },
    { key: 'guru_lain_ipbi_4', label: '4' },
    { key: 'training_trainer', label: 'd. Sertifikat Training to Trainer' }
  ];
  
  const shouldShowInput = (fieldKey) => {
    if (!fieldKey.includes("guru_lain_ipbi")) {
      return !uploadedFiles.value[fieldKey]?.length;
    }
    const uploadedCount = Object.keys(uploadedFiles.value).filter(key => key.includes("guru_lain_ipbi") && uploadedFiles.value[key]?.length).length;
    return uploadedCount < 4;
  };
  
  onMounted(async () => {
    await fetchAnswer();
  });
  
  const fetchAnswer = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/soal2', {
        headers: { Authorization: `Bearer ${authStore.accessToken}` }
      });
      if (response.data && Object.keys(response.data.data).length) {
        uploadedFiles.value = response.data.data || {};
        isEditMode.value = true;
      } else {
        isEditMode.value = false;
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleFileUpload = (event, field) => {
    const file = event.target.files[0];
    if (file) {
      uploadedFiles.value[field] = file;
    }
  };
  
  const submitAnswer = async () => {
    try {
      const formData = new FormData();
      Object.keys(uploadedFiles.value).forEach((key) => {
        if (uploadedFiles.value[key]) {
          formData.append(key, uploadedFiles.value[key]);
        }
      });
  
      const response = isEditMode.value
        ? await axios.post('http://localhost:8000/api/soal2/update', formData, {
            headers: { Authorization: `Bearer ${authStore.accessToken}`, 'Content-Type': 'multipart/form-data' }
          })
        : await axios.post('http://localhost:8000/api/soal2', formData, {
            headers: { Authorization: `Bearer ${authStore.accessToken}`, 'Content-Type': 'multipart/form-data' }
          });
  
      console.log('Answer saved successfully:', response.data);
      await fetchAnswer();
    } catch (error) {
      console.error('Failed to save answer', error);
    }
  };
  
  const deleteAnswer = async () => {
    try {
      await axios.delete('http://localhost:8000/api/soal2', {
        headers: { Authorization: `Bearer ${authStore.accessToken}` }
      });
      uploadedFiles.value = {};
      isEditMode.value = false;
      console.log('Answer deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete answer', error);
    }
  };
  </script>
  
  <style scoped>
  .bg-gradient-to-t {
    background: linear-gradient(to top, #66bb6a, #ffffff);
  }
  </style>