import i18n from "@/i18n";

export const getProgressColor = (
  progress: number,
): "success" | "warning" | "error" => {
  if (progress <= 30) return "error";
  else if (progress >= 31 && progress <= 60) return "warning";
  else return "success";
};

export const getTranslatorProgressRecommendation = (
  progress: number,
): string => {
  if (progress <= 30)
    return i18n.global.t("progress.recommendations.translator.low");
  else if (progress >= 31 && progress <= 60)
    return i18n.global.t("progress.recommendations.translator.medium");
  else if (progress >= 61 && progress <= 90)
    return i18n.global.t("progress.recommendations.translator.high");
  else
    return i18n.global.t("progress.recommendations.translator.perfect");
};

export const getAverageGrammarEstimationProgressRecommendation = (
  progress: number,
): string => {
  if (progress <= 30)
    return i18n.global.t("progress.recommendations.grammar.low");
  else if (progress >= 31 && progress <= 60)
    return i18n.global.t("progress.recommendations.grammar.medium");
  else if (progress >= 61 && progress <= 90)
    return i18n.global.t("progress.recommendations.grammar.high");
  else
    return i18n.global.t("progress.recommendations.grammar.perfect");
};
