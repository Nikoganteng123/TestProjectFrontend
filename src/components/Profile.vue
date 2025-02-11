<template>
  <div class="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
    <!-- Bagian Profil -->
    <div class="flex items-center mb-6">
      <!-- Gambar Profil -->
      <div class="w-24 h-24 rounded-full overflow-hidden mr-6">
        <img 
          v-if="form.profile_picture"
          :src="URL.createObjectURL(form.profile_picture)" 
          alt="Profile Picture" 
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center text-white font-bold text-xl">
          {{ form.name.charAt(0) }}
        </div>
      </div>
      <!-- Nama Lengkap -->
      <div>
        <h3 class="text-xl font-semibold text-gray-800">{{ form.name || "No Name" }}</h3>
        <p class="text-sm text-gray-600">{{ form.email || "No Email" }}</p>
      </div>
    </div>

    <!-- Tombol Edit Profile -->
    <div class="flex justify-end mb-6">
      <button
        @click="editProfile"
        class="px-8 py-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 focus:outline-none transition duration-300"
      >
        Edit Profile
      </button>
    </div>

    <!-- Formulir Edit Profile (Hidden until Edit is triggered) -->
    <div v-if="isEditing" class="mt-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-8">Edit Profile</h2>

      <form @submit.prevent="updateProfile">
        <div class="space-y-6">
          <!-- Nama Lengkap -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              id="name"
              class="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <!-- Gambar Profil (Upload) -->
          <div>
            <input
              type="file"
              id="profile_picture"
              class="mt-4"
              @change="handleFileChange"
            />
          </div>
        </div>

        <!-- Tombol untuk Simpan dan Cancel -->
        <div class="mt-8 flex space-x-6 justify-center">
          <button
            type="submit"
            class="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-300"
          >
            Save Changes
          </button>
          <button
            @click="cancelEdit"
            type="button"
            class="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Bagian Sertifikasi -->
    <div class="mt-10">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Sertifikasi</h2>
      
      <!-- Jika tidak ada sertifikasi -->
      <div v-if="certifications.length === 0" class="text-gray-500 mb-4">
        Anda tidak memiliki Sertifikasi Digital IPBI. Silahkan mengikuti <a href="/uji-kompetensi" class="text-blue-600 hover:underline">Uji Kompetensi</a> untuk mendapatkan sertifikasi.
      </div>

      <!-- Jika ada sertifikasi -->
      <ul v-else>
        <li v-for="(cert, index) in certifications" :key="index" class="mb-4">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">{{ cert.title }}</span>
            <span class="text-sm text-gray-500">{{ cert.date }}</span>
          </div>
          <div class="text-gray-600">{{ cert.description }}</div>
          <div class="mt-2">
            <a 
              :href="cert.download_link"
              class="text-blue-600 hover:underline"
              target="_blank"
            >
              Download Sertifikat
            </a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const form = ref({
  name: "",
  email: "",
  profile_picture: null,
});
const certifications = ref([]);
const isEditing = ref(false);

const getUser = async () => {
  try {
    const response = await axios.get("http://10.4.12.215:8000/api/users/", {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    form.value = response.data; // Sesuaikan dengan format respons API
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

const getCertifications = async () => {
  try {
    const response = await axios.get("http://10.4.12.215:8000/api/certifications/", {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    certifications.value = response.data; // Sesuaikan dengan format respons API sertifikasi
  } catch (error) {
    console.error("Error fetching certifications:", error);
  }
};

const editProfile = () => {
  isEditing.value = true; // Enable editing mode
};

const updateProfile = async () => {
  try {
    const formData = new FormData();
    formData.append("name", form.value.name);
    formData.append("email", form.value.email);
    if (form.value.profile_picture) {
      formData.append("profile_picture", form.value.profile_picture);
    }

    await axios.put("http://10.4.12.215:8000/api/users/", formData, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Profile updated successfully");
    isEditing.value = false; // Disable editing mode after update
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Error updating profile");
  }
};

const cancelEdit = () => {
  isEditing.value = false; // Exit editing mode without saving
  getUser(); // Refresh profile data
};

const handleFileChange = (event) => {
  form.value.profile_picture = event.target.files[0];
};

onMounted(() => {
  getUser();
  getCertifications(); // Fetch certifications on component mount
});
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
  background-color: #f3f4f6;
}
</style>
