<template>
  <essay-analysis-dialog
    v-model="isGrammaticalAnalysisDialogOpen"
  />
  <v-container class="pa-0">
    <div class="mb-4 d-flex ga-4">
      <v-alert
        class="action-alert"
        icon="mdi-state-machine"
        rounded="xl"
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
            rounded
            target="_blank"
            variant="outlined"
          >
            Google Gemini
          </v-btn>
          <v-btn
            append-icon="mdi-open-in-new"
            href="https://chat.qwen.ai"
            rounded
            target="_blank"
            variant="outlined"
          >Qwen
          </v-btn>
        </div>
      </v-alert>
      <v-alert
        class="action-alert"
        icon="mdi-translate"
        rounded="xl"
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
              rounded
              target="_blank"
              variant="outlined"
            >
              Google Translate
            </v-btn>
          </div>
        </div>
      </v-alert>
    </div>
    <v-alert
      class="my-4"
      closable
      color="secondary"
      icon="mdi-creation"
      rounded="xl"
      :text="currentEssayIdea"
      :title="$t('new_essay.no_ideas_title')"
      variant="tonal"
    >
      <div class="mt-2">
        <v-btn
          class="mr-2"
          :loading="isLoadingEssayIdea"
          prepend-icon="mdi-refresh"
          rounded
          variant="outlined"
          @click="loadNextEssayIdea"
        >
          {{ $t('new_essay.buttons.another_idea') }}
        </v-btn>
      </div>
    </v-alert>
    <div class="mb-2">
      <div class="d-flex align-center">
        <span v-show="lettersRemaining > 0" class="mr-1">{{ $t('new_essay.until_min_volume') }}</span>
        <v-chip
          class="rounded-lg"
          :color="lettersRemaining > 0 ? 'info' : 'success'"
          label
          :prepend-icon="lettersRemaining > 0 ? 'mdi-note-alert' : 'mdi-note-check'"
        >
          {{ lettersRemaining > 0 ? $t('new_essay.letters_left', lettersRemaining) : $t('new_essay.min_requirements_met') }}
        </v-chip>
        <v-spacer />
        <v-chip class="rounded-lg mr-2" label>{{ sentencesCount }} {{ $t("essays.sentences_label", sentencesCount) }}</v-chip>
        <v-chip class="rounded-lg" label>{{ wordsCount }} {{ $t("essays.words_label", wordsCount) }}</v-chip>
      </div>
    </div>
    <v-textarea
      v-model="draftStore.newEssay"
      auto-grow
      :label="$t('new_essay.textarea_placeholder')"
      rows="4"
    />
    <div class="d-flex align-center justify-start mt-2 mb-2">
      <v-checkbox-btn
        id="translator-used-checkbox"
        v-model="draftStore.isNewEssayTranslatorUsed"
        class="pe-2 flex-grow-0 cursor-pointer"
      />
      <label class="cursor-pointer" for="translator-used-checkbox">{{ $t("new_essay.checkbox_label") }}</label>
    </div>
    <v-btn
      color="primary"
      :disabled="!isEnoughLetters"
      rounded
      variant="tonal"
      @click="isGrammaticalAnalysisDialogOpen = true"
    >
      {{ $t("new_essay.buttons.handle") }}
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import EssayAnalysisDialog from "@/components/essay/EssayAnalysisDialog.vue";
  import { ESSAY_MIN_LETTERS } from "@/const/essays";
  import { useDraftStore } from "@/stores/draft";
  import { getRandomEssayIdea, getRandomEssayIdeaWithDelay } from "@/utils/essays";
  import { countLetters, countSentences, countWords } from "@/utils/text";

  const draftStore = useDraftStore();
  const isGrammaticalAnalysisDialogOpen = ref(false);
  const currentEssayIdea = ref(getRandomEssayIdea());
  const isLoadingEssayIdea = ref(false);

  const loadNextEssayIdea = async () => {
    isLoadingEssayIdea.value = true;
    currentEssayIdea.value = await getRandomEssayIdeaWithDelay();
    isLoadingEssayIdea.value = false;
  };

  const letterCount = computed(() => {
    return countLetters(draftStore.newEssay);
  });

  const lettersRemaining = computed(() => {
    return Math.max(0, ESSAY_MIN_LETTERS - letterCount.value);
  });

  const isEnoughLetters = computed(() => {
    return letterCount.value >= ESSAY_MIN_LETTERS;
  });

  const sentencesCount = computed(() => {
    return countSentences(draftStore.newEssay);
  });

  const wordsCount = computed(() => {
    return countWords(draftStore.newEssay);
  });
</script>
<style scoped>
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
