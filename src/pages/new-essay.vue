<template>
  <essay-analysis-dialog
    v-model="isGrammaticalAnalysisDialogOpen"
  />
  <v-alert
    class="mb-4"
    icon="mdi-state-machine"
    :text="$t('new_essay.nn_recommendation.text')"
    :title="$t('new_essay.nn_recommendation.header')"
    type="info"
    variant="tonal"
  >
    <div class="mt-2">
      <v-btn
        append-icon="mdi-open-in-new"
        class="mr-2"
        href="https://gemini.google.com"
        target="_blank"
        variant="outlined"
      >
        google gemini
      </v-btn>
      <v-btn
        append-icon="mdi-open-in-new"
        href="https://chat.qwen.ai"
        target="_blank"
        variant="outlined"
      >qwen
      </v-btn>
    </div>
  </v-alert>
  <v-alert
    class="mb-4"
    icon="mdi-translate"
    :text="$t('new_essay.translate_recommendation.text')"
    :title="$t('new_essay.translate_recommendation.header')"
    type="info"
    variant="tonal"
  >
    <div class="mt-2">
      <v-btn
        append-icon="mdi-open-in-new"
        class="mr-2"
        href="https://translate.google.com"
        target="_blank"
        variant="outlined"
      >
        google translate
      </v-btn>
    </div>
  </v-alert>

  <v-textarea
    v-model="essaysStore.newEssay"
    auto-grow
    :label="$t('new_essay.textarea_placeholder')"
    rows="4"
  >
    <template #details>
      <span>{{ hintText }}</span>
    </template>
  </v-textarea>
  <v-checkbox
    v-model="essaysStore.isNewEssayTranslatorUsed"
    color="primary"
    :label="$t('new_essay.checkbox_label')"
  />
  <v-btn
    color="primary"
    :disabled="!isEnoughLetters"
    prepend-icon="mdi-reload"
    variant="tonal"
    @click="isGrammaticalAnalysisDialogOpen = true"
  >
    {{ $t("new_essay.buttons.handle") }}
  </v-btn>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import EssayAnalysisDialog from "@/components/EssayAnalysisDialog.vue";
  import { useEssaysStore } from "@/stores/essays";

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
