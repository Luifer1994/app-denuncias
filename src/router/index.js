import { createRouter, createWebHistory } from 'vue-router'


const routes = [{
        path: '/',
        name: 'Home',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../components/Dashboard.vue')
    },
    {
        path: '/perfil',
        name: 'Perfil',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../components/Perfil.vue')
    
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Login.vue')
    },
    {
        path: '/informers',
        name: 'Informers',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Informers.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

function existToken() {
    if (localStorage.getItem('token')) {
        return true;
    }
}

router.beforeEach((to, from, next) => {
    var isLogin = existToken();
    if (isLogin) {
        next()
    } else {
        if (to.name === 'Login') {
            next()
        } else {
            next('login')
        }
    }
});

export default router