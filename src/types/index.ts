export interface Room {
  id: string;
  name: { ru: string; kz: string };
  icon: string;
  color: string;
  order: number;
  isPreset: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  roomId: string;
  name: { ru: string; kz: string };
  order: number;
  isPreset: boolean;
  createdAt: string;
}

export interface CompletionLog {
  id: string;
  taskId: string;
  roomId: string;
  date: string;
  completedAt: string;
}

export interface AppSettings {
  language: 'ru' | 'kz';
  installedAt: string;
}
