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

export interface ProgressEntryDto {
  points: number;
  currentLanguage: string;
  targetLanguage: string;
}

export interface ProgressEntry extends ProgressEntryDto {
  id?: number;
}

const STORE_NAME = "progress-entries";

export const progressEntriesService = {
  get: (id: number) => idbGet<ProgressEntry>(getDB(), STORE_NAME, id),
  getAll: () => idbGetAll<ProgressEntry>(getDB(), STORE_NAME),
  put: (entry: ProgressEntry) =>
    idbPut<ProgressEntry>(getDB(), STORE_NAME, entry),
  delete: (id: number) => idbDelete(getDB(), STORE_NAME, id),

  getAllByIndex: (
    indexName: string,
    filters: { currentLanguage: string; targetLanguage: string },
    direction: IDBCursorDirection,
    where?: Partial<ProgressEntry>,
  ) =>
    idbGetAllByIndex<ProgressEntry>(
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
    where?: Partial<ProgressEntry>,
  ) =>
    idbGetAllByIndexAndCount<ProgressEntry>(
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
    idbGetAllByIndexAVG<ProgressEntry>(
      getDB(),
      STORE_NAME,
      indexName,
      [filters.currentLanguage, filters.targetLanguage],
      direction,
      path,
    ),
};
