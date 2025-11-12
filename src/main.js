import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios';

import App from './App.vue'
import router from './router'
import { useDialog } from './composables/useDialog'

axios.defaults.baseURL = 'https://api.ipbipendataanguru.org';

// Add interceptor untuk request tanpa credentials jika diperlukan
axios.interceptors.request.use(config => {
  // Jangan attach token jika useAuthInRequest di-set false
  if (!config.useAuthInRequest) {
    config.withCredentials = false;
    return config;
  }
  return config;
}, error => Promise.reject(error));

import "@fortawesome/fontawesome-free/css/all.min.css";


const app = createApp(App)

// Setup global dialog untuk Options API
const { showAlert, showConfirm } = useDialog();
app.config.globalProperties.$alert = showAlert;
app.config.globalProperties.$confirm = showConfirm;

// Setup global untuk Composition API
app.provide('$alert', showAlert);
app.provide('$confirm', showConfirm);

app.use(createPinia())
app.use(router)

app.mount('#app')
