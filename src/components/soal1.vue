<template>
  <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
      <div class="p-8 space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Soal 1: Pendidikan Formal Terakhir Anda</h1>

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
                  :disabled="isAnswerSaved && !isEditMode"
                />
                <label
                  for="smp-d3"
                  class="ml-2 text-sm"
                  :class="{
                    'text-green-600 font-semibold': isAnswerSaved && !isEditMode && selectedAnswer === 'SMP-D3',
                    'text-gray-700': !isAnswerSaved || isEditMode || selectedAnswer !== 'SMP-D3'
                  }"
                >
                  SMP - D3 (3 poin)
                </label>
              </div>
              <div class="flex items-center">
                <input
                  type="radio"
                  id="s1"
                  value="S1"
                  v-model="selectedAnswer"
                  class="form-radio h-5 w-5"
                  :disabled="isAnswerSaved && !isEditMode"
                />
                <label
                  for="s1"
                  class="ml-2 text-sm"
                  :class="{
                    'text-green-600 font-semibold': isAnswerSaved && !isEditMode && selectedAnswer === 'S1',
                    'text-gray-700': !isAnswerSaved || isEditMode || selectedAnswer !== 'S1'
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
                  :disabled="isAnswerSaved && !isEditMode"
                />
                <label
                  for="s2_atau_lebih"
                  class="ml-2 text-sm"
                  :class="{
                    'text-green-600 font-semibold': isAnswerSaved && !isEditMode && selectedAnswer === 'S2_atau_lebih',
                    'text-gray-700': !isAnswerSaved || isEditMode || selectedAnswer !== 'S2_atau_lebih'
                  }"
                >
                  S2 atau lebih (5 poin)
                </label>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-between items-center mt-6">
            <button
              type="submit"
              class="bg-green-600 text-white rounded-xl py-3 px-6 hover:bg-green-700 transition-all duration-300 w-full sm:w-auto"
            >
              {{ isEditMode && isAnswerSaved ? 'Ubah' : 'Simpan' }}
            </button>
            <button
              v-if="isAnswerSaved"
              type="button"
              @click="enableEdit"
              class="bg-yellow-500 text-white rounded-xl py-3 px-6 hover:bg-yellow-600 transition-all duration-300 w-full sm:w-auto"
              v-show="!isEditMode"
            >
              Edit
            </button>
            <button
              v-if="selectedAnswer"
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
    const response = await axios.get('http://localhost:8000/api/soal1', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    if (response.data) {
      selectedAnswer.value = response.data.tingkat_pendidikan
      isAnswerSaved.value = true
      isEditMode.value = false
    }
  } catch (error) {
    console.error(error)
  }
}

const submitAnswer = async () => {
  try {
    const response = isAnswerSaved.value
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
    isEditMode.value = false
  } catch (error) {
    console.error('Failed to save answer', error)
  }
}

const enableEdit = () => {
  isEditMode.value = true
}

const deleteAnswer = async () => {
  try {
    await axios.delete('http://localhost:8000/api/soal1', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    selectedAnswer.value = ''
    isAnswerSaved.value = false
    isEditMode.value = false
    console.log('Answer deleted successfully')
  } catch (error) {
    console.error('Failed to delete answer', error)
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

/* Nonaktifkan backdrop-filter pada layar kecil */
@media (max-width: 640px) {
  .max-w-2xl {
    backdrop-filter: none;
  }
}

/* Aktifkan backdrop-filter pada layar sm ke atas */
@media (min-width: 640px) {
  .max-w-2xl {
    backdrop-filter: blur(10px);
  }
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

/* Form Styling */
.space-y-4 {
  padding: 0 1rem;
}

/* Label dan Radio Container */
.flex.flex-col {
  position: relative;
}

.text-lg {
  color: #2d6a4f;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.space-y-3 {
  margin-top: 1rem;
}

/* Radio Buttons */
.form-radio {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #34d399;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-radio:checked {
  background: #34d399;
  border-color: #2d6a4f;
}

.form-radio:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.5rem;
  height: 0.5rem;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: scaleIn 0.2s ease-out;
}

.form-radio:hover:not(:disabled) {
  box-shadow: 0 0 10px rgba(52, 211, 153, 0.4);
}

.form-radio:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Label untuk Radio */
label.ml-2 {
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

label.text-green-600 {
  text-shadow: 0 2px 4px rgba(52, 211, 153, 0.2);
}

.flex.items-center:hover label.ml-2:not(.text-green-600) {
  color: #2d6a4f;
}

/* Buttons Container */
.flex.flex-col {
  margin-top: 2rem;
}

/* Buttons */
.bg-green-600,
.bg-red-500,
.bg-blue-600,
.bg-yellow-500 {
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.bg-green-600 {
  background: linear-gradient(135deg, #2d6a4f, #34d399);
}

.bg-red-500 {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.bg-blue-600 {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
}

.bg-yellow-500 {
  background: linear-gradient(135deg, #d97706, #facc15);
}

.bg-green-600:hover {
  background: linear-gradient(135deg, #1f4d36, #22c55e);
}

.bg-red-500:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

.bg-blue-600:hover {
  background: linear-gradient(135deg, #1e40af, #2563eb);
}

.bg-yellow-500:hover {
  background: linear-gradient(135deg, #b45309, #eab308);
}

.bg-green-600::before,
.bg-red-500::before,
.bg-blue-600::before,
.bg-yellow-500::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: all 0.6s ease;
}

.bg-green-600:hover::before,
.bg-red-500:hover::before,
.bg-blue-600:hover::before,
.bg-yellow-500:hover::before {
  left: 100%;
}

/* Question Navigation */
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

/* Navigation Buttons */
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

@keyframes scaleIn {
  from {
    transform: translate(-50%, -50%) scale(0);
  }
  to {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>