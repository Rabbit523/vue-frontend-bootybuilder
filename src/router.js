import Vue from "vue";
import VueRouter from "vue-router";
import AuthRequired from "./utils/AuthRequired";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "home" */ "./views/home"),
    redirect: "/app/dashboard"
  },
  {
    path: "/app",
    component: () => import(/* webpackChunkName: "app" */ "./views/app"),
    redirect: "/app/dashboard",
    beforeEnter: AuthRequired,
    children: [
      {
        path: "dashboard",
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "./views/app/dashboard")
      },
      {
        path: "categories",
        component: () =>
          import(/* webpackChunkName: "categories" */ "./views/app/categories")
      },
      {
        path: "exercises",
        component: () =>
          import(/* webpackChunkName: "exercises" */ "./views/app/exercises")
      },
      {
        path: "workouts",
        component: () =>
          import(/* webpackChunkName: "workouts" */ "./views/app/workouts")
      },
      {
        path: "accounts",
        component: () =>
          import(/* webpackChunkName: "accounts" */ "./views/app/accounts")
      },
      {
        path: "add-new-category",
        component: () =>
          import(/* webpackChunkName: "add-new-category" */ "./views/app/categories/AddNewCategory")
      },
      {
        path: "add-new-workout",
        component: () =>
          import(/* webpackChunkName: "add-new-workout" */ "./views/app/workouts/AddNewWorkout")
      },
      {
        path: "add-new-exercise",
        component: () =>
          import(/* webpackChunkName: "add-new-exercise" */ "./views/app/exercises/AddNewExercise")
      },
      {
        path: "manage-category",
        component: () =>
          import(/* webpackChunkName: "add-new-category" */ "./views/app/categories/ManageCategory")
      },
      {
        path: "manage-workout",
        component: () =>
          import(/* webpackChunkName: "add-new-workout" */ "./views/app/workouts/ManageWorkout")
      },
      {
        path: "manage-exercise",
        component: () =>
          import(/* webpackChunkName: "add-new-exercise" */ "./views/app/exercises/ManageExercise")
      },
      {
        path: "settings",
        component: () =>
          import(/* webpackChunkName: "settings" */ "./views/app/settings")
      }
    ]
  },
  {
    path: "/error",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  },
  {
    path: "/user",
    component: () => import(/* webpackChunkName: "user" */ "./views/user"),
    redirect: "/user/login",
    children: [
      {
        path: "login",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/Login")
      },
      {
        path: "forgot-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ForgotPassword")
      },
      {
        path: "reset-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ResetPassword")
      },
      {
        path: "change-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ChangePassword")
      }
    ]
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  }
];

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history"
});

export default router;
