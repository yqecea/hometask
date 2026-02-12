import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Room, Task, CompletionLog } from '@/types';

interface HomeTaskDB extends DBSchema {
  rooms: {
    key: string;
    value: Room;
  };
  tasks: {
    key: string;
    value: Task;
    indexes: { 'by-room': string };
  };
  completionLogs: {
    key: string;
    value: CompletionLog;
    indexes: { 'by-date': string; 'by-room': string; 'by-task': string };
  };
  settings: {
    key: string;
    value: { key: string; value: unknown };
  };
}

let dbPromise: Promise<IDBPDatabase<HomeTaskDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<HomeTaskDB>> {
  if (!dbPromise) {
    dbPromise = openDB<HomeTaskDB>('hometask-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('rooms')) {
          db.createObjectStore('rooms', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('tasks')) {
          const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
          taskStore.createIndex('by-room', 'roomId');
        }

        if (!db.objectStoreNames.contains('completionLogs')) {
          const completionStore = db.createObjectStore('completionLogs', { keyPath: 'id' });
          completionStore.createIndex('by-date', 'date');
          completionStore.createIndex('by-room', 'roomId');
          completionStore.createIndex('by-task', 'taskId');
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export type { HomeTaskDB };
