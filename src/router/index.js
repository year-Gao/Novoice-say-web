import { createRouter, createWebHistory } from "vue-router";
import Community from "../views/Community.vue";
import Talking from "../views/Talking.vue";
import Resource from "../views/Resource.vue";
import News from "../views/News.vue";
import Test from "../views/Test.vue";
import Develop from "../views/Develop.vue";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import History from '../views/History.vue'
import Myswl from '../views/Myswl.vue'
import About from '../views/About.vue'
import Register from '../views/Register.vue'
// import { compile } from "vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/history",
    name: "History",
    component: History,
    meta: { requiresAuth: true },
  },
  {
    path: "/myswl",
    name: "Myswl",
    component: Myswl,
    meta: { requiresAuth: true },
  },
  {
    path: "/about",
    name: "About",
    component: About,
    meta: { requiresAuth: true },
  },
  {
    path: "/community",
    name: "Community",
    component: Community,
    meta: { requiresAuth: true },
  },
  {
    path: "/talking",
    name: "Talking",
    component: Talking,
    meta: { requiresAuth: true },
  },
  {
    path: "/resource",
    name: "Resource",
    component: Resource,
    meta: { requiresAuth: true },
  },
  {
    path: "/news",
    name: "News",
    component: News,
    meta: { requiresAuth: true },
  },
  {
    path: "/test",
    name: "Test",
    component: Test,
    meta: { requiresAuth: true },
  },
  {
    path: "/develop",
    name: "Develop",
    component: Develop,
    meta: { requiresAuth: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/nogood',
    name: 'Nogood',
    component: () => import('../views/Nogood.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/nogood'
  },
  {
    path: '/result',
    name: 'TestResult',
    component: () => import('../views/TestResult.vue')
  },
  {
    path: '/testshow',
    name: 'Testshow',
    component: () => import('../views/Testshow.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } 
  else if (isLoggedIn && to.path === '/login') {
    next('/')
  }
  else {
    next()
  }
});

export default router;
