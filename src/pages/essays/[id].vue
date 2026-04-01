<template>
  <v-container class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <v-sheet rounded class="px-4 py-3" v-if="essay">
          <v-row no-gutters>
            <v-col cols="9" class="d-flex ga-3 flex-wrap pb-3">
              <v-chip
                variant="tonal"
                :color="getEstimationChipColor(essay.grammarQuality.estimation)"
                prepend-icon="mdi-star"
              >
                {{ essay.grammarQuality.estimation }} — {{ $t('essays.grammar_estimation_label') }}
              </v-chip>
              <v-chip
                v-if="essay.numOfSentencesWithMistakes"
                prepend-icon="mdi-alert"
                variant="tonal"
                color="warning"
              >
                {{ essay.numOfSentencesWithMistakes }} {{ $t('essays.sentences_with_mistakes_label', essay.numOfSentencesWithMistakes) }}
              </v-chip>
              <v-chip
                v-if="essay.isTranslatorUsed"
                variant="tonal"
                color="primary"
                prepend-icon="mdi-translate"
              >
                {{ $t('essays.translator_used_label') }}
              </v-chip>
            </v-col>
            <v-col cols="3" class="text-right date-created">
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
            v-for="(sentence, i) in essay.analyzedSentences"
            v-bind:key="i"
          >
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12">
              {{ sentence.sentence }}
            </v-col>
            <v-col cols="12">
              <v-alert
                :text="sentence.translation"
                icon="mdi-translate"
                :title="$t('essays.translation_title')"
                type="info"
                variant="tonal"
                border="start"
              ></v-alert>
            </v-col>
            <v-col
              v-for="(mistake, i) in sentence.mistakes"
              v-bind:key="i"
              cols="12"
            >
              <v-alert
                :title="mistake.type"
                icon="mdi-alert"
                type="warning"
                variant="tonal"
                border="start"
              >
                <template v-slot:text>
                  <span v-html="highlightQuotedText(mistake.mistake)"></span>
                </template>
              </v-alert>
            </v-col>
            <v-col cols="12" v-if="sentence.correctedSentence && sentence.correctedSentence !== sentence.sentence">
              <v-alert
                :text="sentence.correctedSentence"
                :title="$t('essays.corrected_sentence_title')"
                type="success"
                variant="tonal"
                border="start"
              ></v-alert>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineBasicLoader } from "unplugin-vue-router/data-loaders/basic";
import { essaysService as essaysRepository } from "@/services/essaysService";

export const useEssayData = defineBasicLoader("/essays/[id]", async (route) => {
  return await essaysRepository.get(Number(route.params.id));
});
</script>

<script setup lang="ts">
import { highlightQuotedText } from "@/utils/strings";
import { getEstimationChipColor } from "@/utils/chip";
import { formatRelativeDate } from "@/utils/date";
import type { SupportedLocale } from "@/i18n";
import { useLanguagesStore } from "@/stores/languages";

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
