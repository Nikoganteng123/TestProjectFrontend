<template>
  <div class="relative">
    <!-- Video Background -->
    <div class="video-container">
      <video autoplay loop muted playsinline>
        <source src="/src/assets/videohomepage.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Hero Section -->
    <div class="hero-content">
      <h1 class="text-8xl font-bold text-green- text-center">Selamat Datang di IPBI</h1>
      <p class="text-3xl text-black mt-4 text-center">Komunitas Perangkai Bunga Indonesia</p>
    </div>

    <!-- Sections -->
    <section class="content-section bg-white">
      <div class="container mx-auto py-16 text-center">
        <h2 class="text-3xl font-semibold">Tentang Kami</h2>
        <p class="text-lg mt-4">
          Ikatan Perangkai Bunga Indonesia (IPBI) adalah organisasi profesi yang menaungi para perangkai,
          pecinta, pehobi, pengusaha, dan pegiat bunga di Indonesia sejak tahun 1988. Selain itu, kami juga
          menawarkan hosting VPS termurah untuk mendukung kebutuhan digital komunitas Anda.
        </p>
      </div>
    </section>

    <!-- Tahun Berdiri IPBI Section -->
    <section class="content-section bg-gray-200">
      <div class="container mx-auto py-16 text-center">
        <h2 class="text-3xl font-semibold text-green-900">Tahun Berdirinya IPBI</h2>
        <div class="flex justify-center mt-6">
          <span class="text-8xl font-bold text-green-900" id="yearCount">1988</span>
        </div>
        <p class="text-lg mt-4">
          IPBI telah berdiri sejak tahun 1988, dan perjalanan kami terus berkembang setiap tahunnya.
        </p>
      </div>
    </section>

    <section class="content-section bg-gray-100">
      <div class="container mx-auto py-16 text-center">
        <h2 class="text-3xl font-semibold">Ikuti Uji Kompetensi Kami</h2>
        <p class="text-lg mt-4">Registrasi akun anda dan mulai ikut Uji Kompetensi kami!</p>
        
        <!-- Tombol Elegan -->
        <RouterLink to="/uji-kompetensi" class="nav-link mt-6 inline-block bg-green-600 text-white text-lg font-medium px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:bg-green-700 hover:shadow-lg hover:-translate-y-1">
          Mulai Sekarang
        </RouterLink>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* Video Container */
.video-container {
  position: absolute; /* Agar video ikut naik saat scroll */
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; /* Tinggi video tetap memenuhi layar */
  overflow: hidden;
  z-index: -1; /* Pastikan tetap di belakang elemen lain */
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(10px); /* Efek blur pada video */
  pointer-events: none; /* Cegah interaksi dengan video */
}

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 10;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

/* Sections */
.content-section {
  padding: 6rem 2rem;
  text-align: center;
}

/* Tahun Berdiri IPBI Section */
#yearCount {
  font-size: 8rem;
  color: #1f4d2b;
  font-weight: bold;
}
</style>

<script>
  
</script>
