import { getDB } from "@/db";
import {
  idbGetAllByIndex,
  idbGetAllByIndexAndCount,
  idbGetAllByIndexAVG,
  idbPut,
  idbGet,
  idbGetAll,
  idbDelete,
  idbReduceByIndex,
} from "@/utils/db";

export interface Mistake {
  type: string;
  mistake: string;
}
export interface AnalyzedSentence {
  sentence: string;
  translation: string;
  mistakes: Mistake[];
  correctedSentence: string;
}

export interface GrammarQuality {
  estimation: number;
}

export interface AnalyzedEssayDto {
  text: string;
  date: Date;
  currentLanguage: string;
  targetLanguage: string;
  isTranslatorUsed: boolean;
  grammarQuality: GrammarQuality;
  numOfSentencesWithMistakes: number;
  numOfWords: number;
  analyzedSentences: AnalyzedSentence[];
}

export interface AnalyzedEssay extends AnalyzedEssayDto {
  id?: number;
}

const STORE_NAME = "essays";

export const essaysService = {
  get: (id: number) => idbGet<AnalyzedEssay>(getDB(), STORE_NAME, id),

  getAll: () => idbGetAll<AnalyzedEssay>(getDB(), STORE_NAME),

  put: (essay: AnalyzedEssay) =>
    idbPut<AnalyzedEssay>(getDB(), STORE_NAME, essay),

  delete: (id: number) => idbDelete(getDB(), STORE_NAME, id),

  getAllByIndex: (
    indexName: string,
    filters: { currentLanguage: string; targetLanguage: string },
    direction: IDBCursorDirection,
    where?: Partial<AnalyzedEssay>,
  ) =>
    idbGetAllByIndex<AnalyzedEssay>(
      getDB(),
      STORE_NAME,
      indexName,
      [filters.currentLanguage, filters.targetLanguage],
      direction,
      where,
    ),

  getAllByIndexAndCount: (
    indexName: string,
    filters: { currentLanguage: string; targetLanguage: string },
    direction: IDBCursorDirection,
    where?: Partial<AnalyzedEssay>,
  ) =>
    idbGetAllByIndexAndCount<AnalyzedEssay>(
      getDB(),
      STORE_NAME,
      indexName,
      [filters.currentLanguage, filters.targetLanguage],
      direction,
      where,
    ),

  getAllByIndexAVG: (
    indexName: string,
    filters: { currentLanguage: string; targetLanguage: string },
    direction: IDBCursorDirection,
    path: string,
  ) =>
    idbGetAllByIndexAVG<AnalyzedEssay>(
      getDB(),
      STORE_NAME,
      indexName,
      [filters.currentLanguage, filters.targetLanguage],
      direction,
      path,
    ),

  reduceByIndex: <R>(
    indexName: string,
    filters: { currentLanguage: string; targetLanguage: string },
    direction: IDBCursorDirection,
    reducer: (acc: R, item: AnalyzedEssay) => R,
    initialValue: R,
  ) =>
    idbReduceByIndex<AnalyzedEssay, R>(
      getDB(),
      STORE_NAME,
      indexName,
      [filters.currentLanguage, filters.targetLanguage],
      direction,
      reducer,
      initialValue,
    ),
};
