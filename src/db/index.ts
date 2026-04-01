export const DB_NAME = "llea";
export const DB_VERSION = 7;

let dbPromise: Promise<IDBDatabase> | null = null;

export const getDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`IndexedDB error: ${request.error?.message}`));
    };

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("essays")) {
        const store = db.createObjectStore("essays", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex(
          "languagePair",
          ["currentLanguage", "targetLanguage"],
          { unique: false },
        );
      }

      if (!db.objectStoreNames.contains("dictionary-entries")) {
        const store = db.createObjectStore("dictionary-entries", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex(
          "languagePair",
          ["currentLanguage", "targetLanguage"],
          { unique: false },
        );
      }

      if (!db.objectStoreNames.contains("progress-entries")) {
        const store = db.createObjectStore("progress-entries", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex(
          "languagePair",
          ["currentLanguage", "targetLanguage"],
          { unique: false },
        );
      }

      if (!db.objectStoreNames.contains("progress-history")) {
        const store = db.createObjectStore("progress-history", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex(
          "languagePair",
          ["currentLanguage", "targetLanguage"],
          { unique: false },
        );
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });

  return dbPromise;
};
