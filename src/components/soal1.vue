<template>
  <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="p-8 space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Soal 1: Pendidikan Formal Terakhir Anda</h1>

        <form @submit.prevent="submitAnswer" class="space-y-4">
          <div class="flex flex-col">
            <label class="text-lg font-medium text-gray-800">Pilih pendidikan terakhir Anda</label>
            <!-- Radio buttons untuk pilihan jawaban -->
            <div class="space-y-3 mt-4">
              <div class="flex items-center">
                <input
                  type="radio"
                  id="smp-d3"
                  value="SMP-D3"
                  v-model="selectedAnswer"
                  class="form-radio h-5 w-5"
                />
                <label for="smp-d3" class="ml-2 text-sm" :class="{ 'text-green-600': isAnswerSaved && selectedAnswer === 'SMP-D3' }">SMP - D3 (3 poin)</label>
              </div>
              <div class="flex items-center">
                <input
                  type="radio"
                  id="s1"
                  value="S1"
                  v-model="selectedAnswer"
                  class="form-radio h-5 w-5"
                />
                <label for="s1" class="ml-2 text-sm" :class="{ 'text-green-600': isAnswerSaved && selectedAnswer === 'S1' }">S1 (4 poin)</label>
              </div>
              <div class="flex items-center">
                <input
                  type="radio"
                  id="s2_atau_lebih"
                  value="S2_atau_lebih"
                  v-model="selectedAnswer"
                  class="form-radio h-5 w-5"
                />
                <label for="s2_atau_lebih" class="ml-2 text-sm" :class="{ 'text-green-600': isAnswerSaved && selectedAnswer === 'S2_atau_lebih' }">S2 atau lebih (5 poin)</label>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-between items-center mt-6">
            <button
              type="submit"
              class="bg-green-600 text-white rounded-xl py-3 px-6 hover:bg-green-700 transition-all duration-300"
            >
              {{ isEditMode ? 'Ubah' : 'Simpan' }}
            </button>
            <!-- Tombol Hapus Jawaban hanya tampil jika ada jawaban -->
            <button
              v-if="selectedAnswer"
              type="button"
              @click="deleteAnswer"
              class="bg-red-500 text-white rounded-xl py-3 px-6 hover:bg-red-600 transition-all duration-300"
            >
              Hapus
            </button>
            <router-link
              to="/soal-2"
              class="bg-blue-600 text-white rounded-xl py-3 px-6 hover:bg-blue-700 transition-all duration-300"
            >
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
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const selectedAnswer = ref('')
const isEditMode = ref(false)
const isAnswerSaved = ref(false) // Flag untuk mengecek apakah jawaban sudah disimpan

// Extract current question number from route
const currentQuestionNumber = computed(() => {
  const match = route.path.match(/\/soal-(\d+)/)
  return match ? parseInt(match[1]) : 1
})

onMounted(async () => {
  await fetchAnswer()
})

const fetchAnswer = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/soal1', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    if (response.data) {
      selectedAnswer.value = response.data.tingkat_pendidikan
      isAnswerSaved.value = true // Tanda bahwa jawaban sudah disimpan
      isEditMode.value = true
    }
  } catch (error) {
    console.error(error)
  }
}

const submitAnswer = async () => {
  try {
    const response = isEditMode.value
      ? await axios.put(
          'http://localhost:8000/api/soal1',
          { tingkat_pendidikan: selectedAnswer.value },
          { headers: { Authorization: `Bearer ${authStore.accessToken}` } }
        )
      : await axios.post(
          'http://localhost:8000/api/soal1',
          { tingkat_pendidikan: selectedAnswer.value },
          { headers: { Authorization: `Bearer ${authStore.accessToken}` } }
        )
    console.log('Answer saved successfully:', response.data)
    isAnswerSaved.value = true
    isEditMode.value = true
  } catch (error) {
    console.error('Failed to save answer', error)
  }
}

const deleteAnswer = async () => {
  try {
    await axios.delete('http://localhost:8000/api/soal1', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    selectedAnswer.value = ''  // Mengosongkan pilihan radio setelah dihapus
    isAnswerSaved.value = false // Mengubah status jawaban menjadi belum disimpan
    isEditMode.value = false
    console.log('Answer deleted successfully')
  } catch (error) {
    console.error('Failed to delete answer', error)
  }
}
</script>

<style scoped>
/* Styling untuk radio buttons */
.form-radio {
  accent-color: #34d399; /* warna hijau */
}
.bg-gradient-to-t {
  background: linear-gradient(to top, #66bb6a, #ffffff);
}

/* Button hover effects */
button:hover, a.router-link:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>