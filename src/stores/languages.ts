import { defineStore } from "pinia";
import { ref } from "vue";

const savedCurrentLanguage = localStorage.getItem("current_language");
const savedTargetLanguage = localStorage.getItem("target_language");

const selectedCurrentLanguage = savedCurrentLanguage || "ru";
const selectedTargetLanguage = savedTargetLanguage || "en";

if (!savedCurrentLanguage)
  localStorage.setItem("current_language", selectedCurrentLanguage);
if (!savedTargetLanguage)
  localStorage.setItem("target_language", selectedTargetLanguage);

export const useLanguagesStore = defineStore("languages", () => {
  const currentLanguage = ref<string>(selectedCurrentLanguage);
  const targetLanguage = ref<string>(selectedTargetLanguage);
  function setCurrentLanguage(code: string) {
    localStorage.setItem("current_language", code);
    currentLanguage.value = code;
  }
  function setTargetLanguage(code: string) {
    localStorage.setItem("target_language", code);
    targetLanguage.value = code;
  }

  return {
    currentLanguage,
    targetLanguage,
    setCurrentLanguage,
    setTargetLanguage,
  };
});
