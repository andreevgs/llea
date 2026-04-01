/**
 * plugins/indexed-db-service.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import router from "../router";

// Types
import type { App } from "vue";
import { DataLoaderPlugin } from "vue-router/auto";

export function registerPlugins(app: App) {
  app.use(vuetify).use(DataLoaderPlugin, { router }).use(router);
}
