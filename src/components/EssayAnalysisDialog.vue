<template>
  <v-snackbar
    v-model="isSuccessSnackbarVisible"
    class="snackbar"
    location="bottom right"
    :timeout="3000"
    variant="elevated"
  >
    <v-alert
      :text="$t('essay_analysis_dialog.success_text')"
      :title="$t('essay_analysis_dialog.success_title')"
      type="success"
      variant="tonal"
    >
      <template #close>
        <v-btn
          icon="mdi-close"
          size="x-small"
          @click="isSuccessSnackbarVisible = false"
        />
      </template>
    </v-alert>
  </v-snackbar>
  <v-dialog v-model="model" persistent style="max-width: 700px">
    <v-stepper v-model="currentStep" alt-labels>
      <template #default="{ prev, next }">
        <v-stepper-header>
          <v-stepper-item
            :color="analyzedGrammar ? 'success' : 'inherit'"
            :complete="Boolean(analyzedGrammar)"
            :disabled="isEssayAnalysisProcessing"
            edit-icon="mdi-state-machine"
            editable
            :title="$t('essay_analysis_dialog.grammar_analysis_title')"
            value="1"
          />

          <v-divider />

          <v-stepper-item
            :color="essayEstimation ? 'success' : 'inherit'"
            :complete="Boolean(essayEstimation)"
            :disabled="!analyzedGrammar || isEssayAnalysisProcessing"
            edit-icon="mdi-star"
            editable
            :title="$t('essay_analysis_dialog.grammar_estimation_title')"
            value="2"
          />

          <v-divider />

          <v-stepper-item
            :disabled="
              (!analyzedGrammar && !essayEstimation) ||
                isEssayAnalysisProcessing
            "
            edit-icon="mdi-book"
            editable
            :title="$t('essay_analysis_dialog.dictionary_title')"
            value="3"
          />
        </v-stepper-header>
        <v-stepper-window>
          <v-stepper-window-item value="1">
            <essay-analysis-step
              v-model="analyzedGrammar"
              :prompt="
                getGrammaticalAnalysisPrompt(
                  essaysStore.newEssay,
                  languagesStore.currentLanguage,
                  languagesStore.targetLanguage,
                )
              "
            />
          </v-stepper-window-item>
          <v-stepper-window-item value="2">
            <essay-analysis-step
              v-model="essayEstimation"
              :prompt="
                getGrammaticalEstimationPrompt(
                  essaysStore.newEssay,
                  languagesStore.currentLanguage,
                )
              "
            />
          </v-stepper-window-item>
          <v-stepper-window-item value="3">
            <essay-analysis-step
              v-model="essayDictionary"
              :prompt="
                getDictionaryCreationPrompt(
                  essaysStore.newEssay,
                  languagesStore.currentLanguage,
                  languagesStore.targetLanguage,
                )
              "
            />
          </v-stepper-window-item>
        </v-stepper-window>
        <v-stepper-actions :disabled="false">
          <template #prev>
            <v-btn
              v-if="currentStep === '1'"
              color="error"
              @click="model = false"
            >
              {{ $t('buttons.cancel') }}
            </v-btn>
            <v-btn
              v-else
              :disabled="isEssayAnalysisProcessing"
              prepend-icon="mdi-arrow-left"
              @click="prev"
            >
              {{ $t('essay_analysis_dialog.buttons.back') }}
            </v-btn>
          </template>
          <template #next>
            <v-btn
              v-if="currentStep === '3'"
              color="success"
              :disabled="isSaveButtonDisabled"
              :loading="isEssayAnalysisProcessing"
              prepend-icon="mdi-check"
              @click="handleEssayAnalysis"
            >
              {{ $t('buttons.save') }}
            </v-btn>
            <v-btn
              v-else
              append-icon="mdi-arrow-right"
              :disabled="isNextButtonDisabled"
              @click="next"
            >
              {{ $t('essay_analysis_dialog.buttons.next') }}
            </v-btn>
          </template>
        </v-stepper-actions>
      </template>
    </v-stepper>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { DictionaryEntry } from "@/services/dictionaryEntriesService";
  import type {
    AnalyzedEssay,
    AnalyzedSentence,
    GrammarQuality,
  } from "@/services/essaysService";
  import { computed, ref, watch } from "vue";
  import EssayAnalysisStep from "@/components/EssayAnalysisStep.vue";
  import { dictionaryEntriesService as dictionaryEntriesRepository } from "@/services/dictionaryEntriesService";
  import { essaysService as essaysRepository } from "@/services/essaysService";
  import { progressEntriesService } from "@/services/progressEntriesService";
  import { progressHistoryService } from "@/services/progressHistoryService";
  import { useEssaysStore } from "@/stores/essays";
  import { useLanguagesStore } from "@/stores/languages";
  import {
    getDictionaryCreationPrompt,
    getGrammaticalAnalysisPrompt,
    getGrammaticalEstimationPrompt,
  } from "@/utils/prompts";

  const essaysStore = useEssaysStore();
  const languagesStore = useLanguagesStore();
  const model = defineModel<boolean>({ default: false });

  const isSuccessSnackbarVisible = ref(false);
  const isEssayAnalysisProcessing = ref(false);
  const currentStep = ref<"1" | "2" | "3">("1");
  const analyzedGrammar = ref<string | null>(null);
  const essayEstimation = ref<string | null>(null);
  const essayDictionary = ref<string | null>(null);

  watch(model, (_, previousValue) => {
    previousValue || (currentStep.value = "1");
    previousValue || (analyzedGrammar.value = null);
    previousValue || (essayEstimation.value = null);
    previousValue || (essayDictionary.value = null);
    previousValue || (isEssayAnalysisProcessing.value = false);
  });

  const isNextButtonDisabled = computed(() => {
    return (
      (currentStep.value === "1" && !analyzedGrammar.value)
      || (currentStep.value === "2" && !essayEstimation.value)
    );
  });

  const isSaveButtonDisabled = computed(() => {
    return (
      (currentStep.value === "3" && !essayDictionary.value)
      || isEssayAnalysisProcessing.value
    );
  });

  const handleCloseDialog = () => {
    model.value = false;
  };

  const handleEssayAnalysis = async () => {
    isEssayAnalysisProcessing.value = true;
    const newAnalyzedSentences = JSON.parse(
      String(analyzedGrammar.value),
    ) as AnalyzedSentence[];
    const newEssayGrammarQuality = JSON.parse(
      String(essayEstimation.value),
    ) as GrammarQuality;
    newEssayGrammarQuality.estimation = Number(
      (newEssayGrammarQuality.estimation / 10).toFixed(1),
    );
    const numOfMistakes = newAnalyzedSentences.reduce(
      (count, sentence) => {
        return count + sentence.mistakes.length;
      },
      0,
    );
    const newAnalyzedEssay: AnalyzedEssay = {
      text: essaysStore.newEssay,
      date: new Date(),
      grammarQuality: newEssayGrammarQuality,
      isTranslatorUsed: essaysStore.isNewEssayTranslatorUsed,
      currentLanguage: languagesStore.currentLanguage,
      targetLanguage: languagesStore.targetLanguage,
      numOfWords: essaysStore.newEssay.trim()
        ? essaysStore.newEssay.trim().split(/\s+/).length
        : 0,
      numOfMistakes,
      numOfSentencesWithMistakes: newAnalyzedSentences.reduce(
        (count, sentence) => {
          return sentence.mistakes.length > 0 ? count + 1 : count;
        },
        0,
      ),
      analyzedSentences: newAnalyzedSentences,
    };
    const newEssayDictionaryEntries = JSON.parse(
      String(essayDictionary.value),
    ) as Omit<DictionaryEntry, "currentLanguage" | "targetLanguage">[];
    await essaysRepository.put(newAnalyzedEssay);
    for (const dictionaryEntry of newEssayDictionaryEntries) {
      await dictionaryEntriesRepository.put({
        ...dictionaryEntry,
        currentLanguage: languagesStore.currentLanguage,
        targetLanguage: languagesStore.targetLanguage,
      });
    }
    const numOfSentencesWithoutMistakes
      = newAnalyzedEssay.analyzedSentences.length
        - newAnalyzedEssay.numOfSentencesWithMistakes;
    const essayPoints = numOfSentencesWithoutMistakes * 2 - numOfMistakes;
    const progressEntriesForLanguagePair
      = await progressEntriesService.getAllByIndex(
        "languagePair",
        {
          currentLanguage: languagesStore.currentLanguage,
          targetLanguage: languagesStore.targetLanguage,
        },
        "next",
      );
    if (progressEntriesForLanguagePair.length > 0) {
      await progressEntriesService.put({
        ...progressEntriesForLanguagePair[0],
        points:
          Math.max(progressEntriesForLanguagePair[0].points + essayPoints, 0),
      });
      await progressHistoryService.put({
        previousPointsValue: progressEntriesForLanguagePair[0].points,
        newPointsValue:
          Math.max(progressEntriesForLanguagePair[0].points + essayPoints, 0),
        date: new Date(),
        currentLanguage: languagesStore.currentLanguage,
        targetLanguage: languagesStore.targetLanguage,
      });
    } else {
      await progressEntriesService.put({
        currentLanguage: languagesStore.currentLanguage,
        targetLanguage: languagesStore.targetLanguage,
        points: Math.max(essayPoints, 0),
      });
      await progressHistoryService.put({
        previousPointsValue: 0,
        newPointsValue: Math.max(essayPoints, 0),
        date: new Date(),
        currentLanguage: languagesStore.currentLanguage,
        targetLanguage: languagesStore.targetLanguage,
      });
    }
    handleCloseDialog();
    isSuccessSnackbarVisible.value = true;
    essaysStore.newEssay = "";
    essaysStore.isNewEssayTranslatorUsed = false;
  };
</script>

<style scoped></style>
