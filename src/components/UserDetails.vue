<template>
  <div class="p-4">
    <button
      class="bg-gray-300 hover:bg-gray-400 transition-colors rounded-md py-2 px-4 mb6"
      @click="goBack"
    >
      &larr; Back
    </button>
    <h1 class="text-3xl font-bold mb-4">User Details</h1>
    <div class="bg-white rounded-lg p-4 shadow-md" v-if="user">
      <h3 class="text-xl font-bold mb-2">{{ user.name }}</h3>
      <p class="text-gray-500 text-sm mb-2">{{ user.email }}</p>
      <div class="flex justify-between">
        <router-link
          :to="`/users/${user.id}/edit`"
          class="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition-colors"
          >Edit</router-link
        >
        <button
          @click="deleteUser"
          class="bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore;
const router = useRouter();
const route = useRoute();
const user = ref(null);
const goBack = () => {
  router.go(-1);
};
onMounted(async () => {
  const response = await axios.get(
    `http://localhost:8000/api/users/${route.params.id}`,
    {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    }
  );
  user.value = response.data.data;
});
const deleteUser = async () => {
  if (confirm("Are you sure you want to delete this user?")) {
    await axios.delete(`http://localhost:8000/api/users/${user.value.id}`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    router.push("/users");
  }
};
</script>
