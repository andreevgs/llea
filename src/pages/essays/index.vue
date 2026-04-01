<template>
  <v-container class="fill-height" v-if="!essays.length">
    <v-row>
      <v-col cols="12" class="d-flex flex-column justify-center flex-grow-1">
        <v-icon
          class="align-self-center mb-2"
          icon="mdi-book-open-page-variant"
          color="warning"
          style="font-size: 6em"
        ></v-icon>
        <p class="align-self-center text-disabled mb-4">
          {{ $t("essays.no_data") }}
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
    <v-row>
      <v-col cols="12" v-for="essay in essays" v-bind:key="essay.id">
        <v-card
          :ripple="false"
          link
          :to="{ name: '/essays/[id]', params: { id: essay.id } }"
        >
          <v-card-item>
            <v-card-subtitle class="d-flex flex-row ga-2 align-center">
              <v-tooltip
                :text="`${$t('essays.grammar_estimation_label')}: ${essay.grammarQuality.estimation} ${$t('essays.out_of_10')}`"
              >
                <template v-slot:activator="{ props }">
                  <v-chip
                    v-bind="props"
                    variant="tonal"
                    :color="
                      getEstimationChipColor(essay.grammarQuality.estimation)
                    "
                    class="cursor-pointer"
                    prepend-icon="mdi-star"
                  >
                    {{ essay.grammarQuality.estimation }}
                  </v-chip>
                </template>
              </v-tooltip>
              <v-tooltip
                v-if="essay.numOfSentencesWithMistakes"
                :text="`${essay.numOfSentencesWithMistakes} ${$t('essays.sentences_with_mistakes_label', essay.numOfSentencesWithMistakes)}`"
              >
                <template v-slot:activator="{ props }">
                  <v-chip
                    v-bind="props"
                    prepend-icon="mdi-alert"
                    variant="tonal"
                    color="warning"
                    class="cursor-pointer"
                  >
                    {{ essay.numOfSentencesWithMistakes }}
                  </v-chip>
                </template>
              </v-tooltip>
              <v-tooltip
                v-if="essay.isTranslatorUsed"
                :text="$t('essays.translator_used_label')"
              >
                <template v-slot:activator="{ props }">
                  <v-chip
                    v-bind="props"
                    variant="tonal"
                    color="primary"
                    class="cursor-pointer"
                  >
                    <v-icon>mdi-translate</v-icon>
                  </v-chip>
                </template>
              </v-tooltip>
              <v-spacer></v-spacer>
              <span>{{
                formatRelativeDate(
                  essay.date,
                  languagesStore.currentLanguage as SupportedLocale,
                )
              }}</span>
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            {{ essay.text }}
          </v-card-text>
          <div class="pb-4 px-4 d-flex flex-row ga-2">
            <v-chip class="cursor-pointer">
              {{ essay.analyzedSentences.length }} {{ $t('essays.sentences_label', essay.analyzedSentences.length) }}
            </v-chip>
            <v-chip class="cursor-pointer">
              {{ essay.numOfWords }} {{ $t('essays.words_label', essay.numOfWords) }}
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineBasicLoader } from "unplugin-vue-router/data-loaders/basic";
import { useLanguagesStore } from "@/stores/languages";
import { essaysService as essaysRepository } from "@/services/essaysService";

const languagesStore = useLanguagesStore();
export const useEssaysData = defineBasicLoader("/essays/", async () => {
  const essays = await essaysRepository.getAllByIndex(
    "languagePair",
    {
      currentLanguage: languagesStore.currentLanguage,
      targetLanguage: languagesStore.targetLanguage,
    },
    "prev",
  );
  return essays;
});
</script>

<script setup lang="ts">
import { getEstimationChipColor } from "@/utils/chip";
import { watch } from "vue";
import { formatRelativeDate } from "@/utils/date";
import type { SupportedLocale } from "@/i18n";
const { data: essays, reload } = useEssaysData();
watch(languagesStore, () => {
  reload();
});
</script>

<style scoped></style>
