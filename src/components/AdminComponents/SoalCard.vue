<template>
  <div class="p-4 bg-white rounded shadow">
    <h2 class="text-xl font-semibold">Soal {{ soalNumber }}</h2>
    <p v-if="soalData">Nilai: {{ soalData.nilai || 'Belum dinilai' }}</p>
    <p v-else>Data belum diisi</p>

    <!-- Tampilan khusus untuk Soal 1, 3, 12, 14 -->
    <div v-if="soalData && isTextOnlySoal" class="mt-2">
      <p v-if="soalNumber === '1'">Tingkat Pendidikan: {{ soalData.tingkat_pendidikan || 'Tidak ada data' }}</p>
      
      <!-- Tampilan untuk Soal 3 -->
      <div v-if="soalNumber === '3'">
        <p>Bahasa Inggris: {{ soalData.bahasa_inggris || 'Tidak ada data' }}</p>
        <p>Bahasa Lain 1: {{ soalData.bahasa_lain1 || 'Tidak ada data' }}</p>
        <p>Bahasa Lain 2: {{ soalData.bahasa_lain2 || 'Tidak ada data' }}</p>
        <p>Bahasa Lain 3: {{ soalData.bahasa_lain3 || 'Tidak ada data' }}</p>
        <p>Bahasa Lain 4: {{ soalData.bahasa_lain4 || 'Tidak ada data' }}</p>
      </div>
      
      <p v-if="soalNumber === '12'">Jabatan: {{ soalData.jabatan || 'Tidak ada data' }}</p>
      <p v-if="soalNumber === '14'">Ngajar Online: {{ soalData.ngajar_online || 'Tidak ada data' }}</p>
    </div>

    <!-- Tampilan untuk soal dengan file PDF -->
    <div v-else-if="soalData" class="mt-2">
      <div v-for="field in fileFields" :key="field" class="flex items-center gap-2">
        <span>{{ field }}:</span>
        <button
          v-if="soalData[field]"
          class="text-blue-500 underline"
          @click="$emit('preview-file', soalNumber, field)"
        >
          Preview
        </button>
        <span v-else class="text-gray-500">No file</span>
      </div>
    </div>

    <!-- Tombol hapus -->
    <button
      v-if="soalData"
      class="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
      @click="$emit('delete-soal', soalNumber)"
    >
      Delete
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  soalNumber: String,
  soalData: Object,
  userId: String,
});

defineEmits(['delete-soal', 'preview-file']);

// Tentukan soal yang hanya menampilkan teks (tambahkan Soal 3)
const isTextOnlySoal = computed(() => ['1', '3', '12', '14'].includes(props.soalNumber));

// Daftar field file untuk soal dengan PDF
const fileFields = computed(() => {
  if (isTextOnlySoal.value) return []; // Tidak ada file untuk soal 1, 3, 12, 14
  const fieldsMap = {
    '2': ['tp3', 'lpmp_diknas', 'guru_lain_ipbi_1', 'guru_lain_ipbi_2', 'guru_lain_ipbi_3', 'guru_lain_ipbi_4', 'training_trainer'],
    '4': ['independent_org', 'foreign_school_degree', 'foreign_school_no_degree_1', 'foreign_school_no_degree_2', 'foreign_school_no_degree_3', 'foreign_school_no_degree_4', 'foreign_school_no_degree_5', 'domestic_school_no_degree_1', 'domestic_school_no_degree_2', 'domestic_school_no_degree_3', 'domestic_school_no_degree_4', 'domestic_school_no_degree_5'],
    '5': ['sertifikat_1', 'sertifikat_2', 'sertifikat_3'],
    '6': ['penghargaan_daerah', 'penghargaan_nasional', 'penghargaan_internasional'],
    '7': ['juara_nasional_dpp', 'juara_non_dpp', 'juara_instansi_lain', 'juara_internasional', 'peserta_lomba_1', 'peserta_lomba_2', 'peserta_lomba_3', 'peserta_lomba_4', 'peserta_lomba_5', 'juri_lomba_1', 'juri_lomba_2'],
    '8': ['demo_dpp_dpd1', 'demo_dpp_dpd2', 'demo_dpp_dpd3', 'demo_dpp_dpd4', 'demo_dpp_dpd5', 'non_ipbi1', 'non_ipbi2', 'non_ipbi3', 'non_ipbi4', 'non_ipbi5', 'international1', 'international2'],
    '9': ['pembina_demonstrator', 'panitia', 'peserta'],
    '10': ['ipbi_offline1', 'ipbi_offline2', 'ipbi_offline3', 'ipbi_online1', 'ipbi_online2', 'ipbi_online3', 'non_ipbi_offline1', 'non_ipbi_offline2', 'non_ipbi_offline3', 'non_ipbi_online1', 'non_ipbi_online2', 'non_ipbi_online3', 'international_offline1', 'international_offline2', 'international_online1', 'international_online2', 'host_moderator1', 'host_moderator2', 'host_moderator3', 'host_moderator4', 'host_moderator5'],
    '11': ['penguji_sertifikasi1', 'penguji_sertifikasi2', 'juri_ipbi1', 'juri_ipbi2', 'juri_non_ipbi1', 'juri_non_ipbi2'],
    '13': ['guru_tetap', 'asisten_guru', 'owner_sekolah', 'guru_tidak_tetap_offline', 'guru_tidak_tetap_online', 'guru_luar_negeri1', 'guru_luar_negeri2'],
    '15': ['ikebana_murid', 'ikebana_guru', 'rangkaian_tradisional', 'lainnya'],
    '16': ['aktif_merangkai', 'owner_berbadan_hukum', 'owner_tanpa_badan_hukum', 'freelance_designer'],
    '17': ['media_cetak_nasional', 'media_cetak_internasional', 'buku_merangkai_bunga', 'kontributor_buku1', 'kontributor_buku2', 'kontributor_tv1', 'kontributor_tv2'],
  };
  return fieldsMap[props.soalNumber] || [];
});
</script>