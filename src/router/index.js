import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/index",
    name: "Index",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/index.vue"),
    meta: {
      requireAuth: true
    }
  }
];

const router = new VueRouter({
  routes
});

export default router;
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    //判断该路由是否需要登录权限
    if (sessionStorage.getItem("token")) {
      //判断本地是否存在token
      next();
    } else {
      next({
        path: "/"
      });
    }
  } else {
    next();
  }
});
