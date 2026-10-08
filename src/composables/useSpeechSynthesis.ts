import { ref } from "vue";

const isTextPlaying = ref(false);
const currentPlayingText = ref<string | null>(null);

export function useSpeechSynthesis() {
  const speak = (text: string, lang?: string) => {
    if (!window.speechSynthesis) {
      console.warn("SpeechSynthesis API is not supported in this browser.");
      return;
    }

    if (isTextPlaying.value && currentPlayingText.value === text) {
      window.speechSynthesis.cancel();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (lang) {
      utterance.lang = lang;
    }

    utterance.onstart = () => {
      isTextPlaying.value = true;
      currentPlayingText.value = text;
    };

    utterance.onend = () => {
      if (currentPlayingText.value === text) {
        isTextPlaying.value = false;
        currentPlayingText.value = null;
      }
    };

    utterance.onerror = () => {
      if (currentPlayingText.value === text) {
        isTextPlaying.value = false;
        currentPlayingText.value = null;
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  return {
    speak,
    stop,
    isTextPlaying,
    currentPlayingText,
  };
}
