<template>
  <v-container class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <v-sheet v-if="essay" class="px-4 py-3" rounded>
          <v-row no-gutters>
            <v-col class="d-flex ga-3 flex-wrap pb-3" cols="9">
              <v-chip
                :color="getEstimationChipColor(essay.grammarQuality.estimation)"
                prepend-icon="mdi-star"
                variant="tonal"
              >
                {{ essay.grammarQuality.estimation }} — {{ $t('essays.grammar_estimation_label') }}
              </v-chip>
              <v-chip
                v-if="essay.numOfMistakes"
                color="warning"
                prepend-icon="mdi-alert-circle"
                variant="tonal"
              >
                {{ essay.numOfMistakes }} {{ $t('essays.mistakes_label', essay.numOfMistakes) }}
              </v-chip>
              <v-chip
                v-if="essay.numOfSentencesWithMistakes"
                prepend-icon="mdi-alert"
                variant="tonal"
              >
                {{ essay.numOfSentencesWithMistakes }} {{ $t('essays.sentences_with_mistakes_label', essay.numOfSentencesWithMistakes) }}
              </v-chip>
              <v-chip
                v-if="essay.isTranslatorUsed"
                color="primary"
                prepend-icon="mdi-translate"
                variant="tonal"
              >
                {{ $t('essays.translator_used_label') }}
              </v-chip>
            </v-col>
            <v-col class="text-right date-created" cols="3">
              <span class="date-created__text">{{
                formatRelativeDate(
                  essay.date,
                  languagesStore.currentLanguage as SupportedLocale,
                )
              }}</span>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              {{ essay.text }}
            </v-col>
          </v-row>
          <v-row
            v-for="(sentence, sentenceIndex) in essay.analyzedSentences"
            :key="sentenceIndex"
          >
            <v-col cols="12">
              <v-divider />
            </v-col>
            <v-col cols="12">
              {{ sentence.sentence }}
            </v-col>
            <v-col cols="12">
              <v-alert
                border="start"
                icon="mdi-translate"
                :text="sentence.translation"
                :title="$t('essays.translation_title')"
                type="info"
                variant="tonal"
              />
            </v-col>
            <v-col
              v-for="(mistake, mistakeIndex) in sentence.mistakes"
              :key="mistakeIndex"
              cols="12"
            >
              <v-alert
                border="start"
                icon="mdi-alert-circle"
                :title="mistake.type"
                type="warning"
                variant="tonal"
              >
                <template #text>
                  <span v-html="highlightQuotedText(mistake.mistake)" />
                </template>
              </v-alert>
            </v-col>
            <v-col v-if="sentence.correctedSentence && sentence.correctedSentence !== sentence.sentence" cols="12">
              <v-alert
                border="start"
                :text="sentence.correctedSentence"
                :title="$t('essays.corrected_sentence_title')"
                type="success"
                variant="tonal"
              />
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import type { SupportedLocale } from "@/i18n";
  import { defineBasicLoader } from "vue-router/experimental";
  import { essaysService as essaysRepository } from "@/services/essaysService";
  import { useLanguagesStore } from "@/stores/languages";
  import { getEstimationChipColor } from "@/utils/chip";
  import { formatRelativeDate } from "@/utils/date";
  import { highlightQuotedText } from "@/utils/strings";

  export const useEssayData = defineBasicLoader("/essays/[id]", async (route) => {
    return await essaysRepository.get(Number(route.params.id));
  });
</script>

<script setup lang="ts">
  const languagesStore = useLanguagesStore();
  const { data: essay } = useEssayData();
</script>

<style scoped>
.date-created {
  opacity: 0.7;
  font-size: 0.875rem;
}
.date-created__text {
  line-height: 32px;
}
</style>
