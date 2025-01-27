<template>
  <div class="p-4">
    <div class="mb-4">
      <router-link
        to="/"
        class="bg-gray-300 hover:bg-gray-400 transition-colors rounded-md py-2 px-4"
        >&larr; Back</router-link
      >
    </div>
    <h1 class="text-3xl font-bold mb-4">Edit Product</h1>
    <form
      class="flex flex-col space-y-4"
      v-if="product"
      @submit.prevent="updateProduct"
    >
      <label class="text-lg font-semibold" for="name">Name:</label>
      <input
        class="border rounded-md p-2"
        v-model="product.name"
        type="text"
        id="name"
      />
      <label class="text-lg font-semibold" for="description"
        >Description:</label
      >
      <input
        class="border rounded-md p-2"
        v-model="product.description"
        type="text"
        id="description"
      />
      <label class="text-lg font-semibold" for="price">Price:</label>
      <input
        class="border rounded-md p-2"
        v-model="product.price"
        type="number"
        step="0.01"
        id="price"
      />
      <label class="text-lg font-semibold" for="image">Image URL:</label>
      <input
        class="border rounded-md p-2"
        v-model="product.image"
        type="text"
        id="image"
      />
      <button
        class="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition-colors"
        type="submit"
      >
        Save Changes
      </button>
    </form>
  </div>
</template>
<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const product = ref(null);
onMounted(async () => {
  const response = await axios.get(
    `http://localhost:8000/api/products/${route.params.id}`,
    {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    }
  );
  product.value = response.data.data;
});
const updateProduct = async () => {
  await axios.put(
    `http://localhost:8000/api/products/${product.value.id}`,
    {
      name: product.value.name,
      description: product.value.description,
      price: product.value.price,
      image: product.value.image,
    },
    {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    }
  );
  router.push(`/product/${product.value.id}`);
};
</script>
