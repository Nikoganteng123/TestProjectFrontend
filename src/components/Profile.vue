<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 relative overflow-hidden">
    <!-- Decorative Elements -->
    <div class="flower-1"></div>
    <div class="flower-2"></div>
    <div class="flower-3"></div>

    <!-- Main Content -->
    <div class="max-w-3xl mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative z-10 flex items-center justify-center min-h-[calc(100vh-6rem)]">
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl w-full">
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-600 to-teal-500 px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="bg-white/20 p-3 rounded-full transition-all duration-300 hover:bg-white/30">
                <span class="text-2xl text-white">👤</span>
              </div>
              <h1 class="text-3xl font-bold text-white tracking-tight">Profile Settings</h1>
            </div>
            <button
              v-if="!isEditing"
              @click="startEditing"
              class="flex items-center space-x-2 bg-white/20 text-white px-5 py-2 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <span class="text-lg">✏️</span>
              <span class="font-medium">Edit Profile</span>
            </button>
          </div>
        </div>

        <div class="p-8">
          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-8">
            <p class="text-gray-600 text-lg">Loading profile...</p>
          </div>

          <!-- Display Mode -->
          <div v-else-if="!isEditing" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-emerald-50 p-6 rounded-2xl transition-all duration-300 hover:bg-emerald-100 hover:shadow-lg">
                <p class="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Name</p>
                <p class="mt-2 text-xl font-medium text-gray-900">{{ user?.name || 'Not set' }}</p>
              </div>
              <div class="bg-emerald-50 p-6 rounded-2xl transition-all duration-300 hover:bg-emerald-100 hover:shadow-lg">
                <p class="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Email</p>
                <p class="mt-2 text-xl font-medium text-gray-900">{{ user?.email || 'Not set' }}</p>
              </div>
            </div>

            <!-- Uji Kompetensi Section -->
            <div class="pt-6 border-t border-emerald-100">
              <h2 class="text-xl font-semibold text-emerald-700 mb-4">Data Pemetaan Guru</h2>
              <div class="bg-emerald-50 p-6 rounded-2xl space-y-4">
                <div>
                  <p class="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                    {{ user?.is_verified ? 'Nilai Final' : 'Nilai Sementara' }}
                  </p>
                  <p class="mt-2 text-xl font-medium text-gray-900">
                    {{ user?.nilai > 0 ? user.nilai : '-' }}
                  </p>
                  <p v-if="user?.is_verified" class="mt-2 text-sm text-emerald-600">
                    Nilai sudah diverifikasi oleh pihak IPBI
                  </p>
                </div>
              </div>
            </div>

            <div class="pt-6 border-t border-emerald-100">
              <button
                @click="showDeleteConfirm = true"
                class="text-red-600 font-semibold hover:text-red-700 transition-all duration-300 hover:underline"
              >
                Delete Account
              </button>
            </div>
          </div>

          <!-- Edit Mode -->
          <form v-else @submit.prevent="updateProfile" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Name</label>
                <input
                  type="text"
                  v-model="editForm.name"
                  class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  v-model="editForm.email"
                  class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div class="flex space-x-4">
              <button
                type="submit"
                class="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-all duration-300 hover:shadow-md"
              >
                Save Changes
              </button>
              <button
                type="button"
                @click="cancelEditing"
                class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-all duration-300 hover:shadow-md"
              >
                Cancel
              </button>
            </div>
          </form>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 rounded-lg">
            <p class="text-sm font-medium text-red-600">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white rounded-3xl max-w-md mx-4 p-8 shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Confirm Deletion</h3>
          <button
            @click="showDeleteConfirm = false"
            class="text-gray-500 hover:text-gray-700 transition-all duration-300"
          >
            ❌
          </button>
        </div>
        <p class="text-gray-600 mb-8 leading-relaxed">
          Are you sure you want to delete your account? This action is permanent and cannot be reversed.
        </p>
        <div class="flex space-x-4">
          <button
            @click="deleteAccount"
            class="flex-1 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-all duration-300"
          >
            Delete Account
          </button>
          <button
            @click="showDeleteConfirm = false"
            class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const router = useRouter();
const authStore = useAuthStore();
const user = ref(null);
const isEditing = ref(false);
const showDeleteConfirm = ref(false);
const errorMessage = ref('');
const isLoading = ref(true);

const editForm = ref({
  name: '',
  email: ''
});

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:8000/api/profile', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    });
    console.log('Data dari API:', response.data);
    user.value = response.data;
    authStore.setUser(response.data);
    editForm.value = {
      name: user.value?.name || '',
      email: user.value?.email || ''
    };
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to load profile';
    console.error('Error fetching profile:', error);
  } finally {
    isLoading.value = false;
  }
});

const startEditing = () => {
  isEditing.value = true;
  editForm.value = {
    name: user.value?.name || '',
    email: user.value?.email || ''
  };
};

const cancelEditing = () => {
  isEditing.value = false;
  errorMessage.value = '';
};

const updateProfile = async () => {
  try {
    const response = await axios.post(
      'http://localhost:8000/api/updateprofile',
      editForm.value,
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        }
      }
    );

    authStore.setUser(response.data);
    user.value = response.data;
    isEditing.value = false;
    errorMessage.value = '';
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to update profile';
    console.error('Error updating profile:', error);
  }
};

const deleteAccount = async () => {
  try {
    await axios.delete('http://localhost:8000/api/profile', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    });

    authStore.logout();
    router.push({ name: 'login' });
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to delete account';
    showDeleteConfirm.value = false;
    console.error('Error deleting account:', error);
  }
};
</script>

<style scoped>
.flower-1,
.flower-2,
.flower-3 {
  @apply absolute w-72 h-72 rounded-full opacity-10;
  background: radial-gradient(circle, #34d399 0%, transparent 70%);
}

.flower-1 {
  top: -4rem;
  right: 15%;
  animation: float 7s ease-in-out infinite;
}

.flower-2 {
  bottom: 15%;
  left: -4rem;
  animation: float 8s ease-in-out infinite 1s;
}

.flower-3 {
  bottom: -4rem;
  right: 25%;
  animation: float 9s ease-in-out infinite 2s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-25px) scale(1.05);
  }
}

.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.transition-all {
  transition: all 0.3s ease-in-out;
}
</style>