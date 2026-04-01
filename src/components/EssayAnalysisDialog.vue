<template>
  <v-snackbar
    class="snackbar"
    variant="elevated"
    :timeout="3000"
    v-model="isSuccessSnackbarVisible"
    location="bottom right"
  >
    <v-alert
      :text="$t('essay_analysis_dialog.success_text')"
      :title="$t('essay_analysis_dialog.success_title')"
      type="success"
      variant="tonal"
    >
      <template v-slot:close>
        <v-btn
          size="x-small"
          icon="mdi-close"
          @click="isSuccessSnackbarVisible = false"
        ></v-btn>
      </template>
    </v-alert>
  </v-snackbar>
  <v-dialog v-model="model" style="max-width: 700px" persistent>
    <v-stepper alt-labels v-model="currentStep">
      <template v-slot:default="{ prev, next }">
        <v-stepper-header>
          <v-stepper-item
            :title="$t('essay_analysis_dialog.grammar_analysis_title')"
            value="1"
            editable
            edit-icon="mdi-state-machine"
            :color="analyzedGrammar ? 'success' : 'inherit'"
            :complete="Boolean(analyzedGrammar)"
            :disabled="isEssayAnalysisProcessing"
          ></v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item
            :title="$t('essay_analysis_dialog.grammar_estimation_title')"
            value="2"
            editable
            edit-icon="mdi-star"
            :disabled="!analyzedGrammar || isEssayAnalysisProcessing"
            :color="essayEstimation ? 'success' : 'inherit'"
            :complete="Boolean(essayEstimation)"
          ></v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item
            :title="$t('essay_analysis_dialog.dictionary_title')"
            value="3"
            editable
            edit-icon="mdi-book"
            :disabled="
              (!analyzedGrammar && !essayEstimation) ||
              isEssayAnalysisProcessing
            "
          ></v-stepper-item>
        </v-stepper-header>
        <v-stepper-window>
          <v-stepper-window-item value="1">
            <essay-analysis-step
              :prompt="
                getGrammaticalAnalysisPrompt(
                  essaysStore.newEssay,
                  languagesStore.currentLanguage,
                  languagesStore.targetLanguage,
                )
              "
              v-model="analyzedGrammar"
            ></essay-analysis-step>
          </v-stepper-window-item>
          <v-stepper-window-item value="2">
            <essay-analysis-step
              :prompt="
                getGrammaticalEstimationPrompt(
                  essaysStore.newEssay,
                  languagesStore.currentLanguage,
                )
              "
              v-model="essayEstimation"
            ></essay-analysis-step>
          </v-stepper-window-item>
          <v-stepper-window-item value="3">
            <essay-analysis-step
              :prompt="
                getDictionaryCreationPrompt(
                  essaysStore.newEssay,
                  languagesStore.currentLanguage,
                  languagesStore.targetLanguage,
                )
              "
              v-model="essayDictionary"
            ></essay-analysis-step>
          </v-stepper-window-item>
        </v-stepper-window>
        <v-stepper-actions :disabled="false">
          <template v-slot:prev>
            <v-btn
              v-if="currentStep === '1'"
              color="error"
              @click="model = false"
            >
              {{ $t('buttons.cancel') }}
            </v-btn>
            <v-btn
              v-else
              @click="prev"
              prepend-icon="mdi-arrow-left"
              :disabled="isEssayAnalysisProcessing"
            >
              {{ $t('essay_analysis_dialog.buttons.back') }}
            </v-btn>
          </template>
          <template v-slot:next>
            <v-btn
              v-if="currentStep === '3'"
              color="success"
              @click="handleEssayAnalysis"
              prepend-icon="mdi-check"
              :disabled="isSaveButtonDisabled"
              :loading="isEssayAnalysisProcessing"
            >
              {{ $t('buttons.save') }}
            </v-btn>
            <v-btn
              v-else
              :disabled="isNextButtonDisabled"
              @click="next"
              append-icon="mdi-arrow-right"
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
import { computed, ref, watch } from "vue";
import {
  getDictionaryCreationPrompt,
  getGrammaticalAnalysisPrompt,
  getGrammaticalEstimationPrompt,
} from "@/utils/prompts";
import { useEssaysStore } from "@/stores/essays";
import { useLanguagesStore } from "@/stores/languages";
import EssayAnalysisStep from "@/components/EssayAnalysisStep.vue";
import {
  AnalyzedEssay,
  AnalyzedSentence,
  GrammarQuality,
} from "@/services/essaysService";
import { dictionaryEntriesService as dictionaryEntriesRepository } from "@/services/dictionaryEntriesService";
import { essaysService as essaysRepository } from "@/services/essaysService";
import { DictionaryEntry } from "@/services/dictionaryEntriesService";
import { progressEntriesService } from "@/services/progressEntriesService";
import { progressHistoryService } from "@/services/progressHistoryService";

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
    (currentStep.value === "1" && !analyzedGrammar.value) ||
    (currentStep.value === "2" && !essayEstimation.value)
  );
});

