<template>
  <essay-analysis-dialog
    v-model="isGrammaticalAnalysisDialogOpen"
  ></essay-analysis-dialog>
  <v-alert
    icon="mdi-state-machine"
    :title="$t('new_essay.nn_recommendation.header')"
    :text="$t('new_essay.nn_recommendation.text')"
    type="info"
    variant="tonal"
    class="mb-4"
  >
    <div class="mt-2">
      <v-btn
        class="mr-2"
        variant="outlined"
        append-icon="mdi-open-in-new"
        href="https://gemini.google.com"
        target="_blank"
      >
        google gemini
      </v-btn>
      <v-btn
        variant="outlined"
        append-icon="mdi-open-in-new"
        href="https://chat.qwen.ai"
        target="_blank"
        >qwen
      </v-btn>
    </div>
  </v-alert>
  <v-alert
    icon="mdi-translate"
    :title="$t('new_essay.translate_recommendation.header')"
    :text="$t('new_essay.translate_recommendation.text')"
    type="info"
    variant="tonal"
    class="mb-4"
  >
    <div class="mt-2">
      <v-btn
        class="mr-2"
        variant="outlined"
        append-icon="mdi-open-in-new"
        href="https://translate.google.com"
        target="_blank"
      >
        google translate
      </v-btn>
    </div>
  </v-alert>

  <v-textarea
    rows="4"
    :label="$t('new_essay.textarea_placeholder')"
    auto-grow
    v-model="essaysStore.newEssay"
  >
    <template v-slot:details>
      <span>{{ hintText }}</span>
    </template>
  </v-textarea>
  <v-checkbox
    v-model="essaysStore.isNewEssayTranslatorUsed"
    color="primary"
    :label="$t('new_essay.checkbox_label')"
  ></v-checkbox>
  <v-btn
    prepend-icon="mdi-reload"
    variant="tonal"
    color="primary"
    :disabled="!isEnoughLetters"
    @click="isGrammaticalAnalysisDialogOpen = true"
  >
    {{ $t("new_essay.buttons.handle") }}
  </v-btn>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useEssaysStore } from "@/stores/essays";
import EssayAnalysisDialog from "@/components/EssayAnalysisDialog.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const essaysStore = useEssaysStore();
const isGrammaticalAnalysisDialogOpen = ref(false);

const MIN_LETTERS = 600;

const letterCount = computed(() => {
  return essaysStore.newEssay.replace(/\s+/g, "").length;
});

const lettersRemaining = computed(() => {
  return Math.max(0, MIN_LETTERS - letterCount.value);
});

const isEnoughLetters = computed(() => {
  return letterCount.value >= MIN_LETTERS;
});

const hintText = computed(() => {
  if (isEnoughLetters.value) {
    return t("new_essay.min_requirements_met");
  }
  return t("new_essay.letters_remaining", lettersRemaining.value);
});
</script>
