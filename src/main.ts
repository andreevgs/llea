/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import i18n from "@/i18n";
import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App);

registerPlugins(app);
app.use(i18n);
app.use(pinia);
app.mount("#app");
