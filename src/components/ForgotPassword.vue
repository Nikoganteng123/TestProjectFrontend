<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
    style="background-image: url('src/assets/loginbackground.jpg')"
  >
    <div class="max-w-md w-full space-y-8 bg-white bg-opacity-80 p-8 rounded-xl shadow-lg">
      <div class="flex items-center justify-center mb-6">
        <img src="/src/assets/logoipbi.jpg" alt="Logo" class="h-12 w-auto" />
        <h2 class="text-2xl font-bold text-center">Ikatan Perangkai Bunga Indonesia</h2>
      </div>
      <div v-if="message" :class="['p-4 rounded-lg', status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
        {{ message }}
      </div>
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div>
          <label for="email-address" class="sr-only">Email address</label>
          <input
            id="email-address"
            type="email"
            v-model="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your email"
            :disabled="loading"
          />
        </div>
        <div>
          <button
            type="submit"
            class="w-full py-2 px-4 rounded-md text-white bg-green-700 hover:bg-green-800 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            :disabled="loading"
          >
            {{ loading ? "Sending..." : "Send Reset Link" }}
          </button>
        </div>
        <div>
          <router-link
            to="/login"
            class="w-full flex justify-center py-2 text-green-700 hover:text-green-800"
          >
            Back to Login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      email: '',
      loading: false,
      message: '',
      status: false
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      this.message = '';
      try {
        const response = await axios.post('/api/forgot-password', { email: this.email });
        this.message = response.data.message;
        this.status = true;
      } catch (error) {
        this.message = error.response?.data?.message || 'An error occurred';
        this.status = false;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>