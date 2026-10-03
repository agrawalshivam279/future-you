import { StateStorage } from 'zustand/middleware';

const DEFAULT_DB_NAME = 'future-you-db';
const DEFAULT_STORE_NAME = 'chat';
const DB_VERSION = 1;

/**
 * Creates a Promise-based StateStorage adapter backed by browser IndexedDB.
 * Fallback to in-memory storage if IndexedDB is not available in the environment.
 *
 * @param dbName - Name of the IndexedDB database
 * @param storeName - Name of the object store
 * @returns StateStorage interface for Zustand persist middleware
 */
export function createIndexedDBStorage(
  dbName: string = DEFAULT_DB_NAME,
  storeName: string = DEFAULT_STORE_NAME
): StateStorage {
  // Check if indexedDB is supported
  const isIndexedDBAvailable =
    typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';

  // Fallback memory map for restricted or non-browser environments
  const memoryFallback = new Map<string, string>();

  let dbPromise: Promise<IDBDatabase> | null = null;

  function getDB(): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      if (!isIndexedDBAvailable) {
        reject(new Error('IndexedDB is unavailable in current runtime.'));
        return;
      }

      const request = window.indexedDB.open(dbName, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };

      request.onsuccess = () => resolve(request.result);

      request.onerror = () => {
        dbPromise = null;
        reject(request.error);
      };
    });

    return dbPromise;
  }

  return {
    async getItem(key: string): Promise<string | null> {
      if (!isIndexedDBAvailable) {
        return memoryFallback.get(key) ?? null;
      }

      try {
        const db = await getDB();
        return new Promise<string | null>((resolve, reject) => {
          const transaction = db.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.get(key);

          request.onsuccess = () => {
            resolve(request.result !== undefined ? (request.result as string) : null);
          };

          request.onerror = () => reject(request.error);
        });
      } catch {
        return memoryFallback.get(key) ?? null;
      }
    },

    async setItem(key: string, value: string): Promise<void> {
      if (!isIndexedDBAvailable) {
        memoryFallback.set(key, value);
        return;
      }

      try {
        const db = await getDB();
        return new Promise<void>((resolve, reject) => {
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.put(value, key);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch {
        memoryFallback.set(key, value);
      }
    },

    async removeItem(key: string): Promise<void> {
      if (!isIndexedDBAvailable) {
        memoryFallback.delete(key);
        return;
      }

      try {
        const db = await getDB();
        return new Promise<void>((resolve, reject) => {
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.delete(key);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch {
        memoryFallback.delete(key);
      }
    },
  };
}

/**
 * Permanently deletes the specified IndexedDB database.
 *
 * @param dbName - Database name to delete
 */
export async function clearIndexedDBDatabase(
  dbName: string = DEFAULT_DB_NAME
): Promise<void> {
  if (typeof window === 'undefined' || typeof window.indexedDB === 'undefined') {
    return;
  }

  return new Promise<void>((resolve, reject) => {
    const request = window.indexedDB.deleteDatabase(dbName);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}
