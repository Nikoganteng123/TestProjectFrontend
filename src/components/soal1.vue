<template>
  <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
      <div class="p-8 space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Data 1: Pendidikan Formal Terakhir Anda</h1>

        <form @submit.prevent="submitAnswer" class="space-y-4">
          <div class="flex flex-col">
            <label class="text-lg font-medium text-gray-800">Pilih pendidikan terakhir Anda</label>
            <div class="space-y-3 mt-4">
              <div class="flex items-center">
                <input
                  type="radio"
                  id="smp-d3"
                  value="SMP-D3"
                  v-model="selectedAnswer"
                  class="form-radio h-5 w-5"
                  :disabled="isAnswerSaved"
                />
                <label
                  for="smp-d3"
                  class="ml-2 text-sm"
                  :class="{
                    'text-green-600 font-semibold': isAnswerSaved && selectedAnswer === 'SMP-D3',
                    'text-gray-700': !isAnswerSaved || selectedAnswer !== 'SMP-D3'
                  }"
                >
                  SMP - D3 (2 poin)
                </label>
              </div>
              <div class="flex items-center">
                <input
                  type="radio"
                  id="s1"
                  value="S1"
                  v-model="selectedAnswer"
                  class="form-radio h-5 w-5"
                  :disabled="isAnswerSaved"
                />
                <label
                  for="s1"
                  class="ml-2 text-sm"
                  :class="{
                    'text-green-600 font-semibold': isAnswerSaved && selectedAnswer === 'S1',
                    'text-gray-700': !isAnswerSaved || selectedAnswer !== 'S1'
                  }"
                >
                  S1 (4 poin)
                </label>
              </div>
              <div class="flex items-center">
                <input
                  type="radio"
                  id="s2_atau_lebih"
                  value="S2_atau_lebih"
                  v-model="selectedAnswer"
                  class="form-radio h-5 w-5"
                  :disabled="isAnswerSaved"
                />
                <label
                  for="s2_atau_lebih"
                  class="ml-2 text-sm"
                  :class="{
                    'text-green-600 font-semibold': isAnswerSaved && selectedAnswer === 'S2_atau_lebih',
                    'text-gray-700': !isAnswerSaved || selectedAnswer !== 'S2_atau_lebih'
                  }"
                >
                  S2 atau lebih (5 poin)
                </label>
              </div>
            </div>

            <!-- Input File Bukti (PDF atau Gambar) -->
            <div v-if="selectedAnswer && !isAnswerSaved" class="mt-6">
              <label for="tingkat_pendidikan_file" class="block text-sm font-medium text-gray-700 mb-2">
                Unggah Bukti Pendidikan (PDF, JPG, PNG, dll., maks 2MB)
                <span class="text-red-500">*</span>
              </label>
              <div
                class="relative border-2 border-dashed border-green-400 rounded-lg p-6 text-center bg-gray-50 hover:bg-green-50 transition-all duration-300"
                @dragover.prevent
                @drop.prevent="handleDrop"
              >
                <input
                  type="file"
                  id="tingkat_pendidikan_file"
                  accept=".pdf,image/*"
                  @change="handleFileUpload"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div v-if="!selectedFile" class="space-y-2">
                  <i class="fas fa-cloud-upload-alt text-green-600 text-3xl"></i>
                  <p class="text-gray-600 text-sm">
                    Seret dan lepaskan file di sini atau <span class="text-green-600 font-semibold">pilih file</span>
                  </p>
                  <p class="text-xs text-gray-500">Format: PDF, JPG, PNG, dll. (maks 2MB)</p>
                </div>
                <div v-else class="flex items-center justify-center space-x-2">
                  <i class="fas fa-file-alt text-green-600 text-xl"></i>
                  <span class="text-sm text-gray-700">{{ selectedFile.name }}</span>
                  <button
                    @click="clearFile"
                    class="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>

            <!-- Tampilkan status file tersimpan -->
            <div v-if="isAnswerSaved" class="text-green-600 flex items-center gap-2 mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>File bukti pendidikan sudah tersimpan</span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-between items-center mt-6">
            <button
              type="submit"
              :disabled="!selectedAnswer || !selectedFile || isAnswerSaved"
              class="bg-green-600 text-white rounded-xl py-3 px-6 hover:bg-green-700 transition-all duration-300 w-full sm:w-auto"
            >
              Simpan
            </button>
            <button
              v-if="isAnswerSaved"
              type="button"
              @click="deleteAnswer"
              class="bg-red-500 text-white rounded-xl py-3 px-6 hover:bg-red-600 transition-all duration-300 w-full sm:w-auto"
            >
              Hapus
            </button>
            <router-link
              to="/soal-2"
              class="bg-blue-600 text-white rounded-xl py-3 px-6 hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto text-center"
            >
              Lanjut
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
import { useRoute } from 'vue-router'
import 'animate.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

