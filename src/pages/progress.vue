<template>
  <v-container class="fill-height" v-if="!progressData.progressEntry">
    <v-row>
      <v-col cols="12" class="d-flex flex-column justify-center flex-grow-1">
        <v-icon
          class="align-self-center mb-2"
          icon="mdi-reload-alert"
          color="warning"
          style="font-size: 6em"
        ></v-icon>
        <p class="align-self-center text-disabled mb-4">
          {{ $t("progress.no_data") }}
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
    <v-card>
      <v-card-title class="d-flex align-center ga-2">
        <v-icon :icon="`$flag-${languagesStore.targetLanguage}`"></v-icon>
        <span>{{ progressData.progressEntry.points }}/100 {{ $t('progress.points_label', progressData.progressEntry.points) }}</span>
      </v-card-title>
      <v-card-subtitle
        v-if="progressData.progressHistory && progressPointsDelta"
      >
        <v-chip
          variant="tonal"
          :color="progressPointsDelta > 0 ? 'success' : 'error'"
        >
          <span>
            <strong v-if="progressPointsDelta > 0">
              +{{ progressPointsDelta }} {{ $t('progress.points_label', progressPointsDelta) }}
            </strong>
            <strong v-else>{{ progressPointsDelta }} {{ $t('progress.points_label', Math.abs(progressPointsDelta)) }}</strong>
            {{ progressPointsDeltaUpdateDate }}</span>
        </v-chip>
      </v-card-subtitle>
      <v-row class="px-4 py-3">
        <v-col cols="12">
          <v-alert type="info" color="secondary" variant="tonal">
            <template v-slot:text>
              <span
                v-html="$t('progress.info_text')"></span>
            </template>
          </v-alert>
        </v-col>
        <v-col cols="12">
          <v-progress-linear
            :model-value="progressData.progressEntry.points"
            color="secondary"
            height="24"
            rounded
          >
            <template v-slot:default="{ value }">
              <v-spacer></v-spacer>
              <span class="pr-4">{{ Math.ceil(value) }}/100</span>
            </template>
          </v-progress-linear>
        </v-col>
        <v-col cols="12">
          <v-alert
            type="warning"
            variant="tonal"
            border="start"
            :title="$t('progress.essays_without_mistakes_title')"
          >
            <template v-slot:text>
              <div class="mb-2">
                <span>{{ $t('progress.grammar_improvement_recommendation') }}</span>
              </div>
              <v-progress-linear
                :model-value="progressData.essaysWithoutMistakes.totalCount ? (progressData.essaysWithoutMistakes.count / progressData.essaysWithoutMistakes.totalCount) * 100 : 0"
                color="inherit"
                height="24"
                rounded
              >
                <template v-slot:default>
                  <v-spacer></v-spacer>
                  <span class="pr-4 progress-bar__label">{{ progressData.essaysWithoutMistakes.count }}/{{ progressData.essaysWithoutMistakes.totalCount }}</span>
                </template>
              </v-progress-linear>
            </template>
          </v-alert>
        </v-col>
        <v-col cols="12">
          <v-alert
            :type="getProgressColor(essaysWithoutTranslatorProgress)"
            variant="tonal"
            border="start"
            icon="mdi-translate-off"
            :title="$t('progress.essays_without_translator_title')"
          >
            <template v-slot:text>
              <div class="mb-2">
                <span>{{
                  getTranslatorProgressRecommendation(
                    essaysWithoutTranslatorProgress,
                  )
                }}</span>
              </div>
              <v-progress-linear
                :model-value="essaysWithoutTranslatorProgress"
                color="inherit"
                height="24"
                rounded
              >
                <template v-slot:default>
                  <v-spacer></v-spacer>
                  <span class="pr-4 progress-bar__label"
                    >{{ progressData.essaysWithoutTranslator.count }}/{{
                      progressData.essaysWithoutTranslator.totalCount
                    }}</span
                  >
                </template>
              </v-progress-linear>
            </template>
          </v-alert>
        </v-col>
        <v-col cols="12">
          <v-alert
            :type="getProgressColor(progressData.averageGrammarEstimation * 10)"
            variant="tonal"
            icon="mdi-star"
            border="start"
            :title="$t('progress.average_grammar_estimation_title')"
          >
            <template v-slot:text>
              <div class="mb-2">
                <span>{{
                  getAverageGrammarEstimationProgressRecommendation(
                    progressData.averageGrammarEstimation * 10,
                  )
                }}</span>
              </div>
              <v-progress-linear
                :model-value="progressData.averageGrammarEstimation * 10"
                color="inherit"
                height="24"
                rounded
              >
                <template v-slot:default>
                  <v-spacer></v-spacer>
                  <span class="pr-4 progress-bar__label"
                    >{{ progressData.averageGrammarEstimation }}/10</span
                  >
                </template>
              </v-progress-linear>
            </template>
          </v-alert>
        </v-col>
      </v-row>
      <!-- <v-card-actions>
        <v-btn prepend-icon="mdi-share">{{ $t('progress.buttons.share') }}</v-btn>
        <v-btn prepend-icon="mdi-export-variant">{{ $t('progress.buttons.export') }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="error" prepend-icon="mdi-cancel">{{ $t('progress.buttons.reset') }}</v-btn>
      </v-card-actions> -->
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { useLanguagesStore } from "@/stores/languages";
import { defineBasicLoader } from "unplugin-vue-router/data-loaders/basic";
import { progressEntriesService } from "@/services/progressEntriesService";
import { progressHistoryService } from "@/services/progressHistoryService";
import { ProgressEntry } from "@/services/progressEntriesService";
import { ProgressHistory } from "@/services/progressHistoryService";
import { CountResult, getDefaultCountResult } from "@/utils/db";
import { essaysService } from "@/services/essaysService";

interface ProgressData {
  progressEntry: ProgressEntry | null;
  progressHistory: ProgressHistory | null;
  essaysWithoutMistakes: CountResult;
  essaysWithoutTranslator: CountResult;
  averageGrammarEstimation: number;
}

const languagesStore = useLanguagesStore();

export const useProgressData = defineBasicLoader("/progress", async () => {
  const progressData: ProgressData = {
    progressEntry: null,
    progressHistory: null,
    essaysWithoutMistakes: getDefaultCountResult(),
    essaysWithoutTranslator: getDefaultCountResult(),
    averageGrammarEstimation: 0,
  };
  const progressEntries = await progressEntriesService.getAllByIndex(
    "languagePair",
    {
      currentLanguage: languagesStore.currentLanguage,
      targetLanguage: languagesStore.targetLanguage,
    },
    "prev",
  );
  if (progressEntries.length) progressData.progressEntry = progressEntries[0];
  const progressHistory = await progressHistoryService.getAllByIndex(
    "languagePair",
    {
      currentLanguage: languagesStore.currentLanguage,
      targetLanguage: languagesStore.targetLanguage,
    },
    "prev",
  );
  if (progressHistory.length) progressData.progressHistory = progressHistory[0];
  const reduceResult = await essaysService.reduceByIndex(
    "languagePair",
    {
      currentLanguage: languagesStore.currentLanguage,
      targetLanguage: languagesStore.targetLanguage,
    },
    "prev",
    (acc, essay) => {
      acc.totalSentences += essay.analyzedSentences.length;
      acc.errorSentences += essay.numOfSentencesWithMistakes;
      return acc;
    },
    { totalSentences: 0, errorSentences: 0 }
  );

  progressData.essaysWithoutMistakes = {
    count: reduceResult.totalSentences - reduceResult.errorSentences,
    totalCount: reduceResult.totalSentences,
  };

  const essaysWithoutTranslatorCountResult =
    await essaysService.getAllByIndexAndCount(
      "languagePair",
      {
        currentLanguage: languagesStore.currentLanguage,
        targetLanguage: languagesStore.targetLanguage,
      },
      "prev",
      { isTranslatorUsed: false },
    );
  progressData.essaysWithoutTranslator = essaysWithoutTranslatorCountResult;
  const averageGrammarEstimation = await essaysService.getAllByIndexAVG(
    "languagePair",
    {
      currentLanguage: languagesStore.currentLanguage,
      targetLanguage: languagesStore.targetLanguage,
    },
    "prev",
    "grammarQuality.estimation",
  );
  progressData.averageGrammarEstimation = averageGrammarEstimation;
  console.log(progressData);
  return progressData;
});
</script>
<script setup lang="ts">
import { computed, watch } from "vue";
import { formatRelativeDate } from "@/utils/date";
import type { SupportedLocale } from "@/i18n";
import {
  getAverageGrammarEstimationProgressRecommendation,
  getProgressColor,
  getTranslatorProgressRecommendation,
} from "@/utils/progress";

const { data: progressData, reload: reloadProgressData } = useProgressData();

const progressPointsDelta = computed(() => {
  if (!progressData.value.progressHistory) return null;
  return (
    progressData.value.progressHistory.newPointsValue -
    progressData.value.progressHistory.previousPointsValue
  );
});

const progressPointsDeltaUpdateDate = computed(() => {
  if (!progressData.value.progressHistory) return null;
  return formatRelativeDate(
    progressData.value.progressHistory.date,
    languagesStore.currentLanguage as SupportedLocale,
  );
});

const essaysWithoutTranslatorProgress = computed(() => {
  return (
    (progressData.value.essaysWithoutTranslator.count /
      progressData.value.essaysWithoutTranslator.totalCount) *
    100
  );
});

watch(languagesStore, () => {
  reloadProgressData();
});
</script>
<style scoped></style>
