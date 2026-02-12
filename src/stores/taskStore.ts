import { create } from 'zustand';
import type { Task } from '@/types';
import { getDB } from '@/lib/db';
import { presetTasks } from '@/data/presetTasks';

interface TaskStore {
  tasks: Task[];
  isLoaded: boolean;
  loadTasks: () => Promise<void>;
  getTasksByRoom: (roomId: string) => Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'isPreset' | 'order'>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoaded: false,

  loadTasks: async () => {
    const db = await getDB();
    let tasks = await db.getAll('tasks');
    if (tasks.length === 0) {
      const tx = db.transaction('tasks', 'readwrite');
      for (const task of presetTasks) {
        await tx.store.put(task);
      }
      await tx.done;
      tasks = presetTasks;
    }
    set({ tasks: tasks.sort((a, b) => a.order - b.order), isLoaded: true });
  },

  getTasksByRoom: (roomId) => {
    return get().tasks.filter((t) => t.roomId === roomId);
  },

  addTask: async (taskData) => {
    const { tasks } = get();
    const roomTasks = tasks.filter((t) => t.roomId === taskData.roomId);
    const maxOrder = roomTasks.reduce((max, t) => Math.max(max, t.order), -1);
    const task: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      order: maxOrder + 1,
      isPreset: false,
      createdAt: new Date().toISOString(),
    };
    const db = await getDB();
    await db.put('tasks', task);
    set({ tasks: [...tasks, task] });
  },

  deleteTask: async (id) => {
    const { tasks } = get();
    const task = tasks.find((t) => t.id === id);
    if (!task || task.isPreset) return;
    const db = await getDB();
    await db.delete('tasks', id);
    set({ tasks: tasks.filter((t) => t.id !== id) });
  },
}));
