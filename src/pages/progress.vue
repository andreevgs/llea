<template>
  <v-container v-if="!progressData.progressEntry" class="fill-height">
    <div class="h-100 d-flex flex-column justify-center flex-grow-1">
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
        rounded
        to="/new-essay"
        variant="tonal"
      >{{ $t("app_bar.new_essay") }}</v-btn>
    </div>
  </v-container>
  <v-container v-else class="pa-0">
    <div class="d-flex align-center ga-2 mb-3">
      <v-chip class="font-weight-medium text-uppercase" label rounded="lg">
        {{ languagesStore.targetLanguage }}
      </v-chip>
      <span class="text-title-large">{{ $t(`change_langs_dialog.langs.${languagesStore.targetLanguage}`) }}</span>
      <v-spacer />
      <div v-if="progressData.progressHistory && progressPointsDelta">
        <v-chip
          :color="progressPointsDelta > 0 ? 'success' : 'error'"
          label
          rounded="lg"
          variant="tonal"
        >
          <span>
            <strong v-if="progressPointsDelta > 0">
              +{{ progressPointsDelta }} {{ $t('progress.points_label', progressPointsDelta) }}
            </strong>
            <strong v-else>{{ progressPointsDelta }} {{ $t('progress.points_label', Math.abs(progressPointsDelta)) }}</strong>
            {{ progressPointsDeltaUpdateDate }}</span>
        </v-chip>
      </div>
    </div>
    <v-alert
      color="secondary"
      icon="mdi-trending-up"
      rounded="xl"
      type="info"
      variant="tonal"
    >
      <template #title>
        <span>{{ progressData.progressEntry.points }}/100 {{ $t('progress.points_label', progressData.progressEntry.points) }}</span>
      </template>
      <template #text>
        <div class="mb-2">
          <span
            v-html="$t('progress.info_text')"
          /></div>
        <v-progress-linear
          color="secondary"
          height="26"
          :model-value="progressData.progressEntry.points"
          rounded="lg"
        />
      </template>
    </v-alert>
    <v-divider class="my-4" />
    <v-alert
      class="mb-2"
      icon="mdi-check-circle"
      rounded="xl"
      :type="getProgressColor(essaysWithoutMistakesProgress)"
      variant="tonal"
    >
      <template #title>
        <span>{{ $t('progress.essays_without_mistakes_title') }}</span>
        <v-spacer />
        <v-chip class="font-weight-medium flex-shrink-0 align-self-start ml-2" label rounded="lg" size="small">
          {{ Math.round(essaysWithoutMistakesProgress) }}%
        </v-chip>
      </template>
      <template #text>
        <div class="mb-2">
          <span>{{
            getCleanSentencesProgressRecommendation(
              essaysWithoutMistakesProgress,
            )
          }}</span>
        </div>
        <v-progress-linear
          color="inherit"
          height="26"
          :model-value="essaysWithoutMistakesProgress"
          rounded="lg"
        />
      </template>
    </v-alert>
    <v-alert
      class="mb-2"
      icon="mdi-translate-off"
      rounded="xl"
      :title="$t('progress.essays_without_translator_title')"
      :type="getProgressColor(essaysWithoutTranslatorProgress)"
      variant="tonal"
    >
      <template #title>
        <span>{{ $t('progress.essays_without_translator_title') }}</span>
        <v-spacer />
        <v-chip class="font-weight-medium flex-shrink-0 align-self-start ml-2" label rounded="lg" size="small">
          {{ Math.round(essaysWithoutTranslatorProgress) }}%
        </v-chip>
      </template>
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
          height="26"
          :model-value="essaysWithoutTranslatorProgress"
          rounded="lg"
        />
      </template>
    </v-alert>
    <v-alert
      icon="mdi-star"
      rounded="xl"
      :type="getProgressColor(progressData.averageGrammarEstimation * 10)"
      variant="tonal"
    >
      <template #title>
        <span>{{ $t('progress.average_grammar_estimation_title') }}</span>
        <v-spacer />
        <v-chip class="font-weight-medium flex-shrink-0 align-self-start ml-2" label rounded="lg" size="small">
          {{ progressData.averageGrammarEstimation }}/10
        </v-chip>
      </template>
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
          height="26"
          :model-value="progressData.averageGrammarEstimation * 10"
          rounded="lg"
        />
      </template>
    </v-alert>
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
  import { useSystemStore } from "@/stores/system";
  import { formatRelativeDate } from "@/utils/date";
  import { getDefaultCountResult } from "@/utils/db";
  import {
    getAverageGrammarEstimationProgressRecommendation,
    getCleanSentencesProgressRecommendation,
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

    const recentEssays = await essaysService.getAllByIndex(
      "languagePair",
      {
        currentLanguage: languagesStore.currentLanguage,
        targetLanguage: languagesStore.targetLanguage,
      },
      "prev",
      undefined,
      10,
    );

    if (recentEssays.length > 0) {
      let totalSentences = 0;
      let cleanSentences = 0;
      let withoutTranslatorCount = 0;
      let totalGrammarScore = 0;

      for (const essay of recentEssays) {
        totalSentences += essay.analyzedSentences.length;
        cleanSentences += (essay.analyzedSentences.length - essay.numOfSentencesWithMistakes);
        if (!essay.isTranslatorUsed) {
          withoutTranslatorCount++;
        }
        totalGrammarScore += (essay.grammarQuality?.estimation ?? 0);
      }

      progressData.essaysWithoutMistakes = {
        count: cleanSentences,
        totalCount: totalSentences,
      };

      progressData.essaysWithoutTranslator = {
        count: withoutTranslatorCount,
        totalCount: recentEssays.length,
      };

      progressData.averageGrammarEstimation = Number((totalGrammarScore / recentEssays.length).toFixed(1));
    }

    return progressData;
  });
</script>
<script setup lang="ts">

  const systemStore = useSystemStore();
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

  const essaysWithoutMistakesProgress = computed(() => {
    if (!progressData.value.essaysWithoutMistakes.totalCount) return 0;
    return (
      (progressData.value.essaysWithoutMistakes.count
        / progressData.value.essaysWithoutMistakes.totalCount)
      * 100
    );
  });

  const essaysWithoutTranslatorProgress = computed(() => {
    if (!progressData.value.essaysWithoutTranslator.totalCount) return 0;
    return (
      (progressData.value.essaysWithoutTranslator.count
        / progressData.value.essaysWithoutTranslator.totalCount)
      * 100
    );
  });

  watch(
    [
      () => languagesStore.currentLanguage,
      () => languagesStore.targetLanguage,
      () => systemStore.lastUpdateTimestamp,
    ],
    () => {
      reloadProgressData();
    },
  );
</script>

<style scoped>
:deep(.v-progress-linear__determinate) {
  border-radius: 8px;
  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%);
  mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%);
}
</style>
