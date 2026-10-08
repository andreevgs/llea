import type {
  AnalyzedEssay,
  DictionaryEntry,
  LanguagePair,
  ProgressEntry,
  ProgressHistory,
  QueryOptions,
} from "./types";

export * from "./types";

export const DB_NAME = "llea";
export const DB_VERSION = 7;

const STORES = [
  "essays",
  "dictionary-entries",
  "progress-entries",
  "progress-history",
] as const;

let dbPromise: Promise<IDBDatabase> | null = null;

export const getDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      dbPromise = null;
      reject(new Error(`IndexedDB error: ${request.error?.message}`));
    };

    request.onupgradeneeded = () => {
      const db = request.result;

      for (const storeName of STORES) {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex(
            "languagePair",
            ["currentLanguage", "targetLanguage"],
            { unique: false },
          );
        }
      }
    };

    request.onsuccess = () => resolve(request.result);
  });

  return dbPromise;
};

const promisify = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const createStore = <T>(storeName: string) => ({
  get: async (id: number): Promise<T | undefined> => {
    const db = await getDB();
    return promisify(
      db.transaction(storeName, "readonly").objectStore(storeName).get(id),
    );
  },

  getAll: async (): Promise<T[]> => {
    const db = await getDB();
    return promisify(
      db.transaction(storeName, "readonly").objectStore(storeName).getAll(),
    );
  },

  getByLanguagePair: async (
    filter: LanguagePair,
    options: QueryOptions = {},
  ): Promise<T[]> => {
    const { limit, direction = "prev" } = options;
    const db = await getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const index = store.index("languagePair");
      const keyRange = IDBKeyRange.only([filter.currentLanguage, filter.targetLanguage]);
      const request = index.openCursor(keyRange, direction);
      const results: T[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          results.push(cursor.value as T);
          if (limit && results.length >= limit) {
            resolve(results);
            return;
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  },

  put: async (item: T): Promise<void> => {
    const db = await getDB();
    await promisify(
      db.transaction(storeName, "readwrite").objectStore(storeName).put(item),
    );
  },

  putMany: async (items: T[]): Promise<void> => {
    if (items.length === 0) return;
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);

      for (const item of items) {
        store.put(item);
      }
    });
  },

  delete: async (id: number): Promise<void> => {
    const db = await getDB();
    await promisify(
      db.transaction(storeName, "readwrite").objectStore(storeName).delete(id),
    );
  },

  clear: async (): Promise<void> => {
    const db = await getDB();
    await promisify(
      db.transaction(storeName, "readwrite").objectStore(storeName).clear(),
    );
  },
});

export const essaysRepository = createStore<AnalyzedEssay>("essays");
export const dictionaryRepository = createStore<DictionaryEntry>("dictionary-entries");
export const progressEntriesRepository = createStore<ProgressEntry>("progress-entries");
export const progressHistoryRepository = createStore<ProgressHistory>("progress-history");
