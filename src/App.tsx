import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/components/AppLayout';
import HomePage from '@/pages/HomePage';
import RoomPage from '@/pages/RoomPage';
import CalendarPage from '@/pages/CalendarPage';
import SettingsPage from '@/pages/SettingsPage';
import { useRoomStore } from '@/stores/roomStore';
import { useTaskStore } from '@/stores/taskStore';
import { useCompletionStore } from '@/stores/completionStore';
import { useSettingsStore } from '@/stores/settingsStore';

function App() {
  const loadRooms = useRoomStore(s => s.loadRooms);
  const loadTasks = useTaskStore(s => s.loadTasks);
  const loadCompletions = useCompletionStore(s => s.loadCompletions);
  const { loadSettings, language } = useSettingsStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    loadRooms();
    loadTasks();
    loadCompletions();
    loadSettings();
  }, [loadRooms, loadTasks, loadCompletions, loadSettings]);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
      document.documentElement.lang = language === 'kz' ? 'kk' : language;
    }
  }, [language, i18n]);

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
