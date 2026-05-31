import { ESSAY_IDEAS, NEXT_ESSAY_IDEA_LOADING_TIME_MS } from "@/const/essays";
import i18n from "@/i18n";

export const getRandomEssayIdea = (): string => {
  const randomIndex = Math.floor(Math.random() * ESSAY_IDEAS.length);
  return i18n.global.t(ESSAY_IDEAS[randomIndex]);
};

export const getRandomEssayIdeaWithDelay = (
  delayMs = NEXT_ESSAY_IDEA_LOADING_TIME_MS,
): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getRandomEssayIdea());
    }, delayMs);
  });
};
