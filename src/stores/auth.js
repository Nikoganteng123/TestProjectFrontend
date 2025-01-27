// Import the necessary libraries
import { defineStore } from "pinia";
import axios from "axios";
// Define a new store called "useAuthStore"
export const useAuthStore = defineStore({
  // Assign an ID to the store
  id: "auth",
  // Define the initial state of the store
  state: () => ({
    accessToken: null, // Initially, the access token is null
  }),
  // Define a getter to check if the user is logged in
  getters: {
    isLoggedIn() {
      return this.accessToken !== null; // User is logged in if accessToken is not
      null;
    },
  },
  // Define actions to set, remove and logout the access token
  actions: {
    setAccessToken(token) {
      this.accessToken = token; // Set the access token
    },
    removeAccessToken() {
      this.accessToken = null; // Remove the access token
    },
    logout() {
      try {
        // Send a post request to the logout endpoint
        axios.post("http://localhost:8000/api/logout");
        // Remove the access token
        this.removeAccessToken();
        // Log a message indicating that the logout was successful
        console.log("Logout successful");
      } catch (error) {
        // Log an error message if an error occurred during logout
        console.error("An error occurred during logout:", error.message);
      }
    },
  },
});
