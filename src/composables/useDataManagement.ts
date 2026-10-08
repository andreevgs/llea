import { ref } from "vue";
import {
  dictionaryRepository,
  essaysRepository,
  progressEntriesRepository,
  progressHistoryRepository,
} from "@/db";
import { useEssaysStore } from "@/stores/essays";
import { useLanguagesStore } from "@/stores/languages";
import { useSystemStore } from "@/stores/system";

export function useDataManagement() {
  const languagesStore = useLanguagesStore();
  const systemStore = useSystemStore();
  const essaysStore = useEssaysStore();

  const isExporting = ref(false);

  const exportData = async () => {
    if (isExporting.value) return;
    isExporting.value = true;
    try {
      const data = {
        dictionaryEntries: await dictionaryRepository.getAll(),
        essays: await essaysRepository.getAll(),
        progressEntries: await progressEntriesRepository.getAll(),
        progressHistory: await progressHistoryRepository.getAll(),
        currentLanguage: languagesStore.currentLanguage,
        targetLanguage: languagesStore.targetLanguage,
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
          })),
        );
      }
      if (data.progressEntries?.length) {
        await progressEntriesRepository.putMany(data.progressEntries);
      }
      if (data.progressHistory?.length) {
        await progressHistoryRepository.putMany(
          data.progressHistory.map((entry: any) => ({
            ...entry,
            date: new Date(entry.date),
          })),
        );
      }

      if (data.currentLanguage) {
        languagesStore.setCurrentLanguage(data.currentLanguage);
      }
      if (data.targetLanguage) {
        languagesStore.setTargetLanguage(data.targetLanguage);
      }

      systemStore.triggerUpdate();
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
      await progressEntriesRepository.clear();
      await progressHistoryRepository.clear();

      essaysStore.newEssay = "";
      essaysStore.isNewEssayTranslatorUsed = false;

      systemStore.triggerUpdate();
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
