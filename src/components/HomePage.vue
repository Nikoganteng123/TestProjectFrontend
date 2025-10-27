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
        <span class="desktop-title">Selamat Datang di Pemetaan Data</span>
        <span class="mobile-title">PEMETAAN DATA</span>
      </h1>
      <p class="hero-subtitle animate__animated animate__fadeInUp animate__delay-2s desktop-subtitle">
         Guru Perangkai Bunga Indonesia
      </p>
      <p class="mobile-subtitle animate__animated animate__fadeInUp animate__delay-2s">
        Guru Perangkai Bunga Indonesia
      </p>
    </div>

    <!-- Maps Section -->
    <section class="content-section bg-gradient-to-br from-emerald-50 to-white" ref="section0">
      <div class="container mx-auto py-20 px-6">
        <h2 class="section-title text-emerald-800 text-center">Lokasi Guru Perangkai Bunga Indonesia</h2>
        <p class="section-text mb-8 text-center">
          Lihat lokasi domisili guru-guru perangkai bunga dari seluruh Indonesia
        </p>
        
        <div class="bg-white rounded-lg shadow-lg p-4 map-wrapper">
          <div id="map-container" ref="mapContainer" class="map-container">
            <!-- Maps akan dirender di sini -->
            <div v-if="mapLoading" class="flex items-center justify-center h-full">
              <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p class="text-gray-600">Memuat peta...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sections with Scroll Animation -->
    <section class="content-section bg-white" ref="section1">
      <div class="container mx-auto py-20 px-6 text-center">
        <h2 class="section-title">Tentang Kami</h2>
        <p class="section-text">
          Ikatan Perangkai Bunga Indonesia (IPBI) adalah organisasi profesi yang menaungi para perangkai,
          pecinta, pehobi, pengusaha, dan pegiat bunga di Indonesia sejak tahun 1988. Website ini adalah tempat bagi para
          Guru Perangkai Bunga Indonesia untuk melakukan pemetaan data sesuai standa IPBI.
        </p>
      </div>
    </section>

    <section class="content-section bg-gradient-to-br from-gray-100 to-emerald-50" ref="section2">
      <div class="container mx-auto py-20 px-6 text-center">
        <h2 class="section-title text-emerald-800">Tahun Berdirinya IPBI</h2>
        <div class="flex justify-center mt-8">
          <span class="year-counter" id="yearCount">1988</span>
        </div>
        <p class="section-text">
          IPBI telah berdiri sejak tahun 1988, dan perjalanan kami terus berkembang setiap tahunnya.
        </p>
      </div>
    </section>

    <section class="content-section bg-white" ref="section3">
      <div class="container mx-auto py-20 px-6 text-center">
        <h2 class="section-title">Ikuti Pemetaan Data Guru IPBI</h2>
        <p class="section-text">
          Registrasi akun anda dan mulai ikut Pemetaan Data Anda!
        </p>
        <RouterLink 
          to="/uji-kompetensi" 
          class="cta-button"
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
  padding: 1rem;
  text-align: center;
}

/* Hero Title Styling */
.hero-title {
  font-size: clamp(2rem, 6vw, 5rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1.1;
  position: relative;
  color: #2d6a4f;
  cursor: pointer;
  user-select: none;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 4px 15px rgba(45, 106, 79, 0.3); /* Shadow putih ditambahkan */
}

.desktop-title, .mobile-title {
  position: relative;
  display: block;
}

.desktop-title {
  display: block;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 4px 15px rgba(45, 106, 79, 0.3); /* Shadow putih ditambahkan */
}

.mobile-title {
  display: none;
}

/* Shining Animation for Mobile */
@keyframes shine {
  0% { background-position: -200%; }
  100% { background-position: 200%; }
}

/* Subtitles */
.desktop-subtitle {
  display: block;
}

.mobile-subtitle {
  display: none;
}

/* Mobile Specific */
@media (max-width: 768px) {
  .desktop-title {
    display: none;
  }
  
  .mobile-title {
  display: block;
  font-size: clamp(2.5rem, 10vw, 4rem);
  letter-spacing: 0.1rem;
  width: 100%;
  padding: 0 0.5rem;
  color: transparent;
  background: linear-gradient(90deg, 
    #2d6a4f 0%, 
    #34d399 50%, 
    #2d6a4f 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shine 4s linear infinite;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: none; /* Pastikan tidak ada shadow */
}
  
  .desktop-subtitle {
    display: none;
  }
  
  .mobile-subtitle {
    display: block;
    font-size: clamp(0.875rem, 2.5vw, 1.25rem);
    font-weight: 400;
    color: #2d6a4f;
    margin-top: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 10px rgba(31, 77, 43, 0.2);
    max-width: 90%;
  }
  
  .hero-content {
    padding: 1rem;
  }
}

.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 2rem);
  font-weight: 700;
  color: #1f4d2b;
  margin-top: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); /* Shadow putih sedikit */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-subtitle:hover {
  transform: scale(1.03) translateY(-3px);
  color: #34d399;
  text-shadow: 0 3px 15px rgba(52, 211, 153, 0.3);
}

