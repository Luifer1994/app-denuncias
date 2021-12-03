import { createRouter, createWebHistory } from "vue-router";

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
      import(/* webpackChunkName: "complaints" */ "../views/DetailComplaint.vue"),
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
    path: "/informers",
    name: "Informers",
    component: () =>
      import(/* webpackChunkName: "informers" */ "../views/Informers.vue"),
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

function existToken() {
  if (localStorage.getItem("token")) {
    return true;
  }
}

router.beforeEach((to, from, next) => {
  var isLogin = existToken();
  if (isLogin) {
    next();
  } else {
    if (to.name === "Login") {
      next();
    } else {
      next("login");
    }
  }
});

export default router;
