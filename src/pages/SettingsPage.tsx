
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';
import { useRoomStore } from '@/stores/roomStore';
import { useTaskStore } from '@/stores/taskStore';
import { useCompletionStore } from '@/stores/completionStore';
import { exportAllData, importAllData, type BackupData } from '@/lib/exportImport';
import { usePwaInstall } from '@/hooks/usePwaInstall';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { language, setLanguage, loadSettings } = useSettingsStore();
  const roomStore = useRoomStore();
  const taskStore = useTaskStore();
  const completionStore = useCompletionStore();
  const { canInstall, isInstalled, install } = usePwaInstall();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLanguageChange = async (lang: 'ru' | 'kz') => {
    await setLanguage(lang);
    await i18n.changeLanguage(lang);
  };

  const handleExport = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hometask-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert(t('settings.importError'));
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content) as BackupData;

        if (confirm(t('settings.importConfirm'))) {
          await importAllData(data);
          
          await Promise.all([
            roomStore.loadRooms(),
            taskStore.loadTasks(),
            completionStore.loadCompletions(),
            loadSettings()
          ]);
          
          const currentLang = useSettingsStore.getState().language;
          if (currentLang !== i18n.language) {
             await i18n.changeLanguage(currentLang);
          }

          alert(t('settings.importSuccess'));
        }
      } catch (error) {
        console.error('Import failed:', error);
        alert(t('settings.importError'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-8 text-white">{t('settings.title')}</h1>

      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            {t('settings.language')}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => handleLanguageChange('ru')}
              className={`flex-1 p-3 rounded-xl font-medium transition-all duration-200 ${
                language === 'ru'
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {t('settings.languageRu')}
            </button>
            <button
              onClick={() => handleLanguageChange('kz')}
              className={`flex-1 p-3 rounded-xl font-medium transition-all duration-200 ${
                language === 'kz'
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {t('settings.languageKz')}
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            {t('settings.data')}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleExport}
              className="w-full p-3 rounded-xl bg-slate-900 text-slate-200 font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              {t('settings.export')}
            </button>
            
            <button
              onClick={handleImportClick}
              className="w-full p-3 rounded-xl bg-slate-900 text-slate-200 font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" transform="rotate(180 10 10)" />
              </svg>
              {t('settings.import')}
            </button>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            {t('settings.app')}
          </h2>
          
          {(canInstall || isInstalled) ? (
            <button
              onClick={isInstalled ? undefined : install}
              disabled={isInstalled}
              className={`w-full p-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                isInstalled 
                  ? 'bg-green-900/30 text-green-400 cursor-default' 
                  : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              {isInstalled ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('settings.installed')}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  {t('settings.install')}
                </>
              )}
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900/50 text-slate-500 text-center text-sm">
              Откройте в браузере для установки
            </div>
          )}
        </section>

        <footer className="pt-8 text-center">
          <p className="text-slate-500 font-medium">HomeTask</p>
          <p className="text-xs text-slate-600 mt-1">v1.0.0</p>
        </footer>
      </div>
    </div>
  );
}
