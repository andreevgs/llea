import type { SupportedLocale } from "@/i18n";
import type { Locale } from "date-fns";
import { format, formatDistance, subDays } from "date-fns";
import { be, de, enGB, es, lt, pl, ru, tr } from "date-fns/locale";

const locales: Record<SupportedLocale, Locale> = {
  en: enGB,
  be,
  ru,
  pl,
  lt,
  tr,
  es,
  de,
};

export const formatRelativeDate = (date: Date | string, locale: SupportedLocale) => {
  const d = new Date(date);
  const now = new Date();
  const weekAgo = subDays(now, 7);
  return d > weekAgo
    ? formatDistance(d, now, {
        addSuffix: true,
        locale: locales[locale] || enGB,
      })
    : format(d, "P", { locale: locales[locale] || enGB });
};
