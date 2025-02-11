import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage.vue";
import ProductCreate from "@/components/ProductCreate.vue";
import ProductDetails from "@/components/ProductDetails.vue";
import ProductEdit from "@/components/ProductEdit.vue";

import UserCreate from "@/components/UserCreate.vue";
import UserDetails from "@/components/UserDetails.vue";
import UserEdit from "@/components/UserEdit.vue";
import Profile from "@/components/Profile.vue";

import Login from "@/components/Login.vue";
import { useAuthStore } from "@/stores/auth";
import Register from "@/components/Register.vue";
import ForgotPassword from "@/components/ForgotPassword.vue";
import ResetPassword from "@/components/ResetPassword.vue";

// Create a router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Home route
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    // Login route
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    // Create product route
    {
      path: "/create",
      name: "productcreate",
      component: ProductCreate,
    },
    // Product details route
    {
      path: "/product/:id",
      name: "productdetail",
      component: ProductDetails,
    },
    // Edit product route
    {
      path: "/product/:id/edit",
      name: "productedit",
      component: ProductEdit,
    },
    // Sisi Profile
    {
      path: "/users",
      name: "userlist",
      component: Profile,
    },
    // Create user route
    {
      path: "/users/create",
      name: "usercreate",
      component: UserCreate,
    },
    // User details route
    {
      path: "/users/:id",
      name: "userdetail",
      component: UserDetails,
    },
    // Edit user route
    {
      path: "/users/:id/edit",
      name: "useredit",
      component: UserEdit,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/forgot",
      name: "forgot",
      component: ForgotPassword,
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: ResetPassword,
    },
  ],
});

// Add global navigation guards to the router
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const publicPages = ["login", "register", "home", "userlist", "forgot", "reset-password"]; // Halaman yang boleh diakses tanpa login
  const authRequired = !publicPages.includes(to.name); // Halaman lain butuh login

  if (authRequired && !authStore.isLoggedIn) {
    // Tampilkan pop-up jika pengguna belum login
    alert("Silakan login terlebih dahulu agar bisa mengakses halaman yang Anda pilih.");
    next({ name: "login" }); // Arahkan ke halaman login
  } else {
    next(); // Jika sudah login atau halaman public, lanjutkan
  }
});

// Export the router instance
export default router;
