import type { RouteLocationNormalized } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to: RouteLocationNormalized) => {
  const visitedBefore = localStorage.getItem("visitedBefore") === "true";

  if (to.path === "/" && visitedBefore) {
    return { path: "/progress" };
  }

  if (to.path !== "/" && !visitedBefore) {
    return { path: "/" };
  }
});

export default router;