/* Sections */
.content-section {
  padding: 4rem 1rem;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.content-section.visible {
  opacity: 1;
  transform: translateY(0);
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d6a4f;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: #2d6a4f;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.section-title:hover::after {
  width: 80px;
}

.section-text {
  font-size: 1rem;
  color: #4a4a4a;
  max-width: 90%;
  margin: 0 auto;
  line-height: 1.6;
}

/* Year Counter */
.year-counter {
  font-size: clamp(3rem, 10vw, 5rem);
  font-weight: 800;
  background: linear-gradient(45deg, #1f4d2b, #34d399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: all 0.3s ease; /* Transisi untuk efek hover */
  cursor: pointer;
}

.year-counter:hover {
  transform: scale(1.05);
  background: linear-gradient(45deg, #34d399, #1f4d2b); /* Warna berubah */
  -webkit-background-clip: text;
  background-clip: text;
}

/* CTA Button */
.cta-button {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #2d6a4f, #34d399);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  box-shadow: 0 8px 25px rgba(45, 106, 79, 0.2);
  text-decoration: none;
  transition: all 0.3s ease; /* Transisi untuk efek hover */
}

.cta-button:hover {
  transform: translateY(-5px);
  background: linear-gradient(135deg, #34d399, #2d6a4f); /* Warna berubah */
  box-shadow: 0 12px 35px rgba(45, 106, 79, 0.3);
  color: #ffffff;
}

/* Responsive Design */
@media (max-width: 480px) {
  .mobile-title {
    font-size: clamp(2rem, 8vw, 3.5rem);
  }
  
  .mobile-subtitle {
    font-size: clamp(0.75rem, 2vw, 1rem);
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .section-text {
    font-size: 0.9rem;
  }
  
  .year-counter {
    font-size: clamp(2.5rem, 8vw, 4rem);
  }
  
  .cta-button {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}

/* Animations */
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');

/* Custom Marker */
.custom-marker {
  background: transparent;
  border: none;
}

/* Map Wrapper */
.map-wrapper {
  height: 600px;
}

.map-container {
  height: 100%;
  border-radius: 8px;
}

/* Responsive Map */
@media (max-width: 768px) {
  .map-wrapper {
    height: 400px;
  }
}

@media (max-width: 480px) {
  .map-wrapper {
    height: 350px;
  }
}
</style>

<script>
import axios from 'axios';

export default {
  name: 'HomePage',
  data() {
    return {
      mapLoading: false,
      map: null,
      teachers: [],
      markers: []
    };
  },
  mounted() {
    this.handleScrollAnimations();
    window.addEventListener('scroll', this.handleScrollAnimations);
    this.initMap();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScrollAnimations);
  },
  methods: {
    handleScrollAnimations() {
      const sections = [this.$refs.section0, this.$refs.section1, this.$refs.section2, this.$refs.section3];
      
      sections.forEach(section => {
        if (!section) return;
        
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
          section.classList.add('visible');
        } else {
          section.classList.remove('visible');
        }
      });
    },
    async initMap() {
      this.mapLoading = true;
      
      try {
        // Load Leaflet Maps library
        await this.loadLeafletScript();
        
        // Fetch data guru dari API public
        try {
          const response = await axios.get('/api/public/teachers');
          this.teachers = response.data?.data || [];
          console.log('Data guru loaded:', this.teachers.length, 'guru');
        } catch (apiError) {
          console.warn('API endpoint tidak tersedia, menggunakan sample data:', apiError);
          // Fallback sample data
          this.teachers = [
            { name: 'Guru Jakarta', domisili: 'Jakarta, Indonesia' },
            { name: 'Guru Bandung', domisili: 'Bandung, Jawa Barat' },
            { name: 'Guru Surabaya', domisili: 'Surabaya, Jawa Timur' },
            { name: 'Guru Yogyakarta', domisili: 'Yogyakarta, Indonesia' },
            { name: 'Guru Medan', domisili: 'Medan, Sumatera Utara' }
          ];
        }
        
        // Initialize Leaflet map centered di Indonesia
        this.map = L.map(this.$refs.mapContainer).setView([-2.5, 118.0], 5);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors | © IPBI'
        }).addTo(this.map);
        
        // Plot markers untuk setiap guru
        this.plotTeachersOnMap();
        
      } catch (error) {
        console.error('Error initializing map:', error);
        this.$refs.mapContainer.innerHTML = '<div class="flex items-center justify-center h-full text-red-600 p-4 text-center">Gagal memuat peta. Silakan refresh halaman.</div>';
      } finally {
        this.mapLoading = false;
      }
    },
    async plotTeachersOnMap() {
      // Group teachers by city untuk clustering
      const cityGroups = {};
      
      this.teachers.forEach(teacher => {
        if (!teacher.domisili) return;
        
        const city = teacher.domisili.split(',')[0] || teacher.domisili;
        if (!cityGroups[city]) {
          cityGroups[city] = [];
        }
        cityGroups[city].push(teacher);
      });
      
      // Geocode setiap kota dan tambahkan marker
      for (const city of Object.keys(cityGroups)) {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ', Indonesia')}&format=json&limit=1`);
          const data = await response.json();
          
          if (data && data[0]) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            const teachers = cityGroups[city];
            
            // Create custom icon with number
            const customIcon = L.divIcon({
              className: 'custom-marker',
              html: `<div style="background-color: #34d399; border: 2px solid #1f4d2b; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${teachers.length}</div>`,
              iconSize: [35, 35],
              iconAnchor: [17.5, 17.5]
            });
            
            // Add marker
            const marker = L.marker([lat, lon], { icon: customIcon }).addTo(this.map);
            
            // Create popup content
            const popupContent = this.createPopupContent(city, teachers);
            marker.bindPopup(popupContent);
            
            this.markers.push(marker);
          }
        } catch (error) {
          console.error(`Error geocoding ${city}:`, error);
        }
      }
    },
    createPopupContent(city, teachers) {
      let html = `<div style="padding: 8px; max-width: 280px;">`;
      html += `<h3 style="font-weight: bold; margin-bottom: 6px; color: #1f4d2b; font-size: 16px;">${city}</h3>`;
      html += `<p style="margin-bottom: 8px; color: #34d399; font-size: 14px;">👥 ${teachers.length} Guru</p>`;
      html += `<ul style="list-style: none; padding: 0; max-height: 150px; overflow-y: auto; margin: 0;">`;
      
      teachers.forEach((teacher, index) => {
        if (index < 8) {
          html += `<li style="padding: 3px 0; border-bottom: 1px solid #e5e7eb; font-size: 13px;">📌 ${teacher.name || 'N/A'}</li>`;
        }
      });
      
      if (teachers.length > 8) {
        html += `<li style="padding: 3px 0; color: #34d399; font-size: 13px;">... dan ${teachers.length - 8} guru lainnya</li>`;
      }
      
      html += `</ul></div>`;
      return html;
    },
    async loadLeafletScript() {
      return new Promise((resolve) => {
        if (window.L) {
          resolve();
          return;
        }
        
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        
        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        document.head.appendChild(script);
        
        script.onload = resolve;
      });
    }
  }
}
</script>