const route = useRoute()
const authStore = useAuthStore()

const selectedAnswer = ref('')
const selectedFile = ref(null)
const isAnswerSaved = ref(false)

const currentQuestionNumber = computed(() => {
  const match = route.path.match(/\/soal-(\d+)/)
  return match ? parseInt(match[1]) : 1
})

onMounted(async () => {
  await fetchAnswer()
})

const fetchAnswer = async () => {
  try {
    const response = await axios.get('/api/soal1', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    if (response.data) {
      selectedAnswer.value = response.data.tingkat_pendidikan
      isAnswerSaved.value = true
    }
  } catch (error) {
    console.error('Failed to fetch answer:', error)
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  validateAndSetFile(file)
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  validateAndSetFile(file)
}

const validateAndSetFile = (file) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  if (file && allowedTypes.includes(file.type) && file.size <= 2 * 1024 * 1024) {
    selectedFile.value = file
  } else {
    alert('File harus berupa PDF atau gambar (JPG, PNG, dll.) dan maksimum 2MB')
    selectedFile.value = null
  }
}

const clearFile = () => {
  selectedFile.value = null
}

const submitAnswer = async () => {
  if (!selectedAnswer.value || !selectedFile.value) {
    alert('Harap pilih tingkat pendidikan dan unggah file bukti!')
    return
  }

  try {
    const formData = new FormData()
    formData.append('tingkat_pendidikan', selectedAnswer.value)
    formData.append('tingkat_pendidikan_file', selectedFile.value)

    const response = await axios.post('/api/soal1', formData, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('Answer saved successfully:', response.data)
    isAnswerSaved.value = true
    selectedFile.value = null
  } catch (error) {
    console.error('Failed to save answer:', error)
    alert('Gagal menyimpan jawaban: ' + (error.response?.data?.message || error.message))
  }
}

const deleteAnswer = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus jawaban?')) return

  try {
    await axios.delete('/api/soal1', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    selectedAnswer.value = ''
    selectedFile.value = null
    isAnswerSaved.value = false
    console.log('Answer deleted successfully')
  } catch (error) {
    console.error('Failed to delete answer:', error)
    alert('Gagal menghapus jawaban: ' + (error.response?.data?.message || error.message))
  }
}
</script>

<style scoped>
/* Container Utama */
.min-h-screen {
  background: linear-gradient(to top, #2d6a4f, #f0fdf4);
  padding: 3rem 1.5rem;
  position: relative;
  overflow: hidden;
}

/* Card Container */
.max-w-2xl {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(45, 106, 79, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.max-w-2xl:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(45, 106, 79, 0.25);
}

/* Heading */
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

/* File Upload Area */
.border-dashed {
  border-color: #34d399;
  transition: all 0.3s ease;
}

.border-dashed:hover {
  border-color: #2d6a4f;
  background: #ecfdf5;
}

.border-dashed.dragover {
  background: #d1fae5;
  border-color: #2d6a4f;
}

/* Icons and Text */
.fa-cloud-upload-alt,
.fa-file-alt {
  transition: transform 0.3s ease;
}

.border-dashed:hover .fa-cloud-upload-alt {
  transform: scale(1.1);
}

/* Buttons */
.bg-green-600,
.bg-red-500,
.bg-blue-600 {
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.bg-green-600 {
  background: linear-gradient(135deg, #2d6a4f, #34d399);
}

.bg-green-600:hover:not(:disabled) {
  background: linear-gradient(135deg, #1f4d36, #22c55e);
}

.bg-green-600:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Animations */
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
</style>