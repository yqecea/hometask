import { create } from 'zustand';
import { getDB } from '@/lib/db';

interface SettingsStore {
  language: 'ru' | 'kz';
  isLoaded: boolean;
  loadSettings: () => Promise<void>;
  setLanguage: (lang: 'ru' | 'kz') => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  language: 'ru',
  isLoaded: false,

  loadSettings: async () => {
    const db = await getDB();
    const entry = await db.get('settings', 'language');
    const language = (entry?.value as 'ru' | 'kz') ?? 'ru';
    set({ language, isLoaded: true });
  },

  setLanguage: async (lang) => {
    const db = await getDB();
    await db.put('settings', { key: 'language', value: lang });
    set({ language: lang });
  },
}));
