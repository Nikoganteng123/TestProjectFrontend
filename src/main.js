import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios';

import App from './App.vue'
import router from './router'

axios.defaults.baseURL = 'http://127.0.0.1:8000';

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

app.use(createPinia())
app.use(router)

app.mount('#app')
