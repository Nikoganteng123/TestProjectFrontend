<template>
  <div id="app">
    <!-- Navbar -->
    <nav 
      v-if="!hideNavAndFooter" 
      class="navbar bg-white shadow-lg transition-all duration-500 ease-in-out"
    >
      <div class="container mx-auto px-6 flex items-center justify-between">
        <!-- Logo -->
        <RouterLink 
          to="/" 
          class="logo-link flex items-center transition-all duration-300 ease-in-out hover:scale-105"
        >
          <img src="/src/assets/logoipbi.jpg" alt="Logo" class="h-12 w-auto">
          <span class="logo-text hidden lg:inline">Ikatan Perangkai Bunga Indonesia</span>
        </RouterLink>

        <!-- Hamburger Menu -->
        <button 
          @click.stop="toggleMenu" 
          class="lg:hidden text-3xl focus:outline-none transition-all duration-300 hover:text-emerald-600"
        >
          <span class="hamburger-icon">☰</span>
        </button>

        <!-- Desktop Menu -->
        <div class="hidden lg:flex items-center space-x-8">
          <RouterLink to="/" class="nav-link">Home</RouterLink>
          <RouterLink to="/uji-kompetensi" class="nav-link">Uji Kompetensi</RouterLink>
          
          <!-- Auth Links -->
          <template v-if="!authStore.isLoggedIn">
            <RouterLink to="/login" class="nav-link">Login</RouterLink>
            <RouterLink to="/register" class="auth-button">Register</RouterLink>
          </template>
          <template v-else>
            <RouterLink to="/users" class="nav-link">Profile</RouterLink>
            <button @click="logout" class="auth-button logout">Logout</button>
          </template>
        </div>
      </div>

      <!-- Mobile Dropdown -->
      <div 
        v-if="menuOpen" 
        class="dropdown lg:hidden animate__animated animate__fadeInDown animate__faster"
      >
        <RouterLink to="/" class="dropdown-item" @click="toggleMenu">Home</RouterLink>
        <RouterLink to="/uji-kompetensi" class="dropdown-item" @click="toggleMenu">Uji Kompetensi</RouterLink>
        <RouterLink to="/users" class="dropdown-item" v-if="authStore.isLoggedIn" @click="toggleMenu">Profile</RouterLink>
        <RouterLink to="/login" class="dropdown-item" v-if="!authStore.isLoggedIn" @click="toggleMenu">Login</RouterLink>
        <RouterLink to="/register" class="dropdown-item" v-if="!authStore.isLoggedIn" @click="toggleMenu">Register</RouterLink>
        <button v-if="authStore.isLoggedIn" @click="logout" class="dropdown-item logout">Logout</button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="content-wrapper">
      <RouterView />
    </div>

    <!-- Footer -->
    <footer 
      v-if="!hideNavAndFooter" 
      class="footer bg-gradient-to-r from-emerald-900 to-teal-800 text-white shadow-lg transition-all duration-500 ease-in-out"
    >
      <div class="container mx-auto px-6 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm mb-4 md:mb-0">© 2025 Ikatan Perangkai Bunga Indonesia. All rights reserved.</p>
          <div class="flex space-x-6">
            <a href="#" class="footer-link">Privacy Policy</a>
            <a href="#" class="footer-link">Terms of Service</a>
            <a href="#" class="footer-link">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { computed, ref, onMounted, onUnmounted } from "vue";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const hideNavAndFooter = computed(() => {
  return route.path === "/login" || route.path === "/register" || 
         route.path === "/forgot-password" || route.path === "/reset-password";
});

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = (event) => {
  if (!event.target.closest(".dropdown") && !event.target.closest(".hamburger-icon")) {
    menuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeMenu);
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});

const logout = () => {
  authStore.logout();
  router.push({ name: "home" });
  menuOpen.value = false;
};
</script>

<style scoped>
/* App Container */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-wrapper {
  flex-grow: 1;
}

/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 1rem 0;
  background: rgba(255, 255, 255, 0.95);
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo-text {
  color: #2d6a4f;
  font-weight: 600;
  font-size: 1.25rem;
  margin-left: 1rem;
}

.nav-link {
  color: #2d6a4f;
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
  padding-bottom: 0.25rem;
  transition: all 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #34d399;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover {
  color: #34d399;
}

.nav-link:hover::after {
  width: 100%;
}

.auth-button {
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.auth-button:not(.logout) {
  background: linear-gradient(135deg, #2d6a4f, #34d399);
  color: white;
}

.auth-button:not(.logout):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(45, 106, 79, 0.2);
}

.logout {
  background: none;
  color: #ef4444;
}

.logout:hover {
  color: #dc2626;
}

/* Dropdown */
.dropdown {
  position: absolute;
  top: 100%;
  right: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  width: 200px;
  z-index: 200;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #2d6a4f;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: #f0fdf4;
  color: #34d399;
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* Footer */
.footer {
  background: linear-gradient(135deg, #1f4d2b, #2d6a4f);
}

.footer-link {
  color: #d4f4dd;
  font-size: 0.9rem;
  position: relative;
  padding-bottom: 0.25rem;
  transition: all 0.3s ease;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1px;
  background: #34d399;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.footer-link:hover {
  color: #34d399;
}

.footer-link:hover::after {
  width: 100%;
}

/* Animations */
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');

/* Responsive */
@media (max-width: 1024px) {
  .logo-text {
    display: none;
  }
}
</style>