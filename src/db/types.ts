export interface LanguagePair {
  currentLanguage: string;
  targetLanguage: string;
}

export interface QueryOptions {
  limit?: number;
  direction?: IDBCursorDirection;
}

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

export interface AnalyzedEssay {
  id?: number;
  text: string;
  date: Date;
  currentLanguage: string;
  targetLanguage: string;
  isTranslatorUsed: boolean;
  grammarQuality: GrammarQuality;
  numOfMistakes: number;
  numOfSentencesWithMistakes: number;
  numOfWords: number;
  analyzedSentences: AnalyzedSentence[];
}

export interface DictionaryEntry {
  id?: number;
  word: string;
  pronunciation: string;
  translate: string;
  currentLanguage: string;
  targetLanguage: string;
}

export interface ProgressEntry {
  id?: number;
  points: number;
  currentLanguage: string;
  targetLanguage: string;
}

export interface ProgressHistory {
  id?: number;
  previousPointsValue: number;
  newPointsValue: number;
  date: Date;
  currentLanguage: string;
  targetLanguage: string;
}
