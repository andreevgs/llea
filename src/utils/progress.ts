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
    return "Вы часто полагаетесь на переводчик. Стремитесь к самостоятельному написанию текстов, чтобы лучше усвоить язык.";
  else if (progress >= 31 && progress <= 60)
    return "Вы начинаете писать самостоятельно. Продолжайте в том же духе, постепенно уменьшая зависимость от переводчика.";
  else if (progress >= 61 && progress <= 90)
    return "Вы редко используете переводчик. Это хороший знак вашего прогресса в изучении языка.";
  else
    return "Вы практически не используете переводчик. Ваша способность самостоятельно выражать мысли на изучаемом языке впечатляет";
};

export const getAverageGrammarEstimationProgressRecommendation = (
  progress: number,
): string => {
  if (progress <= 30)
    return "Необходимо уделить больше внимания грамматике. Используйте дополнительные ресурсы для обучения.";
  else if (progress >= 31 && progress <= 60)
    return "У вас есть базовое понимание грамматики. Продолжайте изучение и расширяйте свои знания.";
  else if (progress >= 61 && progress <= 90)
    return "Ваша грамматика хороша. Попробуйте более сложные упражнения для дальнейшего улучшения.";
  else
    return "Вы демонстрируете отличное владение грамматикой. Оставайтесь в курсе последних изменений и нюансов языка.";
};
