import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    accessToken: localStorage.getItem("accessToken") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
  }),
  getters: {
    isLoggedIn() {
      return this.accessToken !== null;
    },
  },
  actions: {
    setAccessToken(token) {
      this.accessToken = token;
      localStorage.setItem("accessToken", token);
    },
    removeAccessToken() {
      this.accessToken = null;
      localStorage.removeItem("accessToken");
    },
    setUser(user) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    async fetchUserProfile() {
      if (this.accessToken) {
        try {
          const response = await axios.get("http://localhost:8000/api/users", {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          });
          
          // Ambil email dari localStorage
          const currentUserEmail = localStorage.getItem('email');
          console.log("Current email:", currentUserEmail); // untuk debugging
          
          // Filter user berdasarkan email
          const currentUser = response.data.data.find(
            user => user.email === currentUserEmail
          );
          
          console.log("Found user:", currentUser); // untuk debugging
          
          if (currentUser) {
            this.setUser(currentUser);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    },
    logout() {
      try {
        axios.post("http://localhost:8000/api/logout", null, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
        this.removeAccessToken();
        this.user = null;
        localStorage.removeItem("user");
        localStorage.removeItem("email"); // Tambahkan ini untuk membersihkan email
        console.log("Logout successful");
      } catch (error) {
        console.error("Error during logout:", error.message);
      }
    },
  },
});