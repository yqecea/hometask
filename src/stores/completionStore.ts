import { create } from 'zustand';
import type { CompletionLog } from '@/types';
import { getDB } from '@/lib/db';

interface CompletionStore {
  completions: CompletionLog[];
  isLoaded: boolean;
  loadCompletions: () => Promise<void>;
  toggleCompletion: (taskId: string, roomId: string, date: string) => Promise<void>;
  getCompletionsForDate: (date: string) => CompletionLog[];
  getCompletionsForRoom: (roomId: string) => CompletionLog[];
  getCompletionsForDateRange: (start: string, end: string) => CompletionLog[];
}

export const useCompletionStore = create<CompletionStore>((set, get) => ({
  completions: [],
  isLoaded: false,

  loadCompletions: async () => {
    const db = await getDB();
    const completions = await db.getAll('completionLogs');
    set({ completions, isLoaded: true });
  },

  toggleCompletion: async (taskId, roomId, date) => {
    const { completions } = get();
    const existing = completions.find((c) => c.taskId === taskId && c.date === date);
    const db = await getDB();

    if (existing) {
      await db.delete('completionLogs', existing.id);
      set({ completions: completions.filter((c) => c.id !== existing.id) });
    } else {
      const completion: CompletionLog = {
        id: crypto.randomUUID(),
        taskId,
        roomId,
        date,
        completedAt: new Date().toISOString(),
      };
      await db.put('completionLogs', completion);
      set({ completions: [...completions, completion] });
    }
  },

  getCompletionsForDate: (date) => {
    return get().completions.filter((c) => c.date === date);
  },

  getCompletionsForRoom: (roomId) => {
    return get().completions.filter((c) => c.roomId === roomId);
  },

  getCompletionsForDateRange: (start, end) => {
    return get().completions.filter((c) => c.date >= start && c.date <= end);
  },
}));
