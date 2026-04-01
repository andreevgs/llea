import { defineStore } from "pinia";
import { ref, watch } from "vue";

const savedEssay = localStorage.getItem("new_essay") || "";

export const useEssaysStore = defineStore("essays", () => {
  const newEssay = ref<string>(savedEssay);
  const isNewEssayTranslatorUsed = ref(false);

  watch(newEssay, (newValue) => {
    localStorage.setItem("new_essay", newValue);
  });

  return {
    newEssay,
    isNewEssayTranslatorUsed,
  };
});
