import { describe, it, expect } from 'vitest';
import { presetRooms } from '../data/presetRooms';
import { presetTasks } from '../data/presetTasks';

describe('presetRooms', () => {
  it('all rooms have unique IDs', () => {
    const ids = presetRooms.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all rooms have both ru and kz names', () => {
    for (const room of presetRooms) {
      expect(typeof room.name.ru).toBe('string');
      expect(room.name.ru.length).toBeGreaterThan(0);
      expect(typeof room.name.kz).toBe('string');
      expect(room.name.kz.length).toBeGreaterThan(0);
    }
  });

  it('all rooms have isPreset = true', () => {
    for (const room of presetRooms) {
      expect(room.isPreset).toBe(true);
    }
  });

  it('all rooms have valid icon and color strings', () => {
    for (const room of presetRooms) {
      expect(typeof room.icon).toBe('string');
      expect(room.icon.length).toBeGreaterThan(0);
      expect(typeof room.color).toBe('string');
      expect(room.color.length).toBeGreaterThan(0);
    }
  });

  it('rooms are in correct sequential order (0, 1, 2, ...)', () => {
    for (let i = 0; i < presetRooms.length; i++) {
      expect(presetRooms[i].order).toBe(i);
    }
  });
});

describe('presetTasks', () => {
  it('all tasks have unique IDs', () => {
    const ids = presetTasks.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all tasks have roomIds that match existing preset room IDs', () => {
    const roomIds = new Set(presetRooms.map((r) => r.id));
    for (const task of presetTasks) {
      expect(roomIds.has(task.roomId)).toBe(true);
    }
  });

  it('all tasks have both ru and kz names', () => {
    for (const task of presetTasks) {
      expect(typeof task.name.ru).toBe('string');
      expect(task.name.ru.length).toBeGreaterThan(0);
      expect(typeof task.name.kz).toBe('string');
      expect(task.name.kz.length).toBeGreaterThan(0);
    }
  });

  it('all tasks have isPreset = true', () => {
    for (const task of presetTasks) {
      expect(task.isPreset).toBe(true);
    }
  });
});
