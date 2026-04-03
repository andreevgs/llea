import { getDB } from "@/db";
import {
  idbDelete,
  idbGet,
  idbGetAll,
  idbGetAllByIndex,
  idbGetAllByIndexAndCount,
  idbGetAllByIndexAVG,
  idbPut,
} from "@/utils/db";

export interface ProgressHistoryDto {
  previousPointsValue: number;
  newPointsValue: number;
  date: Date;
  currentLanguage: string;
  targetLanguage: string;
}

export interface ProgressHistory extends ProgressHistoryDto {
  id?: number;
}

const STORE_NAME = "progress-history";

export const progressHistoryService = {
  get: (id: number) => idbGet<ProgressHistory>(getDB(), STORE_NAME, id),
  getAll: () => idbGetAll<ProgressHistory>(getDB(), STORE_NAME),
  put: (entry: ProgressHistory) =>
    idbPut<ProgressHistory>(getDB(), STORE_NAME, entry),
  delete: (id: number) => idbDelete(getDB(), STORE_NAME, id),

  getAllByIndex: (
    indexName: string,
    filters: { currentLanguage: string; targetLanguage: string },
    direction: IDBCursorDirection,
    where?: Partial<ProgressHistory>,
  ) =>
    idbGetAllByIndex<ProgressHistory>(
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
    where?: Partial<ProgressHistory>,
  ) =>
    idbGetAllByIndexAndCount<ProgressHistory>(
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
    idbGetAllByIndexAVG<ProgressHistory>(
      getDB(),
      STORE_NAME,
      indexName,
      [filters.currentLanguage, filters.targetLanguage],
      direction,
      path,
    ),
};
