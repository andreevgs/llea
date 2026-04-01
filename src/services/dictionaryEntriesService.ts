import { getDB } from "@/db";
import {
  idbGetAllByIndex,
  idbGetAllByIndexAndCount,
  idbGetAllByIndexAVG,
  idbPut,
  idbGet,
  idbGetAll,
  idbDelete,
} from "@/utils/db";

export interface DictionaryEntryDto {
  word: string;
  pronunciation: string;
  translate: string;
  currentLanguage: string;
  targetLanguage: string;
}

export interface DictionaryEntry extends DictionaryEntryDto {
  id?: number;
}

const STORE_NAME = "dictionary-entries";

export const dictionaryEntriesService = {
  get: (id: number) => idbGet<DictionaryEntry>(getDB(), STORE_NAME, id),
  getAll: () => idbGetAll<DictionaryEntry>(getDB(), STORE_NAME),
  put: (entry: DictionaryEntry) =>
    idbPut<DictionaryEntry>(getDB(), STORE_NAME, entry),
  delete: (id: number) => idbDelete(getDB(), STORE_NAME, id),

  getAllByIndex: (
    indexName: string,
    filters: { currentLanguage: string; targetLanguage: string },
    direction: IDBCursorDirection,
    where?: Partial<DictionaryEntry>,
  ) =>
    idbGetAllByIndex<DictionaryEntry>(
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
    where?: Partial<DictionaryEntry>,
  ) =>
    idbGetAllByIndexAndCount<DictionaryEntry>(
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
    idbGetAllByIndexAVG<DictionaryEntry>(
      getDB(),
      STORE_NAME,
      indexName,
      [filters.currentLanguage, filters.targetLanguage],
      direction,
      path,
    ),
};
