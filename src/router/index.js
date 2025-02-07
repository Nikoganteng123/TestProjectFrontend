import { createRouter, createWebHistory } from "vue-router";
import ProductList from "@/components/ProductList.vue";
import ProductCreate from "@/components/ProductCreate.vue";
import ProductDetails from "@/components/ProductDetails.vue";
import ProductEdit from "@/components/ProductEdit.vue";

import UserCreate from "@/components/UserCreate.vue";
import UserDetails from "@/components/UserDetails.vue";
import UserEdit from "@/components/UserEdit.vue";
import UserList from "@/components/UserList.vue";

import Login from "@/components/Login.vue";
import { useAuthStore } from "@/stores/auth";

// Create a router instance with an array of route objects
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Home route
    {
      path: "/",
      name: "home",
      component: ProductList,
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
    // User list route
    {
      path: "/users",
      name: "userlist",
      component: UserList,
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
  ],
});

// Add global navigation guards to the router
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Biarkan akses ke login dan register meskipun belum login
  if (to.name === "login" || to.name === "register") {
    next();
  } else if (!authStore.isLoggedIn) {
    // Jika belum login dan mencoba mengakses halaman lain, arahkan ke login
    next({ name: "login" });
  } else {
    next();
  }
});
// Export the router instance
export default router;
