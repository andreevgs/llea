import i18n from "@/i18n";

export interface CountResult {
  count: number;
  totalCount: number;
}

export const getDefaultCountResult = (): CountResult => ({
  count: 0,
  totalCount: 0,
});

export const getProgressColor = (
  progress: number,
): "success" | "warning" | "error" => {
  if (progress <= 30) return "error";
  if (progress <= 60) return "warning";
  return "success";
};

export const getCleanSentencesProgressRecommendation = (
  progress: number,
): string => {
  if (progress <= 30)
    return i18n.global.t("progress.recommendations.sentences.low");
  if (progress <= 60)
    return i18n.global.t("progress.recommendations.sentences.medium");
  if (progress <= 90)
    return i18n.global.t("progress.recommendations.sentences.high");
  return i18n.global.t("progress.recommendations.sentences.perfect");
};

export const getTranslatorProgressRecommendation = (
  progress: number,
): string => {
  if (progress <= 30)
    return i18n.global.t("progress.recommendations.translator.low");
  if (progress <= 60)
    return i18n.global.t("progress.recommendations.translator.medium");
  if (progress <= 90)
    return i18n.global.t("progress.recommendations.translator.high");
  return i18n.global.t("progress.recommendations.translator.perfect");
};

export const getAverageGrammarEstimationProgressRecommendation = (
  progress: number,
): string => {
  if (progress <= 30)
    return i18n.global.t("progress.recommendations.grammar.low");
  if (progress <= 60)
    return i18n.global.t("progress.recommendations.grammar.medium");
  if (progress <= 90)
    return i18n.global.t("progress.recommendations.grammar.high");
  return i18n.global.t("progress.recommendations.grammar.perfect");
};

export interface EssayPointsInput {
  totalSentences: number;
  sentencesWithoutMistakes: number;
  grammarEstimation: number; // 0..10
  isTranslatorUsed: boolean;
}

export const calculateEssayPoints = (input: EssayPointsInput): number => {
  const basePoints = 2;
  const accuracyRatio = input.totalSentences > 0
    ? Math.max(0, Math.min(1, input.sentencesWithoutMistakes / input.totalSentences))
    : 0;
  const accuracyBonus = accuracyRatio * 4;

  const normalizedGrammar = Math.max(0, Math.min(10, input.grammarEstimation));
  const grammarBonus = (normalizedGrammar / 10) * 4;

  const totalRaw = basePoints + accuracyBonus + grammarBonus;
  const multiplier = input.isTranslatorUsed ? 0.5 : 1.0;

  return Math.max(1, Math.round(totalRaw * multiplier));
};
