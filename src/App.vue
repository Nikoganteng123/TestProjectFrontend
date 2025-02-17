<template>
  <div id="app">
    <!-- Navbar (tidak muncul di halaman login & register) -->
    <nav v-if="!hideNavAndFooter" class="bg-white p-4 px-8 flex items-center shadow-lg relative transition-all duration-500 ease-in-out">
      <!-- Logo -->
      <RouterLink to="/" class="text-logo text-lg font-thin flex items-center transition-all duration-300 ease-in-out transform hover:scale-105">
        <img src="/src/assets/logoipbi.jpg" alt="Logo" class="h-10 w-auto mr-3">
        <span class="hidden lg:inline">Ikatan Perangkai Bunga Indonesia</span> <!-- Teks disembunyikan di perangkat kecil -->
      </RouterLink>

      <!-- Hamburger Menu untuk perangkat kecil -->
      <div class="ml-auto lg:hidden flex items-center">
        <button @click.stop="toggleMenu" class="text-3xl focus:outline-none hover:text-green-600 transition-all duration-300">
          &#9776; <!-- Tiga garis -->
        </button>
      </div>

      <!-- Menu Links (Dropdown untuk perangkat kecil) -->
      <div class="ml-8 flex space-x-6 lg:flex hidden">
        <RouterLink to="/" class="nav-link transition-all duration-300 ease-in-out transform hover:scale-105">Home</RouterLink>
        <RouterLink to="/uji-kompetensi" class="nav-link transition-all duration-300 ease-in-out transform hover:scale-105">Uji Kompetensi</RouterLink>
      </div>

      <!-- Dropdown menu untuk perangkat kecil -->
      <div 
        v-if="menuOpen" 
        class="dropdown lg:hidden absolute top-16 right-8 bg-white shadow-lg py-2 px-4 rounded-md z-50"
        @click.stop
      >
        <RouterLink to="/" class="block dropdown-item transition-all duration-300 ease-in-out hover:bg-green-100">Home</RouterLink>
        <RouterLink to="/uji-kompetensi" class="block dropdown-item transition-all duration-300 ease-in-out hover:bg-green-100">Uji Kompetensi</RouterLink>
        <RouterLink to="/users" class="block dropdown-item flex items-center transition-all duration-300 ease-in-out hover:bg-green-100">
          Profile
        </RouterLink>
        <!-- Menampilkan Login/Register jika belum login, Logout jika sudah login -->
        <RouterLink v-if="!authStore.isLoggedIn" to="/login" class="block dropdown-item transition-all duration-300 ease-in-out hover:bg-green-100">Login</RouterLink>
        <RouterLink v-if="!authStore.isLoggedIn" to="/register" class="block dropdown-item transition-all duration-300 ease-in-out hover:bg-green-100">Register</RouterLink>

        <button v-if="authStore.isLoggedIn" @click="logout" class="block dropdown-item transition-all duration-300 ease-in-out hover:bg-green-100">Logout</button>
      </div>

      <!-- Jika belum login, tampilkan Login/Register -->
      <div v-if="!authStore.isLoggedIn" class="ml-auto flex space-x-4 lg:flex hidden">
        <RouterLink to="/login" class="nav-link transition-all duration-300 ease-in-out transform hover:scale-105">Login</RouterLink>
        <RouterLink to="/register" class="nav-link transition-all duration-300 ease-in-out transform hover:scale-105">Register</RouterLink>
      </div>

      <!-- Jika sudah login, tampilkan Logout dan Profile di sebelahnya -->
      <div v-else class="ml-auto flex items-center space-x-4 lg:flex hidden">
        <button @click="logout" class="nav-link transition-all duration-300 ease-in-out transform hover:scale-105">Logout</button>
      </div>
    </nav>

    <!-- Main content wrapper, to push footer to the bottom -->
    <div class="content-wrapper">
      <RouterView />
    </div>

    <!-- Footer (tidak muncul di halaman login & register) -->
    <footer v-if="!hideNavAndFooter" class="bg-white text-white py-4 px-8 text-center bottom-0 left-0 w-full shadow-lg transition-all duration-500 ease-in-out transform hover:scale-105">
      <p class="text-sm">&copy; 2025 Ikatan Perangkai Bunga Indonesia. All rights reserved.</p>
      <div class="mt-2">
        <a href="#" class="footer-link transition-all duration-300 ease-in-out transform hover:scale-105">Privacy Policy</a> |
        <a href="#" class="footer-link transition-all duration-300 ease-in-out transform hover:scale-105">Terms of Service</a> |
        <a href="#" class="footer-link transition-all duration-300 ease-in-out transform hover:scale-105">Contact</a>
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
  return route.path === "/login" || route.path === "/register" || route.path === "/forgot-password" || route.path === "/reset-password";
});

const menuOpen = ref(false); // State untuk kontrol dropdown menu

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

// Tutup dropdown jika user mengklik di luar area menu
const closeMenu = (event) => {
  if (!event.target.closest(".dropdown") && !event.target.closest("button")) {
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
};
</script>

<style scoped>
/* Mengatur kontainer utama dengan Flexbox */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Agar konten memenuhi seluruh tinggi layar */
}

/* Membuat konten utama tumbuh dan mengisi ruang yang tersisa */
#app > .content-wrapper {
  flex-grow: 1;
}

/* Gaya untuk link navigasi */
.nav-link {
  color: #178677;
  position: relative;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(to right, #28a745, #8b4513); /* Gradasi dari hijau ke coklat */
  transition: all 0.2s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* Gaya untuk dropdown menu */
.dropdown {
  position: absolute;
  top: 60px;
  right: 20px;
  background: white;
  color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px;
  z-index: 200; /* Pastikan di atas elemen lain */
  display: flex;
  flex-direction: column;
  width: 150px;
}

/* Link di dalam dropdown */
.dropdown-item {
  color: black;
  padding: 10px;
  text-align: center;
  transition: background 0.3s ease;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* Gaya untuk footer link */
.footer-link {
  color: #a3a3a3;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #e5e5e5;
}

/* Gaya untuk logo */
.text-logo {
  color: #178677;
}

/* Mengatur responsivitas */
@media (max-width: 1024px) {
  /* Menyembunyikan menu di perangkat kecil */
  .lg\:hidden {
    display: block;
  }

  /* Menyembunyikan menu utama di perangkat kecil */
  .lg\:flex {
    display: none;
  }

  /* Tampilan dropdown menu */
  .lg\:hidden {
    display: block;
  }
}

/* Gaya untuk footer */
footer {
  background-color: #0a4b0a; /* Ganti dengan warna hijau solid */
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  text-align: center;
  color: #ffffff;
}

footer a {
  color: #007bff;
  transition: color 0.3s ease;
}

footer a:hover {
  color: #0056b3;
}
</style>
