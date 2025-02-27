<template>
    <div class="admin-dashboard flex min-h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside
        :class="[
          'sidebar bg-emerald-900 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-30',
          { '-translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen },
          'lg:static lg:translate-x-0'
        ]"
      >
        <!-- Logo -->
        <div class="flex items-center justify-center">
          <img src="/src/assets/logoipbi.jpg" alt="Logo" class="h-12 w-auto" />
          <span class="ml-3 text-lg font-bold hidden lg:inline">Admin IPBI</span>
        </div>
  
        <!-- Navigation -->
        <nav class="space-y-2">
          <RouterLink
            to="/admin"
            class="nav-item"
            active-class="bg-emerald-700"
          >
            <i class="fas fa-tachometer-alt mr-3"></i> Dashboard
          </RouterLink>
          <RouterLink
            to="/admin/userlist"
            class="nav-item"
            active-class="bg-emerald-700"
          >
            <i class="fas fa-users mr-3"></i> User Details
          </RouterLink>
          <RouterLink
            to="/admin/settings"
            class="nav-item"
            active-class="bg-emerald-700"
          >
            <i class="fas fa-cog mr-3"></i> Settings
          </RouterLink>
        </nav>
      </aside>
  
      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        
        <!-- Header -->
        <header
          class="header bg-white shadow-md p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-20 lg:pl-64"
        >
          <button
            @click="toggleSidebar"
            class="text-2xl lg:hidden focus:outline-none text-emerald-700"
          >
            <i :class="isSidebarOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
          </button>
          <h1 class="text-xl font-semibold text-emerald-900">Admin Dashboard</h1>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">Welcome, Admin</span>
            <button
              @click="logout"
              class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </header>
  
        <!-- Content Area -->
        <main class="flex-1 p-6 mt-16 bg-gray-100">
          <div class="container mx-auto">
            <RouterView />
          </div>
        </main>
      </div>
  
      <!-- Overlay for mobile sidebar -->
      <div
        v-if="isSidebarOpen"
        @click="toggleSidebar"
        class="fixed inset-0 bg-black opacity-50 lg:hidden z-20"
      ></div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "@/stores/auth";
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const isSidebarOpen = ref(false);
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  
  const logout = () => {
    authStore.logout();
    router.push({ name: "home" });
  };
  </script>
  
  <style scoped>
  .admin-dashboard {
    overflow-x: hidden;
  }
  
  /* Sidebar */
  .sidebar {
    background: linear-gradient(180deg, #1f4d2b, #2d6a4f);
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
    color: #d4f4dd;
  }
  
  .nav-item:hover {
    background-color: #34d399;
    color: #1f4d2b;
  }
  
  .nav-item i {
    width: 1.5rem;
    text-align: center;
  }
  
  /* Header */
  .header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }
  
  /* Main Content */
  main {
    min-height: calc(100vh - 4rem);
  }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .sidebar {
      width: 250px;
    }
  }
  
  @media (min-width: 1024px) {
    .header {
      left: 16rem; /* Sesuaikan dengan lebar sidebar (w-64 = 16rem) */
    }
  }
  </style>