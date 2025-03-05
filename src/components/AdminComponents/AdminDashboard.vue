<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-emerald-900 to-emerald-950 text-white transform transition-all duration-500 ease-in-out z-50 shadow-2xl',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:w-72'
      ]"
    >
      <div class="p-6">
        <div class="flex items-center justify-between mb-12">
          <div class="flex items-center group">
            <img
              src="/src/assets/logoipbi.jpg"
              alt="Logo"
              class="h-14 w-auto transition-transform duration-300 group-hover:scale-110 animate-glow"
            />
            <span
              class="ml-4 text-2xl font-bold tracking-wide text-white drop-shadow-md group-hover:text-emerald-300 transition-colors duration-300"
            >
              Admin IPBI
            </span>
          </div>
          <button class="lg:hidden text-white focus:outline-none" @click="toggleSidebar">
            <i
              :class="isSidebarOpen ? 'fas fa-times' : 'fas fa-bars'"
              class="text-2xl transition-transform duration-300 hover:rotate-90"
            ></i>
          </button>
        </div>
        <nav class="space-y-4">
          <router-link
            to="/admin"
            class="flex items-center p-4 rounded-xl bg-opacity-20 hover:bg-emerald-700 hover:bg-opacity-70 hover:shadow-lg transition-all duration-300 group"
            active-class="bg-emerald-800 shadow-inner"
          >
            <i class="fas fa-users mr-3 text-lg group-hover:text-emerald-300 transition-colors duration-300"></i>
            <span class="font-medium group-hover:ml-1 transition-all duration-300">Daftar Pengguna</span>
          </router-link>
          <router-link
            to="/admin/settings"
            class="flex items-center p-4 rounded-xl bg-opacity-20 hover:bg-emerald-700 hover:bg-opacity-70 hover:shadow-lg transition-all duration-300 group"
            active-class="bg-emerald-800 shadow-inner"
          >
            <i class="fas fa-cog mr-3 text-lg group-hover:text-emerald-300 transition-colors duration-300"></i>
            <span class="font-medium group-hover:ml-1 transition-all duration-300">Pengaturan</span>
          </router-link>
          <button
            @click="logout"
            class="w-full text-left flex items-center p-4 rounded-xl bg-opacity-20 hover:bg-red-700 hover:bg-opacity-70 hover:shadow-lg transition-all duration-300 group"
          >
            <i class="fas fa-sign-out-alt mr-3 text-lg group-hover:text-red-300 transition-colors duration-300"></i>
            <span class="font-medium group-hover:ml-1 transition-all duration-300">Keluar</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Overlay for Mobile -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-gray-900 opacity-60 lg:hidden z-40 transition-opacity duration-300"
      @click="toggleSidebar"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 p-6 lg:ml-72 bg-gradient-to-br from-gray-100 to-emerald-50 overflow-y-auto">
      <div class="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
        <div class="flex justify-between items-center mb-6 lg:hidden">
          <h1 class="text-3xl font-extrabold text-emerald-900 animate__animated animate__fadeInDown">
            Dashboard Admin
          </h1>
          <button class="text-emerald-900 focus:outline-none" @click="toggleSidebar">
            <i class="fas fa-bars text-2xl hover:text-emerald-600 transition-colors duration-300"></i>
          </button>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import 'animate.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const router = useRouter();
const authStore = useAuthStore();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const logout = () => {
  authStore.logout();
  router.push({ name: 'home' });
  isSidebarOpen.value = false;
};
</script>

<style scoped>
@keyframes glow {
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(52, 211, 153, 0.8));
  }
}

.animate-glow {
  animation: glow 2s infinite ease-in-out;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #34d399;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #2ea37d;
}
</style>