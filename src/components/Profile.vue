<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="p-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-semibold text-gray-900">Your Profile</h1>
          <button
            v-if="!isEditing"
            @click="startEditing"
            class="bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-all"
          >
            Edit Profile
          </button>
        </div>

        <!-- Display Mode -->
        <div v-if="!isEditing" class="space-y-6">
          <div class="border-b pb-4">
            <p class="text-sm text-gray-600">Name</p>
            <p class="text-xl font-medium">{{ user?.name }}</p>
          </div>
          <div class="border-b pb-4">
            <p class="text-sm text-gray-600">Email</p>
            <p class="text-xl font-medium">{{ user?.email }}</p>
          </div>
          <button
            @click="showDeleteConfirm = true"
            class="mt-6 w-full bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600 transition-colors"
          >
            Delete Account
          </button>
        </div>

        <!-- Edit Mode -->
        <form v-else @submit.prevent="updateProfile" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600">Name</label>
            <input
              type="text"
              v-model="editForm.name"
              class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              v-model="editForm.email"
              class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div class="flex space-x-4">
            <button
              type="submit"
              class="flex-1 bg-green-500 text-white rounded-md py-2 px-4 hover:bg-green-600 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              @click="cancelEditing"
              class="flex-1 bg-gray-400 text-white rounded-md py-2 px-4 hover:bg-gray-500 transition-colors"
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
        <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white p-6 rounded-lg max-w-sm mx-4">
            <h3 class="text-lg font-medium mb-4 text-gray-800">Delete Account</h3>
            <p class="mb-4 text-gray-600">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div class="flex space-x-4">
              <button
                @click="deleteAccount"
                class="flex-1 bg-red-500 text-white rounded-md py-2 hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                @click="showDeleteConfirm = false"
                class="flex-1 bg-gray-300 text-gray-700 rounded-md py-2 hover:bg-gray-400"
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
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const user = ref(null)
const isEditing = ref(false)
const showDeleteConfirm = ref(false)
const errorMessage = ref('')

const editForm = ref({
  name: '',
  email: ''
})

onMounted(async () => {
  user.value = authStore.user
  editForm.value = {
    name: user.value?.name || '',
    email: user.value?.email || ''
  }
})

const startEditing = () => {
  isEditing.value = true
  editForm.value = {
    name: user.value?.name || '',
    email: user.value?.email || ''
  }
}

const cancelEditing = () => {
  isEditing.value = false
  errorMessage.value = ''
}

const updateProfile = async () => {
  try {
    const response = await axios.put(
      'http://localhost:8000/api/users',
      editForm.value,
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        }
      }
    )
    
    authStore.setUser(response.data)
    user.value = response.data
    isEditing.value = false
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to update profile'
  }
}

const deleteAccount = async () => {
  try {
    await axios.delete('http://localhost:8000/api/users', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    
    authStore.logout()
    router.push({ name: 'login' })
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to delete account'
    showDeleteConfirm.value = false
  }
}
</script>
