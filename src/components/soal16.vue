=<template>
  <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
      <div class="p-8 space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          Data 16: Informasi Florist dan Proyek
        </h1>

        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="p-4 bg-green-100 text-green-700 rounded-md">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="p-4 bg-red-100 text-red-700 rounded-md">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="submitAnswer" class="space-y-6">
          <!-- Pilihan Section -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold text-gray-800">Pilih Kategori:</h2>
            <div class="flex flex-col gap-2">
              <button type="button" @click="toggleSection('A')" class="text-left p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                A. Aktif Merangkai Bunga di Florist (Staff/Owner)
              </button>
              <div v-if="activeSection === 'A'" class="space-y-4 p-4 bg-gray-50 rounded-md">
                <div class="flex flex-col gap-2">
                  <label for="nama_florist" class="text-sm font-medium text-gray-700">a. Nama Florist *</label>
                  <input v-model="form.nama_florist" id="nama_florist" type="text" class="p-2 border rounded-md" required />
                </div>
                <div class="flex flex-col gap-2">
                  <label for="d_alamat_florist" class="text-sm font-medium text-gray-700">b. Alamat Florist *</label>
                  <textarea v-model="form.d_alamat_florist" id="d_alamat_florist" class="p-2 border rounded-md" required></textarea>
                </div>
                <div v-for="(field, index) in sectionAFields" :key="index" class="flex flex-col gap-2">
                  <label :for="field.key" :class="savedFiles[field.key] ? 'text-green-600' : 'text-gray-700'">
                    {{ field.label }}
                  </label>
                  <div v-if="savedFiles[field.key]" class="text-green-600 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>File sudah tersimpan</span>
                  </div>
                  <div v-else class="relative">
                    <input type="file" :id="field.key" accept=".pdf,image/*" @change="handleFileUpload($event, field.key)" class="hidden" />
                    <label :for="field.key" class="upload-button">
                      {{ uploadedFiles[field.key] ? truncateFileName(uploadedFiles[field.key].name) : 'Upload' }}
                    </label>
                  </div>
                </div>
              </div>

              <button type="button" @click="toggleSection('B')" class="text-left p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                B. Owner Florist Berbadan Hukum
              </button>
              <div v-if="activeSection === 'B'" class="space-y-4 p-4 bg-gray-50 rounded-md">
                <div class="flex flex-col gap-2">
                  <label for="c_nama_florist" class="text-sm font-medium text-gray-700">a. Nama Florist *</label>
                  <input v-model="form.c_nama_florist" id="c_nama_florist" type="text" class="p-2 border rounded-md" required />
                </div>
                <div class="flex flex-col gap-2">
                  <label for="b_alamat_florist" class="text-sm font-medium text-gray-700">b. Alamat Florist *</label>
                  <textarea v-model="form.b_alamat_florist" id="b_alamat_florist" class="p-2 border rounded-md" required></textarea>
                </div>
                <div v-for="(field, index) in sectionBFields" :key="index" class="flex flex-col gap-2">
                  <label :for="field.key" :class="savedFiles[field.key] ? 'text-green-600' : 'text-gray-700'">
                    {{ field.label }}
                  </label>
                  <div v-if="savedFiles[field.key]" class="text-green-600 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>File sudah tersimpan</span>
                  </div>
                  <div v-else class="relative">
                    <input type="file" :id="field.key" accept=".pdf,image/*" @change="handleFileUpload($event, field.key)" class="hidden" />
                    <label :for="field.key" class="upload-button">
                      {{ uploadedFiles[field.key] ? truncateFileName(uploadedFiles[field.key].name) : 'Upload' }}
                    </label>
                  </div>
                </div>
              </div>

              <button type="button" @click="toggleSection('C')" class="text-left p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                C. Owner Florist Tidak Berbadan Hukum
              </button>
              <div v-if="activeSection === 'C'" class="space-y-4 p-4 bg-gray-50 rounded-md">
                <div class="flex flex-col gap-2">
                  <label for="c2_nama_florist" class="text-sm font-medium text-gray-700">a. Nama Florist *</label>
                  <input v-model="form.c2_nama_florist" id="c2_nama_florist" type="text" class="p-2 border rounded-md" required />
                </div>
                <div class="flex flex-col gap-2">
                  <label for="c2_alamat_florist" class="text-sm font-medium text-gray-700">b. Alamat Florist *</label>
                  <textarea v-model="form.c2_alamat_florist" id="c2_alamat_florist" class="p-2 border rounded-md" required></textarea>
                </div>
                <div v-for="(field, index) in sectionCFields" :key="index" class="flex flex-col gap-2">
                  <label :for="field.key" :class="savedFiles[field.key] ? 'text-green-600' : 'text-gray-700'">
                    {{ field.label }}
                  </label>
                  <div v-if="savedFiles[field.key]" class="text-green-600 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>File sudah tersimpan</span>
                  </div>
                  <div v-else class="relative">
                    <input type="file" :id="field.key" accept=".pdf,image/*" @change="handleFileUpload($event, field.key)" class="hidden" />
                    <label :for="field.key" class="upload-button">
                      {{ uploadedFiles[field.key] ? truncateFileName(uploadedFiles[field.key].name) : 'Upload' }}
                    </label>
                  </div>
                </div>
              </div>

              <button type="button" @click="toggleSection('D')" class="text-left p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                D. Freelance Designer
              </button>
              <div v-if="activeSection === 'D'" class="space-y-4 p-4 bg-gray-50 rounded-md">
                <div v-for="(project, index) in form.projects" :key="index" class="space-y-4">
                  <h3 class="text-lg font-medium text-gray-800">Proyek {{ index + 1 }}</h3>
                  <div class="flex flex-col gap-2">
                    <label :for="`pemberi_order_${index}`" class="text-sm font-medium text-gray-700">a. Pemberi Order *</label>
                    <input v-model="project.pemberi_order" :id="`pemberi_order_${index}`" type="text" class="p-2 border rounded-md" required />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label :for="`tempat_lokasi_${index}`" class="text-sm font-medium text-gray-700">b. Tempat/Lokasi *</label>
                    <input v-model="project.tempat_lokasi" :id="`tempat_lokasi_${index}`" type="text" class="p-2 border rounded-md" required />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label :for="`tanggal_tahun_${index}`" class="text-sm font-medium text-gray-700">c. Tanggal/Tahun *</label>
                    <input v-model="project.tanggal_tahun" :id="`tanggal_tahun_${index}`" type="text" class="p-2 border rounded-md" required />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label :for="`deskripsi_${index}`" class="text-sm font-medium text-gray-700">d. Deskripsi Proyek *</label>
                    <textarea v-model="project.deskripsi" :id="`deskripsi_${index}`" class="p-2 border rounded-md" required></textarea>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div v-for="n in 4" :key="n" class="flex flex-col gap-2">
                      <label :for="sectionDFields[index * 4 + n - 1].key" :class="savedFiles[sectionDFields[index * 4 + n - 1].key] ? 'text-green-600' : 'text-gray-700'">
                        {{ sectionDFields[index * 4 + n - 1].label }} (Proyek {{ index + 1 }})
                      </label>
                      <div v-if="savedFiles[sectionDFields[index * 4 + n - 1].key]" class="text-green-600 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>File sudah tersimpan</span>
                      </div>
                      <div v-else class="relative">
                        <input type="file" :id="sectionDFields[index * 4 + n - 1].key" accept=".pdf,image/*" @change="handleFileUpload($event, sectionDFields[index * 4 + n - 1].key)" class="hidden" />
                        <label :for="sectionDFields[index * 4 + n - 1].key" class="upload-button">
                          {{ uploadedFiles[sectionDFields[index * 4 + n - 1].key] ? truncateFileName(uploadedFiles[sectionDFields[index * 4 + n - 1].key].name) : 'Upload' }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-between items-center mt-6">
            <router-link to="/soal-15" class="uniform-button bg-gray-500 text-white hover:bg-gray-600">
              Previous
            </router-link>
            <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button type="submit" :disabled="loading" class="uniform-button bg-green-600 text-white hover:bg-green-700">
                {{ savedFiles && Object.keys(savedFiles).length > 0 ? 'Update Jawaban' : 'Simpan Jawaban' }}
                <span v-if="loading" class="spinner ml-2"></span>
              </button>
              <button type="button" @click="deleteAll" :disabled="loading || Object.keys(savedFiles).length === 0" class="uniform-button bg-red-600 text-white hover:bg-red-700">
                Hapus Semua
                <span v-if="loading" class="spinner ml-2"></span>
              </button>
            </div>
            <router-link to="/soal-17" class="uniform-button bg-blue-600 text-white hover:bg-blue-700">
              Next
            </router-link>
          </div>
        </form>

        <!-- Navigation Bar -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Navigasi Soal</h3>
          <div class="flex flex-wrap gap-2">
            <router-link v-for="n in 17" :key="n" :to="`/soal-${n}`"
              class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200"
              :class="[
                currentQuestionNumber === n ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-green-500 hover:text-white text-gray-700'
              ]">
              {{ n }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';

const route = useRoute();
const authStore = useAuthStore();
const uploadedFiles = ref({});
const savedFiles = ref({});
const successMessage = ref('');
const errorMessage = ref('');
const loading = ref(false);
const activeSection = ref(null);
const form = ref({
  nama_florist: '',
  d_alamat_florist: '',
  c_nama_florist: '',
  b_alamat_florist: '',
  c2_nama_florist: '',
  c2_alamat_florist: '',
  projects: [
    { pemberi_order: '', tempat_lokasi: '', tanggal_tahun: '', deskripsi: '' },
    { pemberi_order: '', tempat_lokasi: '', tanggal_tahun: '', deskripsi: '' },
    { pemberi_order: '', tempat_lokasi: '', tanggal_tahun: '', deskripsi: '' }
  ]
});

const sectionAFields = [
  { key: 'a_foto_lokasi1', label: 'c. Foto Lokasi 1' }, { key: 'a_foto_lokasi2', label: 'c. Foto Lokasi 2' },
  { key: 'a_foto_lokasi3', label: 'c. Foto Lokasi 3' }, { key: 'a_foto_kegiatan1', label: 'd. Foto Kegiatan 1' },
  { key: 'a_foto_kegiatan2', label: 'd. Foto Kegiatan 2' }, { key: 'a_foto_kegiatan3', label: 'd. Foto Kegiatan 3' }
];

const sectionBFields = [
  { key: 'b_bukti_akta1', label: 'c. Foto Lokasi 1 / Bukti Akta 1' }, { key: 'b_bukti_akta2', label: 'c. Foto Lokasi 2 / Bukti Akta 2' },
  { key: 'b_bukti_akta3', label: 'c. Foto Lokasi 3 / Bukti Akta 3' }, { key: 'b_bukti_akta4', label: 'd. Foto Lokasi 4 / Bukti Akta 4' },
  { key: 'b_bukti_akta5', label: 'd. Foto Lokasi 5 / Bukti Akta 5' }, { key: 'b_bukti_akta6', label: 'd. Foto Lokasi 6 / Bukti Akta 6' }
];

const sectionCFields = [
  { key: 'c_foto_lokasi1', label: 'c. Foto Lokasi 1' }, { key: 'c_foto_lokasi2', label: 'c. Foto Lokasi 2' },
  { key: 'c_foto_lokasi3', label: 'c. Foto Lokasi 3' }, { key: 'c_foto_lokasi4', label: 'c. Foto Lokasi 4' },
  { key: 'c_foto_lokasi5', label: 'c. Foto Lokasi 5' }, { key: 'c_foto_lokasi6', label: 'c. Foto Lokasi 6' }
];

const sectionDFields = [
  { key: 'd_foto_lokasi1', label: 'e. Foto Lokasi 1' }, { key: 'd_foto_lokasi2', label: 'e. Foto Lokasi 2' },
  { key: 'd_foto_lokasi3', label: 'e. Foto Lokasi 3' }, { key: 'd_foto_lokasi4', label: 'e. Foto Lokasi 4' },
  { key: 'd_foto_lokasi5', label: 'e. Foto Lokasi 1' }, { key: 'd_foto_lokasi6', label: 'e. Foto Lokasi 2' },
  { key: 'd_foto_lokasi7', label: 'e. Foto Lokasi 3' }, { key: 'd_foto_lokasi8', label: 'e. Foto Lokasi 4' },
  { key: 'd_foto_lokasi9', label: 'e. Foto Lokasi 1' }, { key: 'd_foto_lokasi10', label: 'e. Foto Lokasi 2' },
  { key: 'd_foto_lokasi11', label: 'e. Foto Lokasi 3' }, { key: 'd_foto_lokasi12', label: 'e. Foto Lokasi 4' }
];

const currentQuestionNumber = computed(() => {
  const match = route.path.match(/\/soal-(\d+)/);
  return match ? parseInt(match[1]) : 16;
});

onMounted(async () => {
  await fetchAnswer();
});

const toggleSection = (section) => {
  activeSection.value = activeSection.value === section ? null : section;
};

const handleFileUpload = (event, field) => {
  const file = event.target.files[0];
  if (file) {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (allowedTypes.includes(file.type) && file.size <= maxSize) {
      uploadedFiles.value[field] = file;
      errorMessage.value = '';
    } else {
      errorMessage.value = 'File harus berupa PDF atau gambar (JPG, PNG, GIF, BMP, WEBP) dan maksimum 2MB';
      event.target.value = '';
    }
  }
};

const submitAnswer = async () => {
  if (!activeSection.value) {
    errorMessage.value = 'Pilih kategori terlebih dahulu!';
    return;
  }

  // Validate text fields
  switch (activeSection.value) {
    case 'A':
      if (!form.value.nama_florist.trim() || !form.value.d_alamat_florist.trim()) {
        errorMessage.value = 'Semua field teks di kategori A harus diisi!';
        return;
      }
      break;
    case 'B':
      if (!form.value.c_nama_florist.trim() || !form.value.b_alamat_florist.trim()) {
        errorMessage.value = 'Semua field teks di kategori B harus diisi!';
        return;
      }
      break;
    case 'C':
      if (!form.value.c2_nama_florist.trim() || !form.value.c2_alamat_florist.trim()) {
        errorMessage.value = 'Semua field teks di kategori C harus diisi!';
        return;
      }
      break;
    case 'D':
      const incompleteD = form.value.projects.some(project => 
        !project.pemberi_order.trim() || 
        !project.tempat_lokasi.trim() || 
        !project.tanggal_tahun.trim() || 
        !project.deskripsi.trim()
      );
      if (incompleteD) {
        errorMessage.value = 'Semua field teks proyek di kategori D harus diisi!';
        return;
      }
      break;
  }

  // Validate file uploads
  const sectionFields = {
    'A': sectionAFields.map(f => f.key),
    'B': sectionBFields.map(f => f.key),
    'C': sectionCFields.map(f => f.key),
    'D': sectionDFields.map(f => f.key),
  };

  const relevantFields = sectionFields[activeSection.value];
  let hasFiles = false;

  if (activeSection.value === 'D') {
    const projectFields = [
      relevantFields.slice(0, 4),  // Project 1
      relevantFields.slice(4, 8),  // Project 2
      relevantFields.slice(8, 12), // Project 3
    ];

    for (let i = 0; i < projectFields.length; i++) {
      const projectHasFile = projectFields[i].some(field => 
        uploadedFiles.value[field] || savedFiles.value[field]
      );
      if (!projectHasFile) {
        errorMessage.value = `Minimal unggah satu foto untuk Proyek ${i + 1} di kategori D!`;
        return;
      }
      hasFiles = true;
    }
  } else {
    hasFiles = relevantFields.some(field => uploadedFiles.value[field] || savedFiles.value[field]);
    if (!hasFiles) {
      errorMessage.value = `Minimal unggah satu foto untuk kategori ${activeSection.value}!`;
      return;
    }
  }

  try {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    const formData = new FormData();
    formData.append('active_section', activeSection.value);

    // Append relevant text fields
    switch (activeSection.value) {
      case 'A':
        formData.append('nama_florist', form.value.nama_florist.trim());
        formData.append('d_alamat_florist', form.value.d_alamat_florist.trim());
        break;
      case 'B':
        formData.append('c_nama_florist', form.value.c_nama_florist.trim());
        formData.append('b_alamat_florist', form.value.b_alamat_florist.trim());
        break;
      case 'C':
        formData.append('c2_nama_florist', form.value.c2_nama_florist.trim());
        formData.append('c2_alamat_florist', form.value.c2_alamat_florist.trim());
        break;
      case 'D':
        form.value.projects.forEach((project, index) => {
          const i = index + 1;
          formData.append(`d_pemberi_order${i}`, project.pemberi_order.trim());
          formData.append(`d_tempat_lokasi${i}`, project.tempat_lokasi.trim());
          formData.append(`d_tanggal_tahun${i}`, project.tanggal_tahun.trim());
          formData.append(`d_deskripsi${i}`, project.deskripsi.trim());
        });
        break;
    }

    // Append uploaded files
    Object.keys(uploadedFiles.value).forEach((key) => {
      if (uploadedFiles.value[key] && relevantFields.includes(key)) {
        formData.append(key, uploadedFiles.value[key]);
      }
    });

    // Debug formData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${typeof value === 'string' ? value : 'File'}`);
    }

    const endpoint = Object.keys(savedFiles.value).length > 0 ? 'Update Jawban' : 'Simpan Jawaban';
    const response = await axios.post(endpoint, formData, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    successMessage.value = response.data.message || 'Data berhasil disimpan';
    uploadedFiles.value = {};
    await fetchAnswer();
    setTimeout(() => successMessage.value = '', 3000);
  } catch (error) {
    errorMessage.value = 'Gagal menyimpan: ' + (error.response?.data?.message || error.message);
    console.error('Error detail:', error.response?.data);
  } finally {
    loading.value = false;
  }
};

const fetchAnswer = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/soal16', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    });
    const data = response.data.data || {};
    savedFiles.value = {};

    // Populate text fields
    form.value.nama_florist = data.nama_florist || '';
    form.value.d_alamat_florist = data.d_alamat_florist || '';
    form.value.c_nama_florist = data.c_nama_florist || '';
    form.value.b_alamat_florist = data.b_alamat_florist || '';
    form.value.c2_nama_florist = data.c2_nama_florist || '';
    form.value.c2_alamat_florist = data.c2_alamat_florist || '';

    // Populate projects for D
    form.value.projects = [
      {
        pemberi_order: data.d_pemberi_order1 || '',
        tempat_lokasi: data.d_tempat_lokasi1 || '',
        tanggal_tahun: data.d_tanggal_tahun1 || '',
        deskripsi: data.d_deskripsi1 || ''
      },
      {
        pemberi_order: data.d_pemberi_order2 || '',
        tempat_lokasi: data.d_tempat_lokasi2 || '',
        tanggal_tahun: data.d_tanggal_tahun2 || '',
        deskripsi: data.d_deskripsi2 || ''
      },
      {
        pemberi_order: data.d_pemberi_order3 || '',
        tempat_lokasi: data.d_tempat_lokasi3 || '',
        tanggal_tahun: data.d_tanggal_tahun3 || '',
        deskripsi: data.d_deskripsi3 || ''
      }
    ];

    // Populate saved file fields
    sectionAFields.concat(sectionBFields, sectionCFields, sectionDFields).forEach(field => {
      if (data[field.key]) savedFiles.value[field.key] = data[field.key];
    });

    activeSection.value = data.active_section || null;
  } catch (error) {
    errorMessage.value = 'Gagal memuat data: ' + (error.response?.data?.message || error.message);
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const deleteAll = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus semua data?')) return;

  try {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    await axios.delete('/api/soal16', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    });

    // Reset form and state
    form.value = {
      nama_florist: '',
      d_alamat_florist: '',
      c_nama_florist: '',
      b_alamat_florist: '',
      c2_nama_florist: '',
      c2_alamat_florist: '',
      projects: [
        { pemberi_order: '', tempat_lokasi: '', tanggal_tahun: '', deskripsi: '' },
        { pemberi_order: '', tempat_lokasi: '', tanggal_tahun: '', deskripsi: '' },
        { pemberi_order: '', tempat_lokasi: '', tanggal_tahun: '', deskripsi: '' }
      ]
    };
    uploadedFiles.value = {};
    savedFiles.value = {};
    activeSection.value = null;

    successMessage.value = 'Semua data berhasil dihapus!';
    setTimeout(() => successMessage.value = '', 3000);
  } catch (error) {
    errorMessage.value = 'Gagal menghapus data: ' + (error.response?.data?.message || error.message);
    console.error('Error detail:', error.response?.data);
  } finally {
    loading.value = false;
  }
};

const truncateFileName = (name) => {
  return name.length > 15 ? `${name.substring(0, 12)}...` : name;
};
</script>

<style scoped>
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

.text-3xl {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1f4d2b;
  letter-spacing: -0.025em;
}

.text-sm {
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.upload-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #ecfdf5;
  border: 2px solid #34d399;
  border-radius: 0.5rem;
  color: #2d6a4f;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-button:hover {
  background: #d1fae5;
  border-color: #2d6a4f;
  color: #1f4d36;
}

.uniform-button {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.uniform-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #34d399;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>