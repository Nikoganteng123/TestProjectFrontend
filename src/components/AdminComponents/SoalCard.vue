<template>
    <div v-if="soalData" class="bg-white p-4 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold text-emerald-700">Soal {{ soalNumber }}</h2>
      <p>Nilai: {{ soalData.nilai || 'N/A' }}</p>
      <div class="mt-2">
        <p v-for="(value, key) in soalData" :key="key" class="text-sm">
          {{ key }}: 
          <span v-if="isFileField(key)">
            <a :href="fileUrl(key)" target="_blank" class="text-blue-500 underline">View File</a>
          </span>
          <span v-else>{{ value }}</span>
        </p>
      </div>
      <button
        class="mt-4 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
        @click="$emit('delete-soal', soalNumber)"
      >
        Delete Soal
      </button>
    </div>
    <div v-else class="bg-gray-200 p-4 rounded-lg">
      <p class="text-gray-600">No data for Soal {{ soalNumber }}</p>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  
  const props = defineProps({
    soalNumber: String,
    soalData: Object,
    userId: String,
  });
  
  const authStore = useAuthStore();
  
  // Define file fields (copy this from your backend getFileFields logic)
  const fileFields = [
    'tingkat_pendidikan', 'tp3', 'lpmp_diknas', /* ... add all from getFileFields ... */ 
  ];
  
  const isFileField = (key) => fileFields.includes(key);
  
  const fileUrl = (fieldName) => {
    return `http://localhost:8000/api/admin/soal/${props.soalNumber}/${props.userId}/file/${fieldName}?token=${authStore.accessToken}`;
  };
  </script>