import { getDB } from './db';

export interface BackupData {
  version: number;
  exportedAt: string;
  rooms: any[];
  tasks: any[];
  completionLogs: any[];
  settings: any[];
}

export async function exportAllData(): Promise<BackupData> {
  const db = await getDB();
  const rooms = await db.getAll('rooms');
  const tasks = await db.getAll('tasks');
  const completionLogs = await db.getAll('completionLogs');
  const settings = await db.getAll('settings');
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    rooms,
    tasks,
    completionLogs,
    settings,
  };
}

export async function importAllData(data: BackupData): Promise<void> {
  // Validate
  if (!data || data.version !== 1 || !Array.isArray(data.rooms)) {
    throw new Error('Invalid backup format');
  }
  const db = await getDB();
  // Clear all stores
  const tx = db.transaction(['rooms', 'tasks', 'completionLogs', 'settings'], 'readwrite');
  await tx.objectStore('rooms').clear();
  await tx.objectStore('tasks').clear();
  await tx.objectStore('completionLogs').clear();
  await tx.objectStore('settings').clear();
  // Write imported data
  for (const room of data.rooms) await tx.objectStore('rooms').put(room);
  for (const task of data.tasks) await tx.objectStore('tasks').put(task);
  for (const log of data.completionLogs) await tx.objectStore('completionLogs').put(log);
  for (const setting of data.settings) await tx.objectStore('settings').put(setting);
  await tx.done;
}
