<template>
    <div class="bg-gray-50">
      <!-- Full Screen Video Section -->
      <div class="komponenpidio w-screen h-screen overflow-hidden relative">
        <video
          class="top-0 left-0 w-full h-full object-cover"
          autoplay
          loop
          muted
          playsinline
        >
          <source src="/src/assets/ipbibackground.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
  
      <!-- Content Section -->
      <div class="container mx-auto py-12 px-6">
        <h1 class="text-4xl font-semibold text-center mt-8 text-gray-800">Selamat Datang di IPBI</h1>
  
        <!-- Product Grid -->
        
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from "axios";
  import { ref, onMounted } from "vue";
  
  
  
  </script>
  
  <style scoped>
  video {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1; /* Membuat video di belakang elemen lain */
}

.komponenpidio {
  position: relative;
  z-index: 0; /* Memastikan video muncul di belakang konten */
}

.navbar {
  position: relative;
  z-index: 100; /* Memastikan navbar muncul di atas video */
}

.dropdown-menu {
  position: absolute;
  z-index: 200; /* Dropdown lebih tinggi dari navbar */
}

.komponenpidio {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.komponenpidio video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Default: agar video memenuhi layar */
  transform: translate(-50%, -50%);
}

/* Jika di HP, gunakan object-fit: contain agar video tidak terpotong */
@media (max-width: 768px) {
  .komponenpidio video {
    object-fit: contain;
  }
}




  </style>
  