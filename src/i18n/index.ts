import { createI18n } from "vue-i18n";
import be from "./locales/be.json";
import de from "./locales/de.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import beEssayIdeas from "./locales/essay-ideas/be.json";
import deEssayIdeas from "./locales/essay-ideas/de.json";
import enEssayIdeas from "./locales/essay-ideas/en.json";
import esEssayIdeas from "./locales/essay-ideas/es.json";
import ltEssayIdeas from "./locales/essay-ideas/lt.json";
import plEssayIdeas from "./locales/essay-ideas/pl.json";
import ruEssayIdeas from "./locales/essay-ideas/ru.json";
import trEssayIdeas from "./locales/essay-ideas/tr.json";
import lt from "./locales/lt.json";
import pl from "./locales/pl.json";
import ru from "./locales/ru.json";
import tr from "./locales/tr.json";

Object.assign(be, { essay_ideas: beEssayIdeas });
Object.assign(de, { essay_ideas: deEssayIdeas });
Object.assign(en, { essay_ideas: enEssayIdeas });
Object.assign(es, { essay_ideas: esEssayIdeas });
Object.assign(lt, { essay_ideas: ltEssayIdeas });
Object.assign(pl, { essay_ideas: plEssayIdeas });
Object.assign(ru, { essay_ideas: ruEssayIdeas });
Object.assign(tr, { essay_ideas: trEssayIdeas });

const slavicPluralRule = (choice: number, choicesLength: number) => {
  if (choice === 0) {
    return 0;
  }
  const teen = choice > 10 && choice < 20;
  const endsWithOne = choice % 10 === 1;
  if (!teen && endsWithOne) {
    return 1;
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2;
  }
  return choicesLength < 4 ? 2 : 3;
};

const plPluralRule = (choice: number, choicesLength: number) => {
  if (choice === 0) {
    return 0;
  }
  if (choice === 1) {
    return 1;
  }
  const endsWithFew = choice % 10 >= 2 && choice % 10 <= 4;
  const teen = choice % 100 >= 12 && choice % 100 <= 14;
  if (endsWithFew && !teen) {
    return 2;
  }
  return choicesLength < 4 ? 2 : 3;
};

const ltPluralRule = (choice: number, choicesLength: number) => {
  if (choice === 0) {
    return 0;
  }
  if (choice % 10 === 1 && choice % 100 !== 11) {
    return 1;
  }
  if (choice % 10 >= 2 && (choice % 100 < 10 || choice % 100 >= 20)) {
    return 2;
  }
  return choicesLength < 4 ? 2 : 3;
};

export const localesMessages = { ru, en, pl, be, lt, tr, es, de };

export type SupportedLocale = keyof typeof localesMessages;

export default createI18n({
  legacy: false,
  locale: localStorage.getItem("current_language") || "ru",
  fallbackLocale: "en",
  pluralRules: {
    ru: slavicPluralRule,
    be: slavicPluralRule,
    pl: plPluralRule,
    lt: ltPluralRule,
  },
  messages: localesMessages,
});
