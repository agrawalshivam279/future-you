import { StateStorage } from 'zustand/middleware';

const DEFAULT_DB_NAME = 'future-you-db';
const DEFAULT_STORE_NAME = 'chat';
const DB_VERSION = 1;

// Track open database handles and reset callbacks so deleteDatabase never blocks on stale handles
const activeConnections = new Map<string, Set<{ db: IDBDatabase | null; reset: () => void }>>();

function registerConnection(
  dbName: string,
  entry: { db: IDBDatabase | null; reset: () => void }
): void {
  const set = activeConnections.get(dbName) || new Set();
  set.add(entry);
  activeConnections.set(dbName, set);
}

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
  const isIndexedDBAvailable =
    typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';

  const memoryFallback = new Map<string, string>();
  let dbPromise: Promise<IDBDatabase> | null = null;
  const connEntry: { db: IDBDatabase | null; reset: () => void } = {
    db: null,
    reset: () => {
      if (connEntry.db) {
        connEntry.db.close();
        connEntry.db = null;
      }
      dbPromise = null;
      memoryFallback.clear();
    },
  };
  registerConnection(dbName, connEntry);

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

      request.onsuccess = () => {
        const db = request.result;
        connEntry.db = db;
        db.onversionchange = () => {
          db.close();
          connEntry.db = null;
          dbPromise = null;
        };
        resolve(db);
      };

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
 * Permanently deletes the specified IndexedDB database after closing any active handles.
 *
 * @param dbName - Database name to delete
 */
export async function clearIndexedDBDatabase(
  dbName: string = DEFAULT_DB_NAME
): Promise<void> {
  const entries = activeConnections.get(dbName);
  if (entries) {
    entries.forEach((entry) => entry.reset());
  }

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
