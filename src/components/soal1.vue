<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const questions = ref([
  {
    id: 1,
    question: 'Apa pendidikan formal terakhir Anda?',
    type: 'radio',
    maxPoints: 5,
    options: [
      { text: 'SMP - D3', points: 3 },
      { text: 'S1', points: 4 },
      { text: 'S2/ di atasnya', points: 5 }
    ],
    selected: null
  },
  {
    id: 2,
    question: 'Apakah Anda memiliki Sertifikat Pendidikan Guru Merangkai Bunga?',
    type: 'checkbox',
    maxPoints: 70,
    options: [
      { text: 'Sertifikat TP3', points: 20, file: null },
      { text: 'Sertifikat Pelatihan LPMP/ Diknas', points: 30, file: null },
      { text: 'Sertifikat Guru (non-IPBI)', points: 5, files: [], maxFiles: 4 },
      { text: 'Sertifikat Training to Trainer', points: 10, file: null }
    ],
    selected: []
  }
]);

const totalPoints = computed(() => {
  return questions.value.reduce((sum, q) => {
    if (q.type === 'radio' && q.selected !== null) {
      return sum + q.options[q.selected].points;
    }
    if (q.type === 'checkbox') {
      return sum + q.selected.reduce((acc, index) => {
        let option = q.options[index];
        if (option.maxFiles) {
          return acc + (option.files.length * option.points);
        }
        return acc + option.points;
      }, 0);
    }
    return sum;
  }, 0);
});

const handleFileUpload = (e, option) => {
  if (option.maxFiles) {
    if (e.target.files.length + option.files.length > option.maxFiles) {
      alert(`Maksimal ${option.maxFiles} file dapat diunggah.`);
      return;
    }
    option.files.push(...Array.from(e.target.files));
  } else {
    option.file = e.target.files[0];
  }
};

const removeFile = (option, index) => {
  option.files.splice(index, 1);
};

watch(questions, (newVal) => {
  localStorage.setItem('quizData', JSON.stringify(newVal));
}, { deep: true });

onMounted(() => {
  const savedData = localStorage.getItem('quizData');
  if (savedData) {
    questions.value = JSON.parse(savedData);
  }
});
</script>

<template>
  <main class="app">
    <h1>Quiz Poin</h1>
    <div class="score">Total Poin: {{ totalPoints }}</div>
    
    <div v-for="(q, qIndex) in questions" :key="q.id" class="question-container">
      <h2>{{ q.question }}</h2>
      <div v-if="q.type === 'radio'">
        <label v-for="(option, index) in q.options" :key="index" class="radio-option">
          <input type="radio" :name="'question-' + qIndex" :value="index" v-model="q.selected" />
          {{ option.text }} ({{ option.points }} poin)
        </label>
      </div>
      
      <div v-if="q.type === 'checkbox'">
        <label v-for="(option, index) in q.options" :key="index" class="checkbox-option">
          <input type="checkbox" :value="index" v-model="q.selected" />
          {{ option.text }} ({{ option.points }} poin)
          <input v-if="option.maxFiles" type="file" accept="application/pdf" multiple @change="e => handleFileUpload(e, option)" />
          <input v-else type="file" accept="application/pdf" @change="e => option.file = e.target.files[0]" />
          <ul v-if="option.files">
            <li v-for="(file, fileIndex) in option.files" :key="fileIndex">
              {{ file.name }} <button @click="removeFile(option, fileIndex)">❌</button>
            </li>
          </ul>
        </label>
      </div>
    </div>
  </main>
</template>

<style>
.app {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 600px;
  margin: auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.score {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #2c3e50;
}

.question-container {
  border: 2px solid #2c3e50;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  background: #ecf0f1;
}

h2 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #2c3e50;
}

.radio-option, .checkbox-option {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

input[type='file'] {
  margin-top: 5px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  background: #bdc3c7;
  padding: 5px;
  border-radius: 5px;
  margin-top: 5px;
}

button {
  background: red;
  color: white;
  border: none;
  padding: 3px 5px;
  cursor: pointer;
}
</style>
