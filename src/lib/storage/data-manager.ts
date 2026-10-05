import { STORAGE_PREFIX } from '@/lib/constants';
import { clearIndexedDBDatabase } from '@/lib/storage/indexed-db';
import {
  useSettingsStore,
  useUIStore,
  useOnboardingStore,
  useLifeModelStore,
  useChatStore,
  useDecisionStore,
} from '@/stores';

export interface BackupPayload {
  version: number;
  exportedAt: string;
  localStorage: Record<string, unknown>;
  chatConversations?: unknown;
}

/**
 * Collects all project data stored in browser localStorage and chat stores.
 *
 * @returns Serialized backup payload object
 */
export function exportLocalData(): BackupPayload {
  const localData: Record<string, unknown> = {};

  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const rawValue = window.localStorage.getItem(key);
        if (rawValue !== null) {
          try {
            localData[key] = JSON.parse(rawValue);
          } catch {
            localData[key] = rawValue;
          }
        }
      }
    }
  }

  // Include current in-memory chat state as well
  let chatConversations: unknown = undefined;
  try {
    chatConversations = useChatStore.getState().conversations;
  } catch {
    // Chat store unavailable in non-browser or detached context
  }

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    localStorage: localData,
    chatConversations,
  };
}

/**
 * Generates and triggers a browser file download of the user's exported data in JSON format.
 *
 * @param payload - Optional backup payload; if omitted, current storage will be exported.
 */
export function downloadDataAsJSON(payload?: BackupPayload): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const data = payload || exportLocalData();
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const formattedDate = new Date().toISOString().split('T')[0];
  const link = document.createElement('a');
  link.href = url;
  link.download = `future-you-backup-${formattedDate}.json`;
  link.setAttribute('aria-hidden', 'true');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Permanently deletes all Future You data stored locally.
 * Clears all prefixed localStorage entries, wipes IndexedDB, and resets in-memory Zustand stores.
 */
export async function deleteAllLocalData(): Promise<void> {
  // 1. Reset in-memory Zustand store states first
  try {
    useSettingsStore.getState().resetSettings();
    useUIStore.getState().resetUI();
    useOnboardingStore.getState().resetOnboarding();
    useLifeModelStore.getState().resetLifeModel();
    useChatStore.getState().resetChat();
    useDecisionStore.getState().resetDecisionStore();
  } catch {
    // Gracefully handle uninitialized store references in test runners
  }

  // 2. Wipe IndexedDB database
  await clearIndexedDBDatabase('future-you-db');

  // 3. Purge all future-you:* localStorage keys (including any written during store resets)
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      window.localStorage.removeItem(key);
    });
  }
}
