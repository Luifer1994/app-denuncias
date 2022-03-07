import { createRouter, createWebHistory } from "vue-router";
import axios from "axios";
const routes = [
  {
    path: "/",
    name: "complaints",
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/Complaints.vue"),
  },
  {
    path: "/complaint/:id",
    name: "DetailComplaint",
    component: () =>
      import(
        /* webpackChunkName: "complaints" */ "../views/DetailComplaint.vue"
      ),
  },
  {
    path: "/perfil",
    name: "Perfil",
    component: () =>
      import(/* webpackChunkName: "perfil" */ "../components/Perfil.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/forgot-password",
    name: "Forgot",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/ForgotPassword.vue"),
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/ResetPassword.vue"),
  },
  {
    path: "/informers",
    name: "Informers",
    component: () =>
      import(/* webpackChunkName: "informers" */ "../views/Informers.vue"),
  },
  {
    path: "/officials",
    name: "Officials",
    component: () =>
      import(/* webpackChunkName: "informers" */ "../views/Officials.vue"),
  },
  {
    path: "/complaints",
    name: "Complaints",
    component: () =>
      import(/* webpackChunkName: "complaints" */ "../views/Complaints.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

async function validateSesion() {
  const urlApi = process.env.VUE_APP_URL_API;
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(urlApi + "validate-sesion", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data) {
      return true;
    }
  } catch (error) {
    if (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("vuex");
      window.location.reload();
    }
  }
}

function existToken() {
  if (localStorage.getItem("token")) {
    return true;
  }
}

router.beforeEach((to, from, next) => {
  var isLogin = existToken();
  if (isLogin && validateSesion()) {
    next();
  } else {
    if (
      to.name === "Login" ||
      to.name === "Forgot" ||
      to.name === "ResetPassword"
    ) {
      next();
    } else {
      next("login");
    }
  }
});

export default router;
