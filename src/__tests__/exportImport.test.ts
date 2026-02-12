import { describe, it, expect, beforeEach } from 'vitest';
import { exportAllData, importAllData, type BackupData } from '../lib/exportImport';
import { getDB } from '../lib/db';

beforeEach(async () => {
  await getDB();
});

describe('exportAllData', () => {
  it('returns a valid BackupData structure', async () => {
    const data = await exportAllData();
    expect(data).toHaveProperty('version', 1);
    expect(data).toHaveProperty('exportedAt');
    expect(typeof data.exportedAt).toBe('string');
    expect(Array.isArray(data.rooms)).toBe(true);
    expect(Array.isArray(data.tasks)).toBe(true);
    expect(Array.isArray(data.completionLogs)).toBe(true);
    expect(Array.isArray(data.settings)).toBe(true);
  });

  it('exportedAt is a valid ISO date string', async () => {
    const data = await exportAllData();
    const parsed = new Date(data.exportedAt);
    expect(parsed.getTime()).not.toBeNaN();
  });
});

describe('importAllData', () => {
  it('does not throw with valid data', async () => {
    const validData: BackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      rooms: [],
      tasks: [],
      completionLogs: [],
      settings: [],
    };
    await expect(importAllData(validData)).resolves.toBeUndefined();
  });

  it('imports rooms and tasks correctly', async () => {
    const room = { id: 'r1', name: { ru: 'Test', kz: 'Test' }, icon: 'home', color: 'blue', order: 0, isPreset: false, createdAt: new Date().toISOString() };
    const task = { id: 't1', roomId: 'r1', name: { ru: 'Task', kz: 'Task' }, order: 0, isPreset: false, createdAt: new Date().toISOString() };
    const backup: BackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      rooms: [room],
      tasks: [task],
      completionLogs: [],
      settings: [],
    };
    await importAllData(backup);
    const exported = await exportAllData();
    expect(exported.rooms).toHaveLength(1);
    expect(exported.rooms[0].id).toBe('r1');
    expect(exported.tasks).toHaveLength(1);
    expect(exported.tasks[0].id).toBe('t1');
  });

  it('throws on null input', async () => {
    await expect(importAllData(null as unknown as BackupData)).rejects.toThrow('Invalid backup format');
  });

  it('throws on undefined input', async () => {
    await expect(importAllData(undefined as unknown as BackupData)).rejects.toThrow('Invalid backup format');
  });

  it('throws on wrong version', async () => {
    const badVersion = {
      version: 99,
      exportedAt: new Date().toISOString(),
      rooms: [],
      tasks: [],
      completionLogs: [],
      settings: [],
    } as unknown as BackupData;
    await expect(importAllData(badVersion)).rejects.toThrow('Invalid backup format');
  });

  it('throws when rooms is not an array', async () => {
    const badRooms = {
      version: 1,
      exportedAt: new Date().toISOString(),
      rooms: 'not-an-array',
      tasks: [],
      completionLogs: [],
      settings: [],
    } as unknown as BackupData;
    await expect(importAllData(badRooms)).rejects.toThrow('Invalid backup format');
  });

  it('throws when version is missing', async () => {
    const noVersion = {
      exportedAt: new Date().toISOString(),
      rooms: [],
      tasks: [],
      completionLogs: [],
      settings: [],
    } as unknown as BackupData;
    await expect(importAllData(noVersion)).rejects.toThrow('Invalid backup format');
  });
});
