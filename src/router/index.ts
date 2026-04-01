import {
  createRouter,
  createWebHashHistory,
  RouteLocationNormalized,
} from "vue-router/auto";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
});

router.beforeEach((to: RouteLocationNormalized) => {
  if (to.name === "/" && localStorage.getItem("visitedBefore") === "true") {
    return { name: "/progress" };
  } else if (
    to.name !== "/" &&
    localStorage.getItem("visitedBefore") !== "true"
  ) {
    return { name: "/" };
  }
});
export default router;
