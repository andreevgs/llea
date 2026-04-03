import type { SupportedLocale } from "@/i18n";
import type { Locale } from "date-fns";
import { format, formatDistance, subDays } from "date-fns";
import { be, enGB, es, lt, pl, ru, tr } from "date-fns/locale";

const locales: Record<SupportedLocale, Locale> = {
  en: enGB,
  be,
  ru,
  pl,
  lt,
  tr,
  es,
};

export const formatRelativeDate = (date: Date, locale: SupportedLocale) => {
  const now = new Date();
  const weekAgo = subDays(now, 7);
  return date > weekAgo
    ? formatDistance(date, now, {
        addSuffix: true,
        locale: locales[locale] || enGB,
      })
    : format(date, "P", { locale: locales[locale] || enGB });
};
