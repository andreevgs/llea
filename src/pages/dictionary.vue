<template>
  <v-container
    v-if="dictionary.length === 0"
    class="fill-height"
  >
    <div class="h-100 d-flex flex-column justify-center flex-grow-1">
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
        rounded
        to="/new-essay"
        variant="tonal"
      >
        {{ $t("app_bar.new_essay") }}
      </v-btn>
    </div>
  </v-container>
  <v-container
    v-else
    class="pa-0"
  >
    <v-data-table
      v-model:items-per-page="itemsPerPage"
      v-model:page="pageNumber"
      :headers="tableHeaders"
      hover
      :items="dictionary"
      :items-per-page-options="itemsPerPageOptions"
      :items-per-page-text="$t('dictionary.table.items_per_page')"
      :page-text="$t('dictionary.table.page_text', { pageNumber, pagesCount })"
    />
  </v-container>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { useDictionary } from "@/composables/useDictionary";

  const { t } = useI18n();
  const { dictionary } = useDictionary();

  const tableHeaders = computed(() => [
    {
      title: t("dictionary.table.headers.word"),
      key: "word",
    },
    {
      title: t("dictionary.table.headers.pronunciation"),
      key: "pronunciation",
    },
    {
      title: t("dictionary.table.headers.translation"),
      key: "translate",
    },
  ]);

  const itemsPerPageOptions = [20, 40, 60, 100];
  const itemsPerPage = ref(itemsPerPageOptions[0]);
  const pageNumber = ref(1);
  const pagesCount = computed(() => {
    return Math.ceil(dictionary.value.length / itemsPerPage.value);
  });
</script>

<style scoped></style>
