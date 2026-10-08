<template>
  <v-snackbar
    v-model="isSuccessSnackbarVisible"
    class="snackbar"
    location="bottom right"
    :timeout="3000"
    variant="elevated"
  >
    <v-alert
      rounded="xl"
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
                  draftStore.newEssay,
                  languageStore.currentLanguage,
                  languageStore.targetLanguage,
                )
              "
            />
          </v-stepper-window-item>
          <v-stepper-window-item value="2">
            <essay-analysis-step
              v-model="essayEstimation"
              :prompt="
                getGrammaticalEstimationPrompt(
                  draftStore.newEssay,
                  languageStore.currentLanguage,
                )
              "
            />
          </v-stepper-window-item>
          <v-stepper-window-item value="3">
            <essay-analysis-step
              v-model="essayDictionary"
              :prompt="
                getDictionaryCreationPrompt(
                  draftStore.newEssay,
                  languageStore.currentLanguage,
                  languageStore.targetLanguage,
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
              rounded
              @click="model = false"
            >
              {{ $t('buttons.cancel') }}
            </v-btn>
            <v-btn
              v-else
              :disabled="isEssayAnalysisProcessing"
              prepend-icon="mdi-arrow-left"
              rounded
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
              rounded
              @click="handleEssayAnalysis"
            >
              {{ $t('buttons.save') }}
            </v-btn>
            <v-btn
              v-else
              append-icon="mdi-arrow-right"
              :disabled="isNextButtonDisabled"
              rounded
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
  import type {
    AnalyzedSentence,
    DictionaryEntry,
    GrammarQuality,
  } from "@/db";
  import { computed, ref, watch } from "vue";
  import EssayAnalysisStep from "./EssayAnalysisStep.vue";
  import { useEssays } from "@/composables/useEssays";
  import { useDraftStore } from "@/stores/draft";
  import { useLanguageStore } from "@/stores/language";
  import {
    getDictionaryCreationPrompt,
    getGrammaticalAnalysisPrompt,
    getGrammaticalEstimationPrompt,
  } from "@/utils/prompts";

  const draftStore = useDraftStore();
  const languageStore = useLanguageStore();
  const { saveAnalysisResult } = useEssays();
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
    if (!analyzedGrammar.value || !essayEstimation.value || !essayDictionary.value) return;
    isEssayAnalysisProcessing.value = true;
    try {
      const newAnalyzedSentences = JSON.parse(
        String(analyzedGrammar.value),
      ) as AnalyzedSentence[];
      const newEssayGrammarQuality = JSON.parse(
        String(essayEstimation.value),
      ) as GrammarQuality;
      const newEssayDictionaryEntries = JSON.parse(
        String(essayDictionary.value),
      ) as Omit<DictionaryEntry, "currentLanguage" | "targetLanguage">[];

      await saveAnalysisResult({
        text: draftStore.newEssay,
        isTranslatorUsed: draftStore.isNewEssayTranslatorUsed,
        analyzedSentences: newAnalyzedSentences,
        grammarEstimation: Number(
          (newEssayGrammarQuality.estimation / 10).toFixed(1),
        ),
        dictionaryEntries: newEssayDictionaryEntries,
      });

      handleCloseDialog();
      isSuccessSnackbarVisible.value = true;
    } catch (error) {
      console.error("Failed to save essay analysis:", error);
    } finally {
      isEssayAnalysisProcessing.value = false;
    }
  };
</script>

<style scoped></style>
