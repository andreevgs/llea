import { defineStore } from "pinia";
import { ref, watch } from "vue";

const STORAGE_KEY = "new_essay";
const savedEssay = localStorage.getItem(STORAGE_KEY) || "";

export const useDraftStore = defineStore("draft", () => {
  const newEssay = ref<string>(savedEssay);
  const isNewEssayTranslatorUsed = ref(false);

  watch(newEssay, (newValue) => {
    localStorage.setItem(STORAGE_KEY, newValue);
  });

  const resetDraft = () => {
    newEssay.value = "";
    isNewEssayTranslatorUsed.value = false;
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    newEssay,
    isNewEssayTranslatorUsed,
    resetDraft,
  };
});
