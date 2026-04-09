<template>
  <essay-analysis-dialog
    v-model="isGrammaticalAnalysisDialogOpen"
  />
  <div class="mb-4 d-flex ga-6">
    <v-alert
      class="action-alert"
      icon="mdi-state-machine"
      :text="$t('new_essay.nn_recommendation.text')"
      :title="$t('new_essay.nn_recommendation.header')"
      type="info"
      variant="tonal"
    >
      <v-spacer />
      <div class="mt-2">
        <v-btn
          append-icon="mdi-open-in-new"
          class="mr-2"
          href="https://gemini.google.com"
          target="_blank"
          variant="outlined"
        >
          Google Gemini
        </v-btn>
        <v-btn
          append-icon="mdi-open-in-new"
          href="https://chat.qwen.ai"
          target="_blank"
          variant="outlined"
        >Qwen
        </v-btn>
      </div>
    </v-alert>
    <v-alert
      class="action-alert"
      icon="mdi-translate"
      :text="$t('new_essay.translate_recommendation.text')"
      :title="$t('new_essay.translate_recommendation.header')"
      type="info"
      variant="tonal"
    >
      <div class="d-flex flex-column h-100">
        <v-spacer />
        <div class="mt-2">
          <v-btn
            append-icon="mdi-open-in-new"
            class="mr-2"
            href="https://translate.google.com"
            target="_blank"
            variant="outlined"
          >
            Google Translate
          </v-btn>
        </div>
      </div>
    </v-alert>
  </div>
  <div class="mb-2">
    <div class="d-flex align-center">
      <span v-show="lettersRemaining > 0" class="mr-1">{{ $t('new_essay.until_min_volume') }}</span>
      <v-chip
        :color="lettersRemaining > 0 ? 'info' : 'success'"
        :prepend-icon="lettersRemaining > 0 ? 'mdi-note-alert' : 'mdi-note-check'"
      >
        {{ lettersRemaining > 0 ? $t('new_essay.letters_left', lettersRemaining) : $t('new_essay.min_requirements_met') }}
      </v-chip>
      <v-spacer />
      <v-chip class="mr-1">{{ sentencesCount }} {{ $t("essays.sentences_label", sentencesCount) }}</v-chip>
      <v-chip>{{ wordsCount }} {{ $t("essays.words_label", wordsCount) }}</v-chip>
    </div>
  </div>
  <v-textarea
    v-model="essaysStore.newEssay"
    auto-grow
    :label="$t('new_essay.textarea_placeholder')"
    rows="4"
  />
  <div class="d-flex align-center justify-start mt-2 mb-2">
    <v-checkbox-btn
      id="translator-used-checkbox"
      v-model="essaysStore.isNewEssayTranslatorUsed"
      class="pe-2 flex-grow-0 cursor-pointer"
    />
    <label class="cursor-pointer" for="translator-used-checkbox">{{ $t("new_essay.checkbox_label") }}</label>
  </div>
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
  import EssayAnalysisDialog from "@/components/EssayAnalysisDialog.vue";
  import { useEssaysStore } from "@/stores/essays";

  const essaysStore = useEssaysStore();
  const isGrammaticalAnalysisDialogOpen = ref(false);

  const MIN_LETTERS = 500;

  const letterCount = computed(() => {
    return essaysStore.newEssay.replace(/[^\p{L}\p{N}]/gu, "").length;
  });

  const lettersRemaining = computed(() => {
    return Math.max(0, MIN_LETTERS - letterCount.value);
  });

  const isEnoughLetters = computed(() => {
    return letterCount.value >= MIN_LETTERS;
  });

  const sentencesCount = computed(() => {
    return essaysStore.newEssay.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  });

  const wordsCount = computed(() => {
    const text = essaysStore.newEssay.trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  });
</script>
<style scoped>
.action-alert {
  align-items: stretch;
}

.action-alert :deep(.v-alert-title) {
  align-self: flex-start;
}

.action-alert :deep(.v-alert__content) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.v-input__details) {
  display: none;
}
</style>
