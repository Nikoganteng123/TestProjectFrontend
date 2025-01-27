<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">Product List</h1>
    <router-link
      to="/create"
      class="bg-blue-500 text-white rounded-md py-2 px-4 mb-4 inline-block hover:bgblue-600 transition-colors"
      >Create a new product</router-link
    >
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-lg p-4 shadow-md"
      >
        <h3 class="text-xl font-bold mb-2">{{ product.name }}</h3>
        <p class="text-gray-500 text-sm mb-2">{{ product.description }}</p>
        <p class="text-gray-700 font-semibold text-lg">{{ product.price }}</p>
        <router-link
          :to="`/product/${product.id}`"
          class="bg-blue-500 text-white rounded-md py-2 px-4 mt-4 inline-block hover:bg-blue-600 transition-colors"
          >View Details</router-link
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const products = ref([]);
onMounted(async () => {
  const response = await axios.get("http://localhost:8000/api/products", {
    headers: {
      Authorization: `Bearer ${authStore.accessToken}`,
    },
  });
  products.value = response.data.data;
});
</script>
