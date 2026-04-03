<template>
  <v-dialog v-model="model" persistent style="max-width: 500px">
    <v-card>
      <div>
        <v-toolbar dark>
          <v-btn dark icon @click="model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{
            $t("change_langs_dialog.header")
          }}</v-toolbar-title>
        </v-toolbar>
        <div class="pa-4">
          <form @submit.prevent="handleChangeLanguages">
            <v-autocomplete
              v-model="newCurrentLang"
              :clearable="false"
              item-title="name"
              item-value="code"
              :items="langsList"
              :label="$t('change_langs_dialog.select_current_lang_label')"
            >
              <template #chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :prepend-icon="`$flag-${item.code}`"
                  :text="item.name"
                />
              </template>
              <template #item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-icon="`$flag-${item.code}`"
                  :title="item.name"
                />
              </template>
            </v-autocomplete>
            <v-autocomplete
              v-model="newTargetLang"
              :clearable="false"
              item-title="name"
              item-value="code"
              :items="langsList"
              :label="$t('change_langs_dialog.select_target_lang_label')"
            >
              <template #chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :prepend-icon="`$flag-${item.code}`"
                  :text="item.name"
                />
              </template>
              <template #item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-icon="`$flag-${item.code}`"
                  :title="item.name"
                />
              </template>
            </v-autocomplete>
            <v-btn
              class="mb-2 w-100"
              color="primary"
              type="submit"
              variant="tonal"
              @click="model = false"
            >
              {{ $t("buttons.save") }}
            </v-btn>
            <v-btn
              class="w-100"
              color="error"
              variant="tonal"
              @click="handleCancel"
            >
              {{ $t("buttons.close") }}
            </v-btn>
          </form>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { useLanguagesStore } from "@/stores/languages";

  const model = defineModel<boolean>();

  const languagesStore = useLanguagesStore();

  const { locale, availableLocales, t } = useI18n();

  const newCurrentLang = ref<string>(languagesStore.currentLanguage);
  const newTargetLang = ref<string>(languagesStore.targetLanguage);

  const langsList = computed(() => {
    return availableLocales.map((code) => ({
      name: t(`change_langs_dialog.langs.${code}`),
      code,
    }));
  });
  const handleChangeLanguages = () => {
    languagesStore.setCurrentLanguage(newCurrentLang.value);
    languagesStore.setTargetLanguage(newTargetLang.value);
    locale.value = newCurrentLang.value;
  };

  const handleCancel = () => {
    model.value = false;
    newCurrentLang.value = languagesStore.currentLanguage;
    newTargetLang.value = languagesStore.targetLanguage;
  };
</script>

<style scoped></style>
