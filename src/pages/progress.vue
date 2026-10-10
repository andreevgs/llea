<template>
  <v-container v-if="!progressData.hasData" class="fill-height">
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
        {{ languageStore.targetLanguage }}
      </v-chip>
      <span class="text-title-large">{{ $t(`change_langs_dialog.langs.${languageStore.targetLanguage}`) }}</span>
      <v-spacer />
      <div v-if="progressPointsDelta">
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
        <span>{{ progressData.points }}/100 {{ $t('progress.points_label', progressData.points) }}</span>
      </template>
      <template #text>
        <div class="mb-2">
          <span
            v-html="$t('progress.info_text')"
          /></div>
        <v-progress-linear
          color="secondary"
          height="26"
          :model-value="progressData.points"
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

<script setup lang="ts">
  import type { SupportedLocale } from "@/i18n";
  import { computed } from "vue";
  import { useProgress } from "@/composables/useProgress";
  import { useLanguageStore } from "@/stores/language";
  import { formatRelativeDate } from "@/utils/date";
  import {
    getAverageGrammarEstimationProgressRecommendation,
    getCleanSentencesProgressRecommendation,
    getProgressColor,
    getTranslatorProgressRecommendation,
  } from "@/utils/progress";

  const languageStore = useLanguageStore();
  const {
    progressData,
    progressPointsDelta,
    essaysWithoutMistakesProgress,
    essaysWithoutTranslatorProgress,
  } = useProgress();

  const progressPointsDeltaUpdateDate = computed(() => {
    if (!progressData.value.latestEssay) return null;
    return formatRelativeDate(
      progressData.value.latestEssay.date,
      languageStore.currentLanguage as SupportedLocale,
    );
  });
</script>

<style scoped>
:deep(.v-progress-linear__determinate) {
  border-radius: 8px;
  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%);
  mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%);
}
</style>
