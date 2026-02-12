import { create } from 'zustand';
import type { Room } from '@/types';
import { getDB } from '@/lib/db';
import { presetRooms } from '@/data/presetRooms';

interface RoomStore {
  rooms: Room[];
  isLoaded: boolean;
  loadRooms: () => Promise<void>;
  addRoom: (room: Omit<Room, 'id' | 'createdAt' | 'isPreset' | 'order'>) => Promise<void>;
  updateRoom: (id: string, data: Partial<Room>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
  getRoomById: (id: string) => Room | undefined;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],
  isLoaded: false,

  loadRooms: async () => {
    const db = await getDB();
    let rooms = await db.getAll('rooms');
    if (rooms.length === 0) {
      const tx = db.transaction('rooms', 'readwrite');
      for (const room of presetRooms) {
        await tx.store.put(room);
      }
      await tx.done;
      rooms = presetRooms;
    }
    set({ rooms: rooms.sort((a, b) => a.order - b.order), isLoaded: true });
  },

  addRoom: async (roomData) => {
    const { rooms } = get();
    const maxOrder = rooms.reduce((max, r) => Math.max(max, r.order), -1);
    const room: Room = {
      ...roomData,
      id: crypto.randomUUID(),
      order: maxOrder + 1,
      isPreset: false,
      createdAt: new Date().toISOString(),
    };
    const db = await getDB();
    await db.put('rooms', room);
    set({ rooms: [...rooms, room] });
  },

  updateRoom: async (id, data) => {
    const { rooms } = get();
    const updated = rooms.map((r) => (r.id === id ? { ...r, ...data } : r));
    const room = updated.find((r) => r.id === id);
    if (room) {
      const db = await getDB();
      await db.put('rooms', room);
    }
    set({ rooms: updated });
  },

  deleteRoom: async (id) => {
    const { rooms } = get();
    const room = rooms.find((r) => r.id === id);
    if (!room || room.isPreset) return;
    const db = await getDB();
    await db.delete('rooms', id);
    set({ rooms: rooms.filter((r) => r.id !== id) });
  },

  getRoomById: (id) => {
    return get().rooms.find((r) => r.id === id);
  },
}));
