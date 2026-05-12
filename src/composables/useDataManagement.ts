import { ref } from "vue";
import { dictionaryEntriesService } from "@/services/dictionaryEntriesService";
import { essaysService } from "@/services/essaysService";
import { progressEntriesService } from "@/services/progressEntriesService";
import { progressHistoryService } from "@/services/progressHistoryService";
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
        dictionaryEntries: await dictionaryEntriesService.getAll(),
        essays: await essaysService.getAll(),
        progressEntries: await progressEntriesService.getAll(),
        progressHistory: await progressHistoryService.getAll(),
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

      if (data.dictionaryEntries) {
        for (const entry of data.dictionaryEntries) {
          await dictionaryEntriesService.put(entry);
        }
      }
      if (data.essays) {
        for (const entry of data.essays) {
          await essaysService.put(entry);
        }
      }
      if (data.progressEntries) {
        for (const entry of data.progressEntries) {
          await progressEntriesService.put(entry);
        }
      }
      if (data.progressHistory) {
        for (const entry of data.progressHistory) {
          await progressHistoryService.put(entry);
        }
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
      await dictionaryEntriesService.clear();
      await essaysService.clear();
      await progressEntriesService.clear();
      await progressHistoryService.clear();

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
