import { effectScope, ref, watch } from "vue";
import type { DictionaryEntry } from "@/db";
import { dictionaryRepository } from "@/db";
import { useLanguageStore } from "@/stores/language";

const dictionary = ref<DictionaryEntry[]>([]);
const isLoading = ref(false);
let isInitialized = false;

export function useDictionary() {
  const languageStore = useLanguageStore();

  const load = async () => {
    isLoading.value = true;
    try {
      dictionary.value = await dictionaryRepository.getByLanguagePair({
        currentLanguage: languageStore.currentLanguage,
        targetLanguage: languageStore.targetLanguage,
      });
    } catch (error) {
      console.error("Failed to load dictionary:", error);
    } finally {
      isLoading.value = false;
    }
  };

  if (!isInitialized) {
    isInitialized = true;
    const scope = effectScope(true);
    scope.run(() => {
      watch(
        [() => languageStore.currentLanguage, () => languageStore.targetLanguage],
        () => {
          load();
        },
        { immediate: true },
      );
    });
  }

  const addEntries = async (
    entries: Omit<DictionaryEntry, "currentLanguage" | "targetLanguage">[],
  ) => {
    if (entries.length === 0) return;
    await dictionaryRepository.putMany(
      entries.map(entry => ({
        ...entry,
        currentLanguage: languageStore.currentLanguage,
        targetLanguage: languageStore.targetLanguage,
      })),
    );
    await load();
  };

  return {
    dictionary,
    isLoading,
    reload: load,
    addEntries,
  };
}
