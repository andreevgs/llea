import { createVuetify } from "vuetify";
import { mdi } from "vuetify/iconsets/mdi";

import { aliases, flagsIcons } from "@/flags";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

export default createVuetify({
  theme: {
    defaultTheme: "dark",
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
      flags: flagsIcons,
    },
  },
});
