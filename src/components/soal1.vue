<template>
  <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-4 sm:px-6 lg:px-8 transition-all">
    <div class="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
      <div class="p-8">
        <h1 class="text-3xl font-semibold text-gray-900 mb-6">1. Apa pendidikan formal terakhir Anda?</h1>

        <!-- Pilihan Jawaban -->
        <div class="space-y-4 mb-6">
          <div>
            <input
              type="radio"
              id="smp-d3"
              v-model="answerForm.tingkat_pendidikan"
              value="SMP-D3"
              class="mr-2"
              required
            />
            <label for="smp-d3" class="text-lg">SMP - D3</label>
          </div>
          <div>
            <input
              type="radio"
              id="s1"
              v-model="answerForm.tingkat_pendidikan"
              value="S1"
              class="mr-2"
              required
            />
            <label for="s1" class="text-lg">S1</label>
          </div>
          <div>
            <input
              type="radio"
              id="s2"
              v-model="answerForm.tingkat_pendidikan"
              value="S2_atau_lebih"
              class="mr-2"
              required
            />
            <label for="s2" class="text-lg">S2 / di atasnya</label>
          </div>
        </div>

        <!-- Button untuk menyimpan atau memperbarui jawaban -->
        <div class="flex space-x-4">
          <button
            v-if="!soal1Data"
            @click="saveAnswer"
            class="flex-1 bg-green-600 text-white rounded-xl py-2 px-6 hover:bg-green-700 transition-all duration-300"
          >
            Simpan Jawaban
          </button>
          <button
            v-if="soal1Data"
            @click="updateAnswer"
            class="flex-1 bg-green-600 text-white rounded-xl py-2 px-6 hover:bg-green-700 transition-all duration-300"
          >
            Ubah Jawaban
          </button>
          
          <!-- Hapus Jawaban -->
          <button
            v-if="soal1Data"
            @click="showDeleteConfirm = true"
            class="flex-1 bg-red-500 text-white rounded-xl py-2 px-6 hover:bg-red-600 transition-all duration-300"
          >
            Hapus Jawaban
          </button>
        </div>

        <!-- Konfirmasi Hapus Jawaban -->
        <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all">
          <div class="bg-white p-6 rounded-3xl max-w-sm mx-4 transform transition-all duration-300 scale-110 hover:scale-100">
            <h3 class="text-lg font-medium mb-4 text-gray-800">Hapus Jawaban</h3>
            <p class="mb-4 text-gray-600">Apakah Anda yakin ingin menghapus jawaban Anda? Tindakan ini tidak dapat dibatalkan.</p>
            <div class="flex space-x-4">
              <button
                @click="deleteAnswer"
                class="flex-1 bg-red-500 text-white rounded-xl py-2 hover:bg-red-600 transition-all duration-300"
              >
                Ya, Hapus
              </button>
              <button
                @click="showDeleteConfirm = false"
                class="flex-1 bg-gray-300 text-gray-700 rounded-xl py-2 hover:bg-gray-400 transition-all duration-300"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tombol Next ke soal-2 -->
      <div class="text-center mt-6">
        <router-link
          to="/soal-2"
          class="bg-blue-600 text-white rounded-xl py-2 px-6 hover:bg-blue-700 transition-all duration-300"
        >
          Next Soal
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // Jika menggunakan Pinia atau Vuex
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const soal1Data = ref(null)
const answerForm = ref({ tingkat_pendidikan: '' })
const showDeleteConfirm = ref(false)

onMounted(async () => {
  await getSoal1Data()
})

const getSoal1Data = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/soal1', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    soal1Data.value = response.data
    answerForm.value.tingkat_pendidikan = soal1Data.value?.tingkat_pendidikan || ''
  } catch (error) {
    console.error('Failed to load data')
  }
}

const saveAnswer = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/soal1', {
      tingkat_pendidikan: answerForm.value.tingkat_pendidikan
    }, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    soal1Data.value = response.data
  } catch (error) {
    console.error('Failed to save answer')
  }
}

const updateAnswer = async () => {
  try {
    const response = await axios.put('http://localhost:8000/api/soal1', {
      tingkat_pendidikan: answerForm.value.tingkat_pendidikan
    }, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    soal1Data.value = response.data
  } catch (error) {
    console.error('Failed to update answer')
  }
}

const deleteAnswer = async () => {
  try {
    await axios.delete('http://localhost:8000/api/soal1', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    soal1Data.value = null
    showDeleteConfirm.value = false
  } catch (error) {
    console.error('Failed to delete answer')
  }
}
</script>

<style scoped>
/* Add your custom styles here */
.bg-gradient-to-t {
  background: linear-gradient(to top, #66bb6a, #ffffff);
}
</style>
