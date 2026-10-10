import { ref } from "vue";
import {
  dictionaryRepository,
  essaysRepository,
} from "@/db";
import { useDictionary } from "@/composables/useDictionary";
import { useEssays } from "@/composables/useEssays";
import { useDraftStore } from "@/stores/draft";
import { useLanguageStore } from "@/stores/language";

export function useDataManagement() {
  const languageStore = useLanguageStore();
  const draftStore = useDraftStore();
  const { reload: reloadEssays } = useEssays();
  const { reload: reloadDictionary } = useDictionary();

  const isExporting = ref(false);

  const exportData = async () => {
    if (isExporting.value) return;
    isExporting.value = true;
    try {
      const data = {
        dictionaryEntries: await dictionaryRepository.getAll(),
        essays: await essaysRepository.getAll(),
        currentLanguage: languageStore.currentLanguage,
        targetLanguage: languageStore.targetLanguage,
      };
      const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.llea";
      document.body.append(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      isExporting.value = false;
    }
  };

  const importData = async (file: File) => {
    try {
      const result = await file.text();
      const data = JSON.parse(result);

      if (data.dictionaryEntries?.length) {
        await dictionaryRepository.putMany(data.dictionaryEntries);
      }
      if (data.essays?.length) {
        await essaysRepository.putMany(
          data.essays.map((entry: any) => ({
            ...entry,
            date: new Date(entry.date),
            earnedPoints: entry.earnedPoints ?? 0,
          })),
        );
      }

      if (data.currentLanguage) {
        languageStore.setCurrentLanguage(data.currentLanguage);
      }
      if (data.targetLanguage) {
        languageStore.setTargetLanguage(data.targetLanguage);
      }

      await reloadEssays();
      await reloadDictionary();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const clearAllData = async () => {
    try {
      await dictionaryRepository.clear();
      await essaysRepository.clear();

      draftStore.resetDraft();

      await reloadEssays();
      await reloadDictionary();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return {
    isExporting,
    exportData,
    importData,
    clearAllData,
  };
}
