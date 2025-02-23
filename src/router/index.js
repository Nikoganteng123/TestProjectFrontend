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

import UjiKompetensi from "@/components/UjiKompetensi.vue";
import soal1 from "@/components/soal1.vue";
import soal2 from "@/components/soal2.vue";
import soal3 from "@/components/soal3.vue";
import soal4 from "@/components/soal4.vue";
import soal5 from "@/components/soal5.vue";
import soal6 from "@/components/soal6.vue";
import soal7 from "@/components/soal7.vue";
// import soal8 from "@/components/soal8.vue";
import soal9 from "@/components/soal9.vue";
// import soal10 from "@/components/soal10.vue";
// import soal11 from "@/components/soal11.vue";
// import soal12 from "@/components/soal12.vue";
// import soal13 from "@/components/soal13.vue";
// import soal14 from "@/components/soal14.vue";
// import soal15 from "@/components/soal15.vue";
// import soal16 from "@/components/soal16.vue";
// import soal17 from "@/components/soal17.vue";


// Create a router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Soal 1
    {
      path: "/soal-1",
      name: "soal-1",
      component: soal1,
    },
    // Soal 2
    {
      path: "/soal-2",
      name: "soal-2",
      component: soal2,
    },
    // Soal 3
    {
      path: "/soal-3",
      name: "soal-3",
      component: soal3,
    },
    // Soal 4
    {
      path: "/soal-4",
      name: "soal-4",
      component: soal4,
    },
    // Soal 5
    {
      path: "/soal-5",
      name: "soal-5",
      component: soal5,
    },
    // Soal 6
    {
      path: "/soal-6",
      name: "soal-6",
      component: soal6,
    },
    //Soal 7
{
  path: "/soal-7",
  name: "soal-7",
  component: soal7,
},
// // Soal 8
// {
//   path: "/soal-8",
//   name: "soal-8",
//   component: soal8,
// },
// Soal 9
{
  path: "/soal-9",
  name: "soal-9",
  component: soal9,
},
// // Soal 10
// {
//   path: "/soal-10",
//   name: "soal-10",
//   component: soal10,
// },
// // Soal 11
// {
//   path: "/soal-11",
//   name: "soal-11",
//   component: soal11,
// },
// // Soal 12
// {
//   path: "/soal-12",
//   name: "soal-12",
//   component: soal12,
// },
// // Soal 13
// {
//   path: "/soal-13",
//   name: "soal-13",
//   component: soal13,
// },
// // Soal 14
// {
//   path: "/soal-14",
//   name: "soal-14",
//   component: soal14,
// },
// // Soal 15
// {
//   path: "/soal-15",
//   name: "soal-15",
//   component: soal15,
// },
// // Soal 16
// {
//   path: "/soal-16",
//   name: "soal-16",
//   component: soal16,
// },
// // Soal 17
// {
//   path: "/soal-17",
//   name: "soal-17",
//   component: soal17,
// },

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
    {
      path: "/uji-kompetensi",
      name: "ujikompetensi",
      component: UjiKompetensi,
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
      path: "/forgot-password",
      name: "forgot-password",
      component: ForgotPassword,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (authStore.isLoggedIn) {
          next({ name: "home" }); // If already logged in, redirect to home page
        } else {
          next(); // Continue to forgot-password page
        }
      },
    },
    {
        path: "/reset-password",
        name: "reset-password",
        component: ResetPassword,
        beforeEnter: (to, from, next) => {
          const email = to.query.email;
          
          // Check if the email exists in query params (to ensure it comes from /forgot-password)
          if (!email) {
            alert("You must come from the Forgot Password page to reset your password.");
            next({ name: "forgot-password" }); // Redirect to forgot-password if email is not provided
          } else {
            next(); // Proceed to reset-password page if email is present
          }
        },
    },
  ],
});

// Add global navigation guards to the router
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const publicPages = ["login", "register", "home", "forgot-password", "reset-password", "soal-3"]; // Public pages
  const authRequired = !publicPages.includes(to.name); // Other pages require authentication

  if (authRequired && !authStore.isLoggedIn) {
    // If the user is not logged in and trying to access a protected page
    alert("Please log in to access the page.");
    next({ name: "login" }); // Redirect to login page
  } else {
    next(); // Allow navigation to the page
  }
});

export default router;
