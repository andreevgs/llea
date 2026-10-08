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
        rounded
        to="/new-essay"
        variant="tonal"
      >{{ $t("app_bar.new_essay") }}</v-btn>
    </div>
  </v-container>
  <v-container v-else class="pa-0">
    <v-card
      v-for="essay in essays"
      :key="essay.id"
      class="mb-4 border-sm"
      elevation="0"
      link
      :ripple="false"
      rounded="xl"
      :to="{ name: '/essays/[id]', params: { id: essay.id } }"
    >
      <div class="d-flex flex-row ga-2 align-top px-4 pt-3">
        <v-tooltip
          :text="`${$t('essays.grammar_estimation_label')}: ${essay.grammarQuality.estimation} ${$t('essays.out_of_10')}`"
        >
          <template #activator="{ props }">
            <v-chip
              v-bind="props"
              class="cursor-pointer rounded-lg"
              :color="
                getEstimationChipColor(essay.grammarQuality.estimation)
              "
              label
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
              class="cursor-pointer rounded-lg"
              color="warning"
              label
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
              class="cursor-pointer rounded-lg"
              label
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
              class="cursor-pointer rounded-lg"
              color="primary"
              label
              variant="tonal"
            >
              <v-icon>mdi-translate</v-icon>
            </v-chip>
          </template>
        </v-tooltip>
        <v-spacer />
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
      <div class="pa-4">
        <span class="text-body-medium">{{ essay.text }}</span>
      </div>
      <div class="pb-4 px-4 d-flex flex-row ga-2">
        <v-chip class="cursor-pointer rounded-lg">
          {{ essay.analyzedSentences.length }} {{ $t('essays.sentences_label', essay.analyzedSentences.length) }}
        </v-chip>
        <v-chip class="cursor-pointer rounded-lg">
          {{ essay.numOfWords }} {{ $t('essays.words_label', essay.numOfWords) }}
        </v-chip>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  import type { SupportedLocale } from "@/i18n";
  import { useEssays } from "@/composables/useEssays";
  import { useLanguageStore } from "@/stores/language";
  import { getEstimationChipColor } from "@/utils/chip";
  import { formatRelativeDate } from "@/utils/date";

  const languageStore = useLanguageStore();
  const { essays } = useEssays();
</script>

<style scoped></style>
