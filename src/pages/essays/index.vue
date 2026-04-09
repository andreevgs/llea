<template>
  <v-container v-if="essays.length === 0" class="fill-height">
    <div class="h-100 d-flex flex-column justify-center flex-grow-1">
      <v-icon
        class="align-self-center mb-2"
        color="warning"
        icon="mdi-book-open-page-variant"
        style="font-size: 6em"
      />
      <p class="align-self-center text-disabled mb-4">
        {{ $t("essays.no_data") }}
      </p>
      <v-btn
        class="align-self-center"
        color="warning"
        to="/new-essay"
        variant="tonal"
      >{{ $t("app_bar.new_essay") }}</v-btn>
    </div>
  </v-container>
  <v-container v-else class="pa-0">
    <v-row>
      <v-col v-for="essay in essays" :key="essay.id" cols="12">
        <v-card
          link
          :ripple="false"
          :to="{ name: '/essays/[id]', params: { id: essay.id } }"
        >
          <v-card-item>
            <v-card-subtitle class="d-flex flex-row ga-2 align-center">
              <v-tooltip
                :text="`${$t('essays.grammar_estimation_label')}: ${essay.grammarQuality.estimation} ${$t('essays.out_of_10')}`"
              >
                <template #activator="{ props }">
                  <v-chip
                    v-bind="props"
                    class="cursor-pointer"
                    :color="
                      getEstimationChipColor(essay.grammarQuality.estimation)
                    "
                    prepend-icon="mdi-star"
                    variant="tonal"
                  >
                    {{ essay.grammarQuality.estimation }}
                  </v-chip>
                </template>
              </v-tooltip>
              <v-tooltip
                v-if="essay.numOfMistakes"
                :text="`${essay.numOfMistakes} ${$t('essays.mistakes_label', essay.numOfMistakes)}`"
              >
                <template #activator="{ props }">
                  <v-chip
                    v-bind="props"
                    class="cursor-pointer"
                    color="warning"
                    prepend-icon="mdi-alert-circle"
                    variant="tonal"
                  >
                    {{ essay.numOfMistakes }}
                  </v-chip>
                </template>
              </v-tooltip>
              <v-tooltip
                v-if="essay.numOfSentencesWithMistakes"
                :text="`${essay.numOfSentencesWithMistakes} ${$t('essays.sentences_with_mistakes_label', essay.numOfSentencesWithMistakes)}`"
              >
                <template #activator="{ props }">
                  <v-chip
                    v-bind="props"
                    class="cursor-pointer"
                    prepend-icon="mdi-alert"
                    variant="tonal"
                  >
                    {{ essay.numOfSentencesWithMistakes }}
                  </v-chip>
                </template>
              </v-tooltip>

              <v-tooltip
                v-if="essay.isTranslatorUsed"
                :text="$t('essays.translator_used_label')"
              >
                <template #activator="{ props }">
                  <v-chip
                    v-bind="props"
                    class="cursor-pointer"
                    color="primary"
                    variant="tonal"
                  >
                    <v-icon>mdi-translate</v-icon>
                  </v-chip>
                </template>
              </v-tooltip>
              <v-spacer />
              <span>{{
                formatRelativeDate(
                  essay.date,
                  languagesStore.currentLanguage as SupportedLocale,
                )
              }}</span>
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            {{ essay.text }}
          </v-card-text>
          <div class="pb-4 px-4 d-flex flex-row ga-2">
            <v-chip class="cursor-pointer">
              {{ essay.analyzedSentences.length }} {{ $t('essays.sentences_label', essay.analyzedSentences.length) }}
            </v-chip>
            <v-chip class="cursor-pointer">
              {{ essay.numOfWords }} {{ $t('essays.words_label', essay.numOfWords) }}
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import type { SupportedLocale } from "@/i18n";
  import { watch } from "vue";
  import { defineBasicLoader } from "vue-router/experimental";
  import { essaysService as essaysRepository } from "@/services/essaysService";
  import { useLanguagesStore } from "@/stores/languages";
  import { getEstimationChipColor } from "@/utils/chip";
  import { formatRelativeDate } from "@/utils/date";
  const languagesStore = useLanguagesStore();

  export const useEssaysData = defineBasicLoader("/essays/", async () => {
    const essays = await essaysRepository.getAllByIndex(
      "languagePair",
      {
        currentLanguage: languagesStore.currentLanguage,
        targetLanguage: languagesStore.targetLanguage,
      },
      "prev",
    );
    return essays;
  });
</script>

<script setup lang="ts">
  const { data: essays, reload } = useEssaysData();
  watch(languagesStore, () => {
    reload();
  });
</script>

<style scoped></style>
