import { effectScope, ref, watch } from "vue";
import type {
  AnalyzedEssay,
  AnalyzedSentence,
  DictionaryEntry,
} from "@/db";
import { essaysRepository } from "@/db";
import { useDictionary } from "@/composables/useDictionary";
import { useDraftStore } from "@/stores/draft";
import { useLanguageStore } from "@/stores/language";
import { calculateEssayPoints } from "@/utils/progress";
import { countWords } from "@/utils/text";

const essays = ref<AnalyzedEssay[]>([]);
const isLoading = ref(false);
let isInitialized = false;

export interface SaveAnalysisParams {
  text: string;
  isTranslatorUsed: boolean;
  analyzedSentences: AnalyzedSentence[];
  grammarEstimation: number;
  dictionaryEntries: Omit<DictionaryEntry, "currentLanguage" | "targetLanguage">[];
}

export function useEssays() {
  const languageStore = useLanguageStore();

  const load = async () => {
    isLoading.value = true;
    try {
      essays.value = await essaysRepository.getByLanguagePair({
        currentLanguage: languageStore.currentLanguage,
        targetLanguage: languageStore.targetLanguage,
      });
    } catch (error) {
      console.error("Failed to load essays:", error);
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

  const getEssayById = async (id: number): Promise<AnalyzedEssay | undefined> => {
    const essayInList = essays.value.find(item => item.id === id);
    if (essayInList) return essayInList;
    return await essaysRepository.get(id);
  };

  const addEssay = async (essay: AnalyzedEssay) => {
    await essaysRepository.put(essay);
    await load();
  };

  const saveAnalysisResult = async (params: SaveAnalysisParams) => {
    const numOfMistakes = params.analyzedSentences.reduce(
      (count, sentence) => count + sentence.mistakes.length,
      0,
    );
    const numOfSentencesWithMistakes = params.analyzedSentences.reduce(
      (count, sentence) => (sentence.mistakes.length > 0 ? count + 1 : count),
      0,
    );
    const numOfSentencesWithoutMistakes
      = params.analyzedSentences.length - numOfSentencesWithMistakes;

    const earnedPoints = calculateEssayPoints({
      totalSentences: params.analyzedSentences.length,
      sentencesWithoutMistakes: numOfSentencesWithoutMistakes,
      grammarEstimation: params.grammarEstimation,
      isTranslatorUsed: params.isTranslatorUsed,
    });

    const newAnalyzedEssay: AnalyzedEssay = {
      text: params.text,
      date: new Date(),
      grammarQuality: { estimation: params.grammarEstimation },
      isTranslatorUsed: params.isTranslatorUsed,
      currentLanguage: languageStore.currentLanguage,
      targetLanguage: languageStore.targetLanguage,
      numOfWords: countWords(params.text),
      numOfMistakes,
      numOfSentencesWithMistakes,
      analyzedSentences: params.analyzedSentences,
      earnedPoints,
    };

    await essaysRepository.put(newAnalyzedEssay);

    if (params.dictionaryEntries.length > 0) {
      const { addEntries } = useDictionary();
      await addEntries(params.dictionaryEntries);
    }

    await load();

    const draftStore = useDraftStore();
    draftStore.resetDraft();
  };

  return {
    essays,
    isLoading,
    reload: load,
    getEssayById,
    addEssay,
    saveAnalysisResult,
  };
}
