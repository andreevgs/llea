import { computed } from "vue";
import type { AnalyzedEssay } from "@/db";
import { useEssays } from "@/composables/useEssays";
import {
  type CountResult,
  getDefaultCountResult,
} from "@/utils/progress";

export interface ProgressData {
  hasData: boolean;
  points: number;
  latestEssay: AnalyzedEssay | null;
  essaysWithoutMistakes: CountResult;
  essaysWithoutTranslator: CountResult;
  averageGrammarEstimation: number;
}

export function useProgress() {
  const { essays, isLoading } = useEssays();

  const progressData = computed<ProgressData>(() => {
    if (essays.value.length === 0) {
      return {
        hasData: false,
        points: 0,
        latestEssay: null,
        essaysWithoutMistakes: getDefaultCountResult(),
        essaysWithoutTranslator: getDefaultCountResult(),
        averageGrammarEstimation: 0,
      };
    }

    const latestEssay = essays.value[0];
    const points = Math.min(
      100,
      Math.max(
        0,
        essays.value.reduce((sum, essay) => sum + (essay.earnedPoints || 0), 0),
      ),
    );

    const recentEssays = essays.value.slice(0, 10);
    let totalSentences = 0;
    let cleanSentences = 0;
    let withoutTranslatorCount = 0;
    let totalGrammarScore = 0;

    for (const essay of recentEssays) {
      totalSentences += essay.analyzedSentences.length;
      cleanSentences += (essay.analyzedSentences.length - essay.numOfSentencesWithMistakes);
      if (!essay.isTranslatorUsed) {
        withoutTranslatorCount++;
      }
      totalGrammarScore += (essay.grammarQuality?.estimation ?? 0);
    }

    return {
      hasData: true,
      points,
      latestEssay,
      essaysWithoutMistakes: {
        count: cleanSentences,
        totalCount: totalSentences,
      },
      essaysWithoutTranslator: {
        count: withoutTranslatorCount,
        totalCount: recentEssays.length,
      },
      averageGrammarEstimation: Number((totalGrammarScore / recentEssays.length).toFixed(1)),
    };
  });

  const progressPointsDelta = computed(() => {
    if (!progressData.value.latestEssay?.earnedPoints) return null;
    return progressData.value.latestEssay.earnedPoints;
  });

  const essaysWithoutMistakesProgress = computed(() => {
    if (!progressData.value.essaysWithoutMistakes.totalCount) return 0;
    return (
      (progressData.value.essaysWithoutMistakes.count
        / progressData.value.essaysWithoutMistakes.totalCount)
      * 100
    );
  });

  const essaysWithoutTranslatorProgress = computed(() => {
    if (!progressData.value.essaysWithoutTranslator.totalCount) return 0;
    return (
      (progressData.value.essaysWithoutTranslator.count
        / progressData.value.essaysWithoutTranslator.totalCount)
      * 100
    );
  });

  return {
    progressData,
    progressPointsDelta,
    essaysWithoutMistakesProgress,
    essaysWithoutTranslatorProgress,
    isLoading,
  };
}
