<template>
  <v-container class="fill-height" v-if="!dictionary.length">
    <v-row>
      <v-col cols="12" class="d-flex flex-column justify-center flex-grow-1">
        <v-icon
          class="align-self-center mb-2"
          icon="mdi-book-alert"
          color="warning"
          style="font-size: 6em"
        ></v-icon>
        <p class="align-self-center text-disabled mb-4">
          {{ $t("dictionary.no_data") }}
        </p>
        <v-btn
          to="/new-essay"
          class="align-self-center"
          variant="tonal"
          color="warning"
          >{{ $t("app_bar.new_essay") }}</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
  <v-container class="pa-0" v-else>
    <v-data-table
      v-model:page="pageNumber"
      v-model:items-per-page="itemsPerPage"
      :items-per-page-options="itemsPerPageOptions"
      :headers="tableHeaders"
      :items="dictionary"
      items-per-page-text="Слов на странице"
      :page-text="`Страница ${pageNumber} из ${pagesCount}`"
      hover
    ></v-data-table>
  </v-container>
</template>

<script lang="ts">
import { defineBasicLoader } from "unplugin-vue-router/data-loaders/basic";
import { dictionaryEntriesService } from "@/services/dictionaryEntriesService";
import { useLanguagesStore } from "@/stores/languages";

const languagesStore = useLanguagesStore();
export const useDictionaryData = defineBasicLoader("/dictionary", async () => {
  return await dictionaryEntriesService.getAllByIndex(
    "languagePair",
    {
      currentLanguage: languagesStore.currentLanguage,
      targetLanguage: languagesStore.targetLanguage,
    },
    "prev",
  );
});
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const { data: dictionary, reload } = useDictionaryData();
watch(languagesStore, () => {
  reload();
});
const tableHeaders = [
  {
    title: "Слово",
    key: "word",
  },
  {
    title: "Произношение",
    key: "pronunciation",
  },
  {
    title: "Перевод",
    key: "translate",
  },
];

const itemsPerPageOptions = [20, 40, 60, 100];
const itemsPerPage = ref(itemsPerPageOptions[0]);
const pageNumber = ref(1);
const pagesCount = computed(() => {
  return Math.ceil(dictionary.value.length / itemsPerPage.value);
});
</script>

<style scoped></style>
