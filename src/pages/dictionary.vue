<template>
  <v-container v-if="dictionary.length === 0" class="fill-height">
    <v-row>
      <v-col class="d-flex flex-column justify-center flex-grow-1" cols="12">
        <v-icon
          class="align-self-center mb-2"
          color="warning"
          icon="mdi-book-alert"
          style="font-size: 6em"
        />
        <p class="align-self-center text-disabled mb-4">
          {{ $t("dictionary.no_data") }}
        </p>
        <v-btn
          class="align-self-center"
          color="warning"
          to="/new-essay"
          variant="tonal"
        >{{ $t("app_bar.new_essay") }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else class="pa-0">
    <v-data-table
      v-model:items-per-page="itemsPerPage"
      v-model:page="pageNumber"
      :headers="tableHeaders"
      hover
      :items="dictionary"
      :items-per-page-options="itemsPerPageOptions"
      items-per-page-text="Слов на странице"
      :page-text="`Страница ${pageNumber} из ${pagesCount}`"
    />
  </v-container>
</template>

<script lang="ts">
  import { computed, ref, watch } from "vue";
  import { defineBasicLoader } from "vue-router/experimental";
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
