<template>
  <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-4 sm:px-6 lg:px-8 transition-all">
    <div class="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
      <div class="p-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-semibold text-gray-900">Your Education Level</h1>
          <button
            v-if="!isEditing"
            @click="startEditing"
            class="bg-green-600 text-white rounded-xl py-2 px-6 hover:bg-green-700 transition-all duration-300"
          >
            Edit Answer
          </button>
        </div>

        <!-- Display Mode -->
        <div v-if="!isEditing" class="space-y-6">
          <div class="border-b pb-4">
            <p class="text-sm text-gray-600">Education Level</p>
            <p class="text-xl font-medium">{{ soal1Data?.tingkat_pendidikan }}</p>
          </div>
          <div class="border-b pb-4">
            <p class="text-sm text-gray-600">Score</p>
            <p class="text-xl font-medium">{{ soal1Data?.nilai }}</p>
          </div>
          <button
            @click="showDeleteConfirm = true"
            class="mt-6 w-full bg-red-500 text-white rounded-xl py-2 px-6 hover:bg-red-600 transition-colors duration-300"
          >
            Delete Answer
          </button>
        </div>

        <!-- Edit Mode -->
        <form v-else @submit.prevent="updateAnswer" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600">Education Level</label>
            <select
              v-model="editForm.tingkat_pendidikan"
              class="mt-2 block w-full rounded-xl border-gray-300 shadow-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              required
            >
              <option value="SMP-D3">SMP - D3 (3 points)</option>
              <option value="S1">S1 (4 points)</option>
              <option value="S2_atau_lebih">S2 or higher (5 points)</option>
            </select>
          </div>
          <div class="flex space-x-4">
            <button
              type="submit"
              class="flex-1 bg-green-600 text-white rounded-xl py-2 px-6 hover:bg-green-700 transition-all duration-300"
            >
              Save Changes
            </button>
            <button
              type="button"
              @click="cancelEditing"
              class="flex-1 bg-gray-400 text-white rounded-xl py-2 px-6 hover:bg-gray-500 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4">
          <p class="text-red-500 text-sm">{{ errorMessage }}</p>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all">
          <div class="bg-white p-6 rounded-3xl max-w-sm mx-4 transform transition-all duration-300 scale-110 hover:scale-100">
            <h3 class="text-lg font-medium mb-4 text-gray-800">Delete Answer</h3>
            <p class="mb-4 text-gray-600">Are you sure you want to delete your answer? This action cannot be undone.</p>
            <div class="flex space-x-4">
              <button
                @click="deleteAnswer"
                class="flex-1 bg-red-500 text-white rounded-xl py-2 hover:bg-red-600 transition-all duration-300"
              >
                Yes, Delete
              </button>
              <button
                @click="showDeleteConfirm = false"
                class="flex-1 bg-gray-300 text-gray-700 rounded-xl py-2 hover:bg-gray-400 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
const isEditing = ref(false)
const showDeleteConfirm = ref(false)
const errorMessage = ref('')

const editForm = ref({
  tingkat_pendidikan: ''
})

onMounted(async () => {
  await getSoal1Data()
})

const getSoal1Data = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/soal1', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}` // Ambil token Bearer dari store
      }
    })
    soal1Data.value = response.data
    editForm.value.tingkat_pendidikan = soal1Data.value?.tingkat_pendidikan || ''
  } catch (error) {
    errorMessage.value = 'Failed to load data'
  }
}

const startEditing = () => {
  isEditing.value = true
  editForm.value.tingkat_pendidikan = soal1Data.value?.tingkat_pendidikan || ''
}

const cancelEditing = () => {
  isEditing.value = false
  errorMessage.value = ''
}

const updateAnswer = async () => {
  try {
    const response = await axios.put(
      'http://localhost:8000/api/soal1',
      { tingkat_pendidikan: editForm.value.tingkat_pendidikan },
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        }
      }
    )
    soal1Data.value = response.data
    isEditing.value = false
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to update answer'
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
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to delete answer'
    showDeleteConfirm.value = false
  }
}
</script>

<style scoped>
/* Add your custom styles here, similar to the profile.vue styles */
.bg-gradient-to-t {
  background: linear-gradient(to top, #66bb6a, #ffffff);
}
</style>
