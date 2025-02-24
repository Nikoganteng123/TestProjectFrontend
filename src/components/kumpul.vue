<template>
    <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
      <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
        <div class="p-8 space-y-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">
            Pengumpulan Uji Kompetensi
          </h1>
  
          <!-- Daftar Soal yang Kosong -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold text-gray-800">Soal yang Belum Dijawab:</h2>
            <ul v-if="emptySoals.length > 0" class="list-disc pl-6 text-gray-700">
              <li v-for="soal in emptySoals" :key="soal">
                Soal {{ soal }}
              </li>
            </ul>
            <p v-else class="text-green-600 font-medium">
              Semua soal telah dijawab!
            </p>
          </div>
  
          <!-- Potensi Nilai -->
          <div class="space-y-2">
            <h2 class="text-xl font-semibold text-gray-800">Potensi Nilai:</h2>
            <p class="text-lg text-gray-700">
              Nilai Anda saat ini: <span class="font-bold">{{ totalNilai }} / 382</span>
            </p>
          </div>
  
          <!-- Tombol Aksi -->
          <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-between items-center mt-6">
            <router-link to="/soal-17" 
              class="uniform-button bg-gray-500 text-white rounded-xl py-3 px-6 hover:bg-gray-600 transition-all duration-300 w-full sm:w-auto">
              Kembali
            </router-link>
            
            <button @click="confirmSubmit"
              class="uniform-button bg-blue-600 text-white rounded-xl py-3 px-6 hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto">
              Selesai
            </button>
          </div>
        </div>
      </div>
  
      <!-- Popup Konfirmasi -->
      <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Konfirmasi Pengumpulan</h3>
          <p class="text-gray-700">
            Apakah Anda yakin? Jika Anda sudah mengumpulkan, Anda tidak bisa mengedit atau kembali ke uji kompetensi yang telah Anda kumpul!
          </p>
          <div class="flex justify-end space-x-4 mt-6">
            <button @click="showPopup = false" 
              class="uniform-button bg-gray-500 text-white rounded-xl py-2 px-4 hover:bg-gray-600 transition-all duration-300">
              Batal
            </button>
            <button @click="submitFinal" 
              class="uniform-button bg-blue-600 text-white rounded-xl py-2 px-4 hover:bg-blue-700 transition-all duration-300">
              Ya, Kumpulkan
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  
  const authStore = useAuthStore();
  const router = useRouter();
  const emptySoals = ref([]);
  const totalNilai = ref(0);
  const showPopup = ref(false);
  
  onMounted(async () => {
    await fetchSoalStatus();
  });
  
  const fetchSoalStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/kumpul', {
        headers: { Authorization: `Bearer ${authStore.accessToken}` }
      });
  
      const soalStatus = response.data.soal_status;
      totalNilai.value = response.data.total_nilai;
  
      // Cek soal yang kosong
      emptySoals.value = Object.keys(soalStatus)
        .filter(soalNum => !soalStatus[soalNum].is_filled)
        .map(Number);
    } catch (error) {
      console.error('Error fetching soal status:', error.response ? error.response.data : error.message);
    }
  };
  
  const confirmSubmit = () => {
    showPopup.value = true;
  };
  
  const submitFinal = () => {
    // Logika pengumpulan final (misalnya panggil API untuk menyimpan status "selesai")
    console.log('Pengumpulan selesai!');
    
    // Tutup popup dan arahkan ke halaman lain (misalnya dashboard atau home)
    showPopup.value = false;
    router.push('/'); // Ganti sesuai kebutuhan
  };
  </script>
  
  <style scoped>
  /* Gunakan style yang konsisten dengan soal sebelumnya */
  .min-h-screen {
    background: linear-gradient(to top, #2d6a4f, #f0fdf4);
    padding: 3rem 1.5rem;
    position: relative;
    overflow: hidden;
  }
  
  .max-w-2xl {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 1.5rem;
    box-shadow: 0 20px 40px rgba(45, 106, 79, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  @media (min-width: 640px) {
    .max-w-2xl {
      backdrop-filter: blur(10px);
    }
  }
  
  .max-w-2xl:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(45, 106, 79, 0.25);
  }
  
  .text-3xl {
    font-size: 2.25rem;
    font-weight: 800;
    color: #1f4d2b;
    letter-spacing: -0.025em;
    background: linear-gradient(135deg, #2d6a4f, #34d399);
    -webkit-background-clip: text;
    background-clip: text;
    animation: fadeInDown 0.5s ease-out;
  }
  
  .uniform-button {
    padding: 0.75rem 2rem;
    border-radius: 9999px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    min-width: 150px;
    text-align: center;
  }
  
  .uniform-button.bg-green-600 {
    background: linear-gradient(135deg, #2d6a4f, #34d399);
  }
  
  .uniform-button.bg-red-600 {
    background: linear-gradient(135deg, #ef4444, #dc2626);
  }
  
  .uniform-button.bg-blue-600 {
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  }
  
  .uniform-button.bg-gray-500 {
    background: linear-gradient(135deg, #6b7280, #4b5563);
  }
  
  .uniform-button.bg-green-600:hover {
    background: linear-gradient(135deg, #1f4d36, #22c55e);
  }
  
  .uniform-button.bg-red-600:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
  }
  
  .uniform-button.bg-blue-600:hover {
    background: linear-gradient(135deg, #1e40af, #2563eb);
  }
  
  .uniform-button.bg-gray-500:hover {
    background: linear-gradient(135deg, #4b5563, #374151);
  }
  
  .uniform-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: all 0.6s ease;
  }
  
  .uniform-button:hover::before {
    left: 100%;
  }
  
  /* Popup Styling */
  .fixed.inset-0 {
    z-index: 50;
  }
  
  .bg-white.rounded-lg {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>