<template>
  <v-container v-if="essay" class="pa-0">
    <div class="d-flex justify-space-between mb-3">
      <div class="d-flex ga-2 flex-wrap">
        <v-chip
          class="rounded-lg"
          :color="getEstimationChipColor(essay.grammarQuality.estimation)"
          label
          prepend-icon="mdi-star"
          variant="tonal"
        >
          {{ essay.grammarQuality.estimation }} — {{ $t('essays.grammar_estimation_label') }}
        </v-chip>
        <v-chip
          v-if="essay.numOfMistakes"
          class="rounded-lg"
          color="warning"
          label
          prepend-icon="mdi-alert-circle"
          variant="tonal"
        >
          {{ essay.numOfMistakes }} {{ $t('essays.mistakes_label', essay.numOfMistakes) }}
        </v-chip>
        <v-chip
          v-if="essay.numOfSentencesWithMistakes"
          class="rounded-lg"
          label
          prepend-icon="mdi-alert"
          variant="tonal"
        >
          {{ essay.numOfSentencesWithMistakes }} {{ $t('essays.sentences_with_mistakes_label', essay.numOfSentencesWithMistakes) }}
        </v-chip>
        <v-chip
          v-if="essay.isTranslatorUsed"
          class="rounded-lg"
          color="primary"
          label
          prepend-icon="mdi-translate"
          variant="tonal"
        >
          {{ $t('essays.translator_used_label') }}
        </v-chip>
      </div>
      <v-chip
        class="text-body-medium flex-shrink-0 pr-0 border-0 opacity-60"
        label
        variant="outlined"
      >
        {{
          formatRelativeDate(
            essay.date,
            languageStore.currentLanguage as SupportedLocale,
          )
        }}
      </v-chip>
    </div>
    <div>
      <span>{{ essay.text }}</span>
    </div>
    <div
      v-for="(sentence, sentenceIndex) in essay.analyzedSentences"
      :key="sentenceIndex"
    >
      <v-divider class="my-4" />
      <div>
        <span>{{ sentence.sentence }}</span>
      </div>
      <v-alert
        border="start"
        class="mt-4"
        icon="mdi-translate"
        rounded="lg"
        :text="sentence.translation"
        :title="$t('essays.translation_title')"
        type="info"
        variant="tonal"
      />
      <div
        v-for="(mistake, mistakeIndex) in sentence.mistakes"
        :key="mistakeIndex"
      >
        <v-alert
          border="start"
          class="mt-2"
          icon="mdi-alert-circle"
          rounded="lg"
          :title="mistake.type"
          type="warning"
          variant="tonal"
        >
          <template #text>
            <span v-html="highlightQuotedText(mistake.mistake)" />
          </template>
        </v-alert>
      </div>
      <div v-if="sentence.correctedSentence && sentence.correctedSentence !== sentence.sentence">
        <v-alert
          border="start"
          class="mt-2"
          rounded="lg"
          :text="sentence.correctedSentence"
          :title="$t('essays.corrected_sentence_title')"
          type="success"
          variant="tonal"
        >
          <div class="mt-2">
            <v-btn
              color="success"
              :prepend-icon="isSentencePlaying(sentence.correctedSentence) ? 'mdi-stop' : 'mdi-volume-high'"
              rounded
              :variant="isSentencePlaying(sentence.correctedSentence) ? 'flat' : 'tonal'"
              @click="speak(sentence.correctedSentence, languageStore.targetLanguage)"
            >
              {{ isSentencePlaying(sentence.correctedSentence) ? $t('essays.stop_button') : $t('essays.listen_button') }}
            </v-btn>
          </div>
        </v-alert>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import type { SupportedLocale } from "@/i18n";
  import type { AnalyzedEssay } from "@/db";
  import { ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import { useEssays } from "@/composables/useEssays";
  import { useSpeechSynthesis } from "@/composables/useSpeechSynthesis";
  import { useLanguageStore } from "@/stores/language";
  import { getEstimationChipColor } from "@/utils/chip";
  import { formatRelativeDate } from "@/utils/date";
  import { highlightQuotedText } from "@/utils/strings";

  const route = useRoute("/essays/[id]");
  const languageStore = useLanguageStore();
  const { getEssayById } = useEssays();
  const { speak, isTextPlaying, currentPlayingText } = useSpeechSynthesis();

  const essay = ref<AnalyzedEssay | undefined>(undefined);

  watch(
    () => route.params.id,
    async (id) => {
      if (id) {
        essay.value = await getEssayById(Number(id));
      }
    },
    { immediate: true },
  );

  const isSentencePlaying = (sentenceText: string) => {
    return isTextPlaying.value && currentPlayingText.value === sentenceText;
  };
</script>

<style scoped>
.date-created {
  opacity: 0.7;
  font-size: 0.875rem;
}
.date-created__text {
  line-height: 32px;
}

.action-alert :deep(.v-alert-title) {
  align-self: flex-start;
}

.action-alert :deep(.v-alert__content) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.play-button {
  background: transparent;
  color: inherit;
}
</style>
