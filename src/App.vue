<template>
  <!-- Navbar (tidak muncul di halaman login & register) -->
  <nav v-if="!hideNavAndFooter" class="bg-white p-4 px-8 flex items-center shadow-lg relative">
    <!-- Logo -->
    <RouterLink to="/" class="text-logo text-lg font-thin flex items-center">
      <img src="/src/assets/logoipbi.jpg" alt="Logo" class="h-10 w-auto mr-3">
      <span class="hidden lg:inline">Ikatan Perangkai Bunga Indonesia</span> <!-- Teks disembunyikan di perangkat kecil -->
    </RouterLink>

    <!-- Hamburger Menu untuk perangkat kecil -->
    <div class="ml-auto lg:hidden flex items-center">
      <button @click.stop="toggleMenu" class="text-3xl focus:outline-none">
        &#9776; <!-- Tiga garis -->
      </button>
    </div>

    <!-- Menu Links (Dropdown untuk perangkat kecil) -->
    <div class="ml-8 flex space-x-6 lg:flex hidden">
      <RouterLink to="/" class="nav-link">Home</RouterLink>
      <RouterLink to="/Profile" class="nav-link">Profile</RouterLink>
    </div>

    <!-- Dropdown menu untuk perangkat kecil -->
    <div 
      v-if="menuOpen" 
      class="dropdown lg:hidden absolute top-16 right-8 bg-white shadow-lg py-2 px-4 rounded-md z-50"
      @click.stop
    >
      <RouterLink to="/" class="block dropdown-item">Home</RouterLink>
      <RouterLink to="/Profile" class="block dropdown-item">Profile</RouterLink>

      <!-- Menampilkan Login/Register jika belum login, Logout jika sudah login -->
      <RouterLink v-if="!authStore.isLoggedIn" to="/login" class="block dropdown-item">Login</RouterLink>
      <RouterLink v-if="!authStore.isLoggedIn" to="/register" class="block dropdown-item">Register</RouterLink>

      <button v-if="authStore.isLoggedIn" @click="logout" class="block dropdown-item">Logout</button>
    </div>

    <!-- Jika belum login, tampilkan Login/Register -->
    <div v-if="!authStore.isLoggedIn" class="ml-auto flex space-x-4 lg:flex hidden">
      <RouterLink to="/login" class="nav-link">Login</RouterLink>
      <RouterLink to="/register" class="nav-link">Register</RouterLink>
    </div>

    <!-- Jika sudah login, tampilkan Logout -->
    <button v-else @click="logout" class="ml-auto flex space-x-4 lg:flex hidden">
      Logout
    </button>
  </nav>

  <!-- Main content -->
  <div class="">
    <RouterView />
  </div>

  <!-- Footer (tidak muncul di halaman login & register) -->
  <footer v-if="!hideNavAndFooter" class="bg-white text-black py-4 px-8 text-center bottom-0 left-0 w-full shadow-lg">
    <p class="text-sm">&copy; 2025 Ikatan Perangkai Bunga Indonesia. All rights reserved.</p>
    <div class="mt-2">
      <a href="#" class="footer-link">Privacy Policy</a> |
      <a href="#" class="footer-link">Terms of Service</a> |
      <a href="#" class="footer-link">Contact</a>
    </div>
  </footer>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { computed, ref, onMounted, onUnmounted } from "vue";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const hideNavAndFooter = computed(() => {
  return route.path === "/login" || route.path === "/register";
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
  background: linear-gradient(to right, #ffffff, #f2f2f2); /* Gradasi dari putih ke abu-abu terang */
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
}

/* Tambahkan padding dan tekstur */
footer p {
  color: #333333;
}

footer a {
  color: #007bff;
  transition: color 0.3s ease;
}

footer a:hover {
  color: #0056b3;
}
</style>
