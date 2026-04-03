<template>
  <v-container v-if="!progressData.progressEntry" class="fill-height">
    <v-row>
      <v-col class="d-flex flex-column justify-center flex-grow-1" cols="12">
        <v-icon
          class="align-self-center mb-2"
          color="warning"
          icon="mdi-reload-alert"
          style="font-size: 6em"
        />
        <p class="align-self-center text-disabled mb-4">
          {{ $t("progress.no_data") }}
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
    <v-card>
      <v-card-title class="d-flex align-center ga-2">
        <v-icon :icon="`$flag-${languagesStore.targetLanguage}`" />
        <span>{{ progressData.progressEntry.points }}/100 {{ $t('progress.points_label', progressData.progressEntry.points) }}</span>
      </v-card-title>
      <v-card-subtitle
        v-if="progressData.progressHistory && progressPointsDelta"
      >
        <v-chip
          :color="progressPointsDelta > 0 ? 'success' : 'error'"
          variant="tonal"
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
          <v-alert color="secondary" type="info" variant="tonal">
            <template #text>
              <span
                v-html="$t('progress.info_text')"
              />
            </template>
          </v-alert>
        </v-col>
        <v-col cols="12">
          <v-progress-linear
            color="secondary"
            height="24"
            :model-value="progressData.progressEntry.points"
            rounded
          >
            <template #default="{ value }">
              <v-spacer />
              <span class="pr-4">{{ Math.ceil(value) }}/100</span>
            </template>
          </v-progress-linear>
        </v-col>
        <v-col cols="12">
          <v-alert
            border="start"
            :title="$t('progress.essays_without_mistakes_title')"
            type="warning"
            variant="tonal"
          >
            <template #text>
              <div class="mb-2">
                <span>{{ $t('progress.grammar_improvement_recommendation') }}</span>
              </div>
              <v-progress-linear
                color="inherit"
                height="24"
                :model-value="progressData.essaysWithoutMistakes.totalCount ? (progressData.essaysWithoutMistakes.count / progressData.essaysWithoutMistakes.totalCount) * 100 : 0"
                rounded
              >
                <template #default>
                  <v-spacer />
                  <span class="pr-4 progress-bar__label">{{ progressData.essaysWithoutMistakes.count }}/{{ progressData.essaysWithoutMistakes.totalCount }}</span>
                </template>
              </v-progress-linear>
            </template>
          </v-alert>
        </v-col>
        <v-col cols="12">
          <v-alert
            border="start"
            icon="mdi-translate-off"
            :title="$t('progress.essays_without_translator_title')"
            :type="getProgressColor(essaysWithoutTranslatorProgress)"
            variant="tonal"
          >
            <template #text>
              <div class="mb-2">
                <span>{{
                  getTranslatorProgressRecommendation(
                    essaysWithoutTranslatorProgress,
                  )
                }}</span>
              </div>
              <v-progress-linear
                color="inherit"
                height="24"
                :model-value="essaysWithoutTranslatorProgress"
                rounded
              >
                <template #default>
                  <v-spacer />
                  <span class="pr-4 progress-bar__label">{{ progressData.essaysWithoutTranslator.count }}/{{
                    progressData.essaysWithoutTranslator.totalCount
                  }}</span>
                </template>
              </v-progress-linear>
            </template>
          </v-alert>
        </v-col>
        <v-col cols="12">
          <v-alert
            border="start"
            icon="mdi-star"
            :title="$t('progress.average_grammar_estimation_title')"
            :type="getProgressColor(progressData.averageGrammarEstimation * 10)"
            variant="tonal"
          >
            <template #text>
              <div class="mb-2">
                <span>{{
                  getAverageGrammarEstimationProgressRecommendation(
                    progressData.averageGrammarEstimation * 10,
                  )
                }}</span>
              </div>
              <v-progress-linear
                color="inherit"
                height="24"
                :model-value="progressData.averageGrammarEstimation * 10"
                rounded
              >
                <template #default>
                  <v-spacer />
                  <span class="pr-4 progress-bar__label">{{ progressData.averageGrammarEstimation }}/10</span>
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
  import type { SupportedLocale } from "@/i18n";
  import type { ProgressEntry } from "@/services/progressEntriesService";
  import type { ProgressHistory } from "@/services/progressHistoryService";
  import type { CountResult } from "@/utils/db";
  import { computed, watch } from "vue";
  import { defineBasicLoader } from "vue-router/experimental";
  import { essaysService } from "@/services/essaysService";
  import { progressEntriesService } from "@/services/progressEntriesService";
  import { progressHistoryService } from "@/services/progressHistoryService";
  import { useLanguagesStore } from "@/stores/languages";
  import { formatRelativeDate } from "@/utils/date";
  import { getDefaultCountResult } from "@/utils/db";
  import {
    getAverageGrammarEstimationProgressRecommendation,
    getProgressColor,
    getTranslatorProgressRecommendation,
  } from "@/utils/progress";

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
    if (progressEntries.length > 0) progressData.progressEntry = progressEntries[0];
    const progressHistory = await progressHistoryService.getAllByIndex(
      "languagePair",
      {
        currentLanguage: languagesStore.currentLanguage,
        targetLanguage: languagesStore.targetLanguage,
      },
      "prev",
    );
    if (progressHistory.length > 0) progressData.progressHistory = progressHistory[0];
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
      { totalSentences: 0, errorSentences: 0 },
    );

    progressData.essaysWithoutMistakes = {
      count: reduceResult.totalSentences - reduceResult.errorSentences,
      totalCount: reduceResult.totalSentences,
    };

    const essaysWithoutTranslatorCountResult
      = await essaysService.getAllByIndexAndCount(
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
  const { data: progressData, reload: reloadProgressData } = useProgressData();

  const progressPointsDelta = computed(() => {
    if (!progressData.value.progressHistory) return null;
    return (
      progressData.value.progressHistory.newPointsValue
      - progressData.value.progressHistory.previousPointsValue
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
      (progressData.value.essaysWithoutTranslator.count
        / progressData.value.essaysWithoutTranslator.totalCount)
      * 100
    );
  });

  watch(languagesStore, () => {
    reloadProgressData();
  });
</script>
