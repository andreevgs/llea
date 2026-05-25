import { defineStore } from "pinia";
import { ref } from "vue";

export const useSystemStore = defineStore("system", () => {
  const lastUpdateTimestamp = ref(Date.now());
  const isTextPlaying = ref(false);
  const currentPlayingText = ref<string | null>(null);

  function triggerUpdate() {
    lastUpdateTimestamp.value = Date.now();
  }

  return {
    lastUpdateTimestamp,
    triggerUpdate,
    isTextPlaying,
    currentPlayingText,
  };
});
