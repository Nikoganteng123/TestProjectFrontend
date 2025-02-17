<template>
  <main class="app">
    <h1>Quiz Poin</h1>
    <div class="score">Total Poin: {{ totalPoints }}</div>

    <!-- Pop-up Panduan -->
    <div v-if="showGuide" class="popup show">
      <div class="popup-content">
        <button class="close-btn" @click="showGuide = false">&times;</button>
        <h2>Selamat Datang di Uji Kompetensi</h2>
        <p>
          Untuk mengikuti Uji Kompetensi, harap mengisi jawaban dengan jujur. Setiap jawaban memiliki poin yang menentukan level Anda.
          Jika ada kolom unggah file PDF, unggah lebih dari satu untuk meningkatkan poin Anda.
        </p>
      </div>
    </div>

    <!-- Soal yang ditampilkan berdasarkan soal aktif -->
    <div class="question-container">
      <h2>{{ questions[activeQuestion].question }}</h2>
      <div v-if="questions[activeQuestion].type === 'radio'">
        <label v-for="(option, index) in questions[activeQuestion].options" :key="index" class="radio-option">
          <input type="radio" :name="'question-' + activeQuestion" :value="index" v-model="questions[activeQuestion].selected" />
          {{ option.text }} ({{ option.points }} poin)
        </label>
      </div>
    </div>

    <!-- Tombol Aksi -->
    <div class="action-buttons">
      <button @click="saveAnswers">Simpan Jawaban</button>
      <button @click="clearAnswers">Hapus Jawaban</button>
    </div>

    <!-- Navigasi Soal -->
    <div class="question-navigation">
      <h3>Pilih Soal:</h3>
      <div class="question-buttons">
        <button v-for="(question, index) in questions" :key="question.id" :class="{'active': activeQuestion === index}" @click="activeQuestion = index">
          {{ index + 1 }}
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const questions = ref([
  { id: 1, question: 'Apa pendidikan terakhir Anda?', type: 'radio', options: [
      { text: 'SMP - D3', points: 3 },
      { text: 'S1', points: 4 },
      { text: 'S2 atau lebih', points: 5 }
    ], selected: null },
  { id: 2, question: 'Apakah Anda memiliki Sertifikat Guru?', type: 'radio', options: [
      { text: 'Ya', points: 10 },
      { text: 'Tidak', points: 0 }
    ], selected: null }
]);

const activeQuestion = ref(0);
const totalPoints = computed(() => questions.value.reduce((sum, q) => q.selected !== null ? sum + q.options[q.selected].points : sum, 0));
const showGuide = ref(true);

const saveAnswers = () => alert('Jawaban disimpan!');
const clearAnswers = () => questions.value.forEach(q => q.selected = null);
</script>

<style scoped>
/* Style Umum */
.app {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 800px;
  margin: auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

/* Skor */
.score {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #2c3e50;
}

/* Soal */
.question-container {
  border: 2px solid #2c3e50;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  background: #f8f9fa;
  transition: all 0.3s ease-in-out;
}

h2 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #2c3e50;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

input[type="radio"] {
  accent-color: #2ecc71;
}

/* Tombol Aksi */
.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.action-buttons button {
  background-color: #3498db;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.action-buttons button:hover {
  background-color: #2980b9;
}

.action-buttons button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

/* Navigasi Soal */
.question-navigation {
  margin-top: 20px;
  text-align: center;
}

.question-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.question-buttons button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ddd;
  color: #2c3e50;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
}

.question-buttons button.active {
  background-color: #2ecc71;
  color: white;
}

.question-buttons button:hover {
  background-color: #27ae60;
}

/* Pop-up Window */
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.95);
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  transition: all 0.3s ease-in-out;
}

/* Animasi muncul */
.popup.show {
  transform: translate(-50%, -50%) scale(1);
}

/* Tombol Close */
.popup .close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: #2ecc71;
  color: white;
  font-size: 14px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

.popup .close-btn:hover {
  background: #27ae60;
}
</style>
