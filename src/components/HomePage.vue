<template>
  <div class="relative">
    <!-- Video Background -->
    <div class="video-container">
      <video autoplay loop muted playsinline class="video-bg">
        <source src="/src/assets/videohomepage.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Hero Section -->
    <div class="hero-content">
      <h1 class="hero-title animate__animated animate__fadeInDown animate__delay-1s">
        Selamat Datang di IPBI
      </h1>
      <p class="hero-subtitle animate__animated animate__fadeInUp animate__delay-2s">
        Ikatan Perangkai Bunga Indonesia
      </p>
    </div>

    <!-- Sections -->
    <section class="content-section bg-white">
      <div class="container mx-auto py-20 px-6 text-center">
        <h2 class="section-title">Tentang Kami</h2>
        <p class="section-text animate__animated animate__fadeInUp animate__delay-1s">
          Ikatan Perangkai Bunga Indonesia (IPBI) adalah organisasi profesi yang menaungi para perangkai,
          pecinta, pehobi, pengusaha, dan pegiat bunga di Indonesia sejak tahun 1988. Selain itu, kami juga
          menawarkan hosting VPS termurah untuk mendukung kebutuhan digital komunitas Anda.
        </p>
      </div>
    </section>

    <!-- Tahun Berdiri IPBI Section -->
    <section class="content-section bg-gradient-to-br from-gray-100 to-emerald-50">
      <div class="container mx-auto py-20 px-6 text-center">
        <h2 class="section-title text-emerald-800">Tahun Berdirinya IPBI</h2>
        <div class="flex justify-center mt-8">
          <span class="year-counter animate__animated animate__zoomIn animate__delay-1s" id="yearCount">1988</span>
        </div>
        <p class="section-text animate__animated animate__fadeInUp animate__delay-2s">
          IPBI telah berdiri sejak tahun 1988, dan perjalanan kami terus berkembang setiap tahunnya.
        </p>
      </div>
    </section>

    <section class="content-section bg-white">
      <div class="container mx-auto py-20 px-6 text-center">
        <h2 class="section-title">Ikuti Uji Kompetensi Kami</h2>
        <p class="section-text animate__animated animate__fadeInUp animate__delay-1s">
          Registrasi akun anda dan mulai ikut Uji Kompetensi kami!
        </p>
        <RouterLink 
          to="/uji-kompetensi" 
          class="cta-button animate__animated animate__fadeInUp animate__delay-2s"
        >
          Mulai Sekarang
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Video Container */
.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
}

.video-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease-out;
}

.video-container:hover .video-bg {
  transform: scale(1.05);
}

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center; /* Center-align text */
}

/* Hero Title Styling (Inspired by xAI Grok) */
.hero-title {
  font-size: clamp(2.5rem, 8vw, 7rem);
  font-weight: 900;
  color: #2d6a4f; /* Deep emerald green */
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1.1;
  background: linear-gradient(135deg, #2d6a4f 0%, #34d399 100%);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(45, 106, 79, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-title:hover {
  transform: scale(1.05) translateY(-10px);
  text-shadow: 0 8px 30px rgba(45, 106, 79, 0.5), 0 0 40px rgba(52, 211, 153, 0.3);
  background: linear-gradient(135deg, #34d399 0%, #2d6a4f 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(1.25rem, 3vw, 2.5rem);
  font-weight: 700;
  color: #1f4d2b; /* Darker green */
  margin-top: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 2px 15px rgba(31, 77, 43, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-subtitle:hover {
  transform: scale(1.03) translateY(-5px);
  color: #34d399;
  text-shadow: 0 4px 20px rgba(52, 211, 153, 0.4);
}

/* Sections */
.content-section {
  padding: 6rem 1rem;
  position: relative;
  overflow: hidden;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d6a4f;
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: #2d6a4f;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.section-title:hover::after {
  width: 100px;
}

.section-text {
  font-size: 1.25rem;
  color: #4a4a4a;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
}

/* Year Counter */
.year-counter {
  font-size: clamp(4rem, 12vw, 6rem);
  font-weight: 800;
  background: linear-gradient(45deg, #1f4d2b, #34d399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: transform 0.3s ease;
}

.year-counter:hover {
  transform: scale(1.05);
}

/* CTA Button */
.cta-button {
  display: inline-block;
  margin-top: 2rem;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #2d6a4f, #34d399);
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  border-radius: 50px;
  box-shadow: 0 8px 25px rgba(45, 106, 79, 0.2);
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(45, 106, 79, 0.3);
  background: linear-gradient(135deg, #34d399, #2d6a4f);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: clamp(2rem, 10vw, 4rem);
  }
  
  .hero-subtitle {
    font-size: clamp(1rem, 4vw, 1.75rem);
  }
  
  .year-counter {
    font-size: clamp(3rem, 10vw, 4rem);
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-text {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: clamp(1.75rem, 12vw, 3rem);
  }
  
  .hero-subtitle {
    font-size: clamp(0.875rem, 5vw, 1.5rem);
  }
  
  .cta-button {
    padding: 0.75rem 2rem;
    font-size: 1rem;
  }
}

/* Animations */
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
</style>

<script>
export default {
  name: 'HomePage'
}
</script>