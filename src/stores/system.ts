import { defineStore } from "pinia";
import { ref } from "vue";

export const useSystemStore = defineStore("system", () => {
  const lastUpdateTimestamp = ref(Date.now());

  function triggerUpdate() {
    lastUpdateTimestamp.value = Date.now();
  }

  return {
    lastUpdateTimestamp,
    triggerUpdate,
  };
});