const isSaveButtonDisabled = computed(() => {
  return (
    (currentStep.value === "3" && !essayDictionary.value) ||
    isEssayAnalysisProcessing.value
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
  const newAnalyzedEssay: AnalyzedEssay = {
    text: essaysStore.newEssay,
    date: new Date(),
    grammarQuality: newEssayGrammarQuality,
    isTranslatorUsed: essaysStore.isNewEssayTranslatorUsed,
    currentLanguage: languagesStore.currentLanguage,
    targetLanguage: languagesStore.targetLanguage,
    numOfWords: essaysStore.newEssay
      .replace(/[^\w\s]|_/g, " ")
      .replace(/\s+/g, " ")
      .split(" ").length,
    numOfSentencesWithMistakes: newAnalyzedSentences.reduce(
      (count, sentence) => {
        return sentence.mistakes.length ? count + 1 : count;
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
  const numOfMistakes = newAnalyzedEssay.analyzedSentences.reduce(
    (count, sentence) => {
      return count + sentence.mistakes.length;
    },
    0,
  );
  const numOfSentencesWithoutMistakes =
    newAnalyzedEssay.analyzedSentences.length -
    newAnalyzedEssay.numOfSentencesWithMistakes;
  const essayPoints = numOfSentencesWithoutMistakes * 2 - numOfMistakes;
  const progressEntriesForLanguagePair =
    await progressEntriesService.getAllByIndex(
      "languagePair",
      {
        currentLanguage: languagesStore.currentLanguage,
        targetLanguage: languagesStore.targetLanguage,
      },
      "next",
    );
  if (progressEntriesForLanguagePair.length) {
    console.log(
      progressEntriesForLanguagePair[0].points,
      essayPoints,
      progressEntriesForLanguagePair[0].points + essayPoints,
    );
    await progressEntriesService.put({
      ...progressEntriesForLanguagePair[0],
      points:
        progressEntriesForLanguagePair[0].points + essayPoints > 0
          ? progressEntriesForLanguagePair[0].points + essayPoints
          : 0,
    });
    await progressHistoryService.put({
      previousPointsValue: progressEntriesForLanguagePair[0].points,
      newPointsValue:
        progressEntriesForLanguagePair[0].points + essayPoints > 0
          ? progressEntriesForLanguagePair[0].points + essayPoints
          : 0,
      date: new Date(),
      currentLanguage: languagesStore.currentLanguage,
      targetLanguage: languagesStore.targetLanguage,
    });
  } else {
    await progressEntriesService.put({
      currentLanguage: languagesStore.currentLanguage,
      targetLanguage: languagesStore.targetLanguage,
      points: essayPoints > 0 ? essayPoints : 0,
    });
    await progressHistoryService.put({
      previousPointsValue: 0,
      newPointsValue: essayPoints > 0 ? essayPoints : 0,
      date: new Date(),
      currentLanguage: languagesStore.currentLanguage,
      targetLanguage: languagesStore.targetLanguage,
    });
  }
  handleCloseDialog();
  isSuccessSnackbarVisible.value = true;
};

// const pasteAnalysisResult = async () => {
//   try {
//     const analysisResult = await navigator.clipboard.readText();
//     const sentencesGrammaticalAnalysis = JSON.parse(
//       analysisResult,
//     ) as AnalyzedSentence[];
//     analyzedEssayString.value = JSON.stringify({
//       text: essaysStore.newEssay,
//       date: new Date(),
//       numOfSentencesWithMistakes: sentencesGrammaticalAnalysis.reduce(
//         (count, sentence) => {
//           return sentence.mistakes.length ? count + 1 : count;
//         },
//         0,
//       ),
//       numOfWords: essaysStore.newEssay
//         .replace(/[^\w\s]|_/g, " ")
//         .replace(/\s+/g, " ")
//         .split(" ").length,
//       analyzedSentences: sentencesGrammaticalAnalysis,
//     });
//   } catch (e) {
//     console.log(e);
//     //
//   }
// };
</script>

<style scoped></style>
