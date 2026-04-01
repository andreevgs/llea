import {
  areObjectsValuesEqual,
  getValueByDotNotationPath,
} from "@/utils/objects";
import { calculateAverage } from "@/utils/arrays";

export type CountResult = {
  count: number;
  totalCount: number;
};

export const getDefaultCountResult = (): CountResult => ({
  count: 0,
  totalCount: 0,
});

export const getDBTransaction = async (
  dbPromise: Promise<IDBDatabase>,
  storeName: string,
  mode: IDBTransactionMode,
) => {
  const db = await dbPromise;
  const transaction = db.transaction([storeName], mode);
  return transaction.objectStore(storeName);
};

export const idbGetAll = async <T>(
  dbPromise: Promise<IDBDatabase>,
  storeName: string,
): Promise<T[]> => {
  const store = await getDBTransaction(dbPromise, storeName, "readonly");
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve((request.result as T[]).reverse());
    request.onerror = () => reject(request.error);
  });
};

export const idbGet = async <T>(
  dbPromise: Promise<IDBDatabase>,
  storeName: string,
  id: number,
): Promise<T> => {
  const store = await getDBTransaction(dbPromise, storeName, "readonly");
  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error);
  });
};

export const idbPut = async <T>(
  dbPromise: Promise<IDBDatabase>,
  storeName: string,
  object: T,
): Promise<void> => {
  const store = await getDBTransaction(dbPromise, storeName, "readwrite");
  return new Promise((resolve, reject) => {
    const request = store.put(object);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const idbDelete = async (
  dbPromise: Promise<IDBDatabase>,
  storeName: string,
  id: number,
): Promise<void> => {
  const store = await getDBTransaction(dbPromise, storeName, "readwrite");
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const idbGetAllByIndex = async <T>(
  dbPromise: Promise<IDBDatabase>,
  storeName: string,
  indexName: string,
  indexValues: any[],
  direction: IDBCursorDirection,
  where?: Partial<T>,
): Promise<T[]> => {
  const store = await getDBTransaction(dbPromise, storeName, "readonly");
  return new Promise((resolve, reject) => {
    const index = store.index(indexName);
    const keyRange = IDBKeyRange.bound(indexValues, indexValues);
    const request = index.openCursor(keyRange, direction);
    const results: T[] = [];

    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        const item = cursor.value as T;
        if (!where || areObjectsValuesEqual(item, where)) {
          results.push(item);
        }
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

export const idbGetAllByIndexAndCount = async <T>(
  dbPromise: Promise<IDBDatabase>,
  storeName: string,
  indexName: string,
  indexValues: any[],
  direction: IDBCursorDirection,
  where?: Partial<T>,
): Promise<CountResult> => {
  const store = await getDBTransaction(dbPromise, storeName, "readonly");
  return new Promise((resolve, reject) => {
    const index = store.index(indexName);
    const keyRange = IDBKeyRange.bound(indexValues, indexValues);
    const request = index.openCursor(keyRange, direction);
    const result: CountResult = { count: 0, totalCount: 0 };

    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        const item = cursor.value as T;
        if (!where || areObjectsValuesEqual(item, where)) {
          result.count++;
        }
        result.totalCount++;
        cursor.continue();
      } else {
        resolve(result);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

export const idbGetAllByIndexAVG = async <T>(
  dbPromise: Promise<IDBDatabase>,
  storeName: string,
  indexName: string,
  indexValues: any[],
  direction: IDBCursorDirection,
  path: string,
): Promise<number> => {
  const store = await getDBTransaction(dbPromise, storeName, "readonly");
  return new Promise((resolve, reject) => {
    const index = store.index(indexName);
    const keyRange = IDBKeyRange.bound(indexValues, indexValues);
    const request = index.openCursor(keyRange, direction);
    const result: number[] = [];

    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        const item = cursor.value as T;
        const value = getValueByDotNotationPath(item, path);
        if (typeof value === "number") {
          result.push(value);
        }
        cursor.continue();
      } else {
        resolve(calculateAverage(result));
      }
    };
    request.onerror = () => reject(request.error);
  });
};

export const idbReduceByIndex = async <T, R>(
  dbPromise: Promise<IDBDatabase>,
  storeName: string,
  indexName: string,
  indexValues: any[],
  direction: IDBCursorDirection,
  reducer: (acc: R, item: T) => R,
  initialValue: R,
): Promise<R> => {
  const store = await getDBTransaction(dbPromise, storeName, "readonly");
  return new Promise((resolve, reject) => {
    const index = store.index(indexName);
    const keyRange = IDBKeyRange.bound(indexValues, indexValues);
    const request = index.openCursor(keyRange, direction);
    let accumulator = initialValue;

    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        accumulator = reducer(accumulator, cursor.value as T);
        cursor.continue();
      } else {
        resolve(accumulator);
      }
    };
    request.onerror = () => reject(request.error);
  });
};
