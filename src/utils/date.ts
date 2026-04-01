import { format, formatDistance, subDays, Locale } from "date-fns";
import { enGB, be, ru, pl, lt, tr, es } from "date-fns/locale";
import type { SupportedLocale } from "@/i18n";

const locales: Record<SupportedLocale, Locale> = { en: enGB, be, ru, pl, lt, tr, es };

export const formatRelativeDate = (
  date: Date,
  locale: SupportedLocale,
) => {
  const now = new Date();
  const weekAgo = subDays(now, 7);
  if (date > weekAgo) {
    return formatDistance(date, now, {
      addSuffix: true,
      locale: locales[locale] || enGB,
    });
  } else {
    return format(date, "P", { locale: locales[locale] || enGB });
  }
};
