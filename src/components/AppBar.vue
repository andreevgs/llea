<template>
  <v-app-bar
    class="position-fixed top-0 left-0 border-b"
    flat
  >
    <template #prepend>
      <v-app-bar-title class="ps-2 ps-md-5"> LLEA </v-app-bar-title>
    </template>
    <template #append>
      <v-btn
        class="mr-2"
        prepend-icon="mdi-chart-box"
        to="/progress"
      >
        {{ $t("app_bar.progress") }}
      </v-btn>
      <v-btn
        class="mr-2"
        prepend-icon="mdi-list-box-outline"
        to="/essays"
      >
        {{ $t("app_bar.essays") }}
      </v-btn>
      <v-btn
        class="mr-2"
        prepend-icon="mdi-book-alphabet"
        to="/dictionary"
      >
        {{ $t("app_bar.dictionary") }}
      </v-btn>
      <v-tooltip
        location="bottom"
        :text="toggleThemeButtonTooltip"
      >
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            class="mr-1"
            icon="mdi-theme-light-dark"
            @click="toggleTheme()"
          />
        </template>
      </v-tooltip>
      <v-tooltip
        location="bottom"
        text="Настройки"
      >
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            class="mr-2"
            icon="mdi-cog"
            @click="isSettingsModalOpen = true"
          />
        </template>
      </v-tooltip>
      <v-btn
        :append-icon="`$flag-${languagesStore.targetLanguage}`"
        color="primary"
        :prepend-icon="`$flag-${languagesStore.currentLanguage}`"
        variant="tonal"
        @click="isChangeLanguagesModalOpen = true"
      >
        /
        <v-tooltip
          activator="parent"
          location="bottom"
        >{{ $t("app_bar.switch_languages") }}
        </v-tooltip>
      </v-btn>
      <v-divider
        class="my-4 mx-4"
        vertical
      />
      <v-btn
        class="mr-2"
        color="primary"
        prepend-icon="mdi-plus"
        to="/new-essay"
        variant="tonal"
      >
        {{ $t("app_bar.new_essay") }}
      </v-btn>
      <change-languages-dialog v-model="isChangeLanguagesModalOpen" />
      <settings-dialog v-model="isSettingsModalOpen" />
    </template>
  </v-app-bar>
</template>
<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { useTheme } from "vuetify";
  import ChangeLanguagesDialog from "@/components/ChangeLanguagesDialog.vue";
  import SettingsDialog from "@/components/SettingsDialog.vue";
  import { useLanguagesStore } from "@/stores/languages";
  const isChangeLanguagesModalOpen = ref(false);
  const isSettingsModalOpen = ref(false);

  const theme = useTheme();
  const { t } = useI18n();
  const languagesStore = useLanguagesStore();

  const toggleTheme = () => {
    theme.global.name.value = theme.global.current.value.dark
      ? "light"
      : "dark";
  };

  const toggleThemeButtonTooltip = computed((): string => {
    return theme.global.current.value.dark
      ? t("app_bar.light_theme")
      : t("app_bar.dark_theme");
  });
</script>
