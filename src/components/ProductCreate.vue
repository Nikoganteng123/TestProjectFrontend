<template>
  <div class="p-4">
    <div class="mb-4">
      <router-link
        to="/"
        class="bg-gray-300 hover:bg-gray-400 transition-colors rounded-md py-2 px-4"
        >&larr; Back</router-link
      >
    </div>
    <h1 class="text-3xl font-bold mb-4">Create Product</h1>
    <form class="flex flex-col space-y-4" @submit.prevent="createProduct">
      <label class="text-lg font-semibold" for="name">Name:</label>
      <input
        class="border rounded-md p-2"
        v-model="name"
        type="text"
        id="name"
      />
      <label class="text-lg font-semibold" for="description"
        >Description:</label
      >
      <input
        class="border rounded-md p-2"
        v-model="description"
        type="text"
        id="description"
      />
      <label class="text-lg font-semibold" for="price">Price:</label>
      <input
        class="border rounded-md p-2"
        v-model="price"
        type="number"
        step="0.01"
        id="price"
      />
      <label class="text-lg font-semibold" for="image">Image URL:</label>
      <input
        class="border rounded-md p-2"
        v-model="image"
        type="text"
        id="image"
      />
      <button
        class="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition-colors"
        type="submit"
      >
        Create
      </button>
    </form>
  </div>
</template>
<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

const router = useRouter();
const name = ref("");
const description = ref("");
const price = ref("");
const image = ref("");
const createProduct = async () => {
  await axios.post(
    "http://localhost:8000/api/products",
    {
      name: name.value,
      description: description.value,
      price: price.value,
      image: image.value,
    },
    {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    }
  );
  router.push("/");
};
</script>
