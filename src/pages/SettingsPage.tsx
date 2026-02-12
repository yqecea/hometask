
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';
import { useRoomStore } from '@/stores/roomStore';
import { useTaskStore } from '@/stores/taskStore';
import { useCompletionStore } from '@/stores/completionStore';
import { exportAllData, importAllData, type BackupData } from '@/lib/exportImport';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { Download, Upload, Check, PlusCircle } from 'lucide-react';

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
    } catch {
      alert(t('settings.exportError'));
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
      } catch {
        alert(t('settings.importError'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-extrabold mb-8 text-white">{t('settings.title')}</h1>

      <div className="space-y-8">
        <section className="space-y-3 animate-fade-in-up">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            {t('settings.language')}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => handleLanguageChange('ru')}
              className={`flex-1 p-3 rounded-xl font-semibold transition-all duration-200 ${language === 'ru'
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20 scale-[1.02]'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 active:scale-95'
                }`}
            >
              {t('settings.languageRu')}
            </button>
            <button
              onClick={() => handleLanguageChange('kz')}
              className={`flex-1 p-3 rounded-xl font-semibold transition-all duration-200 ${language === 'kz'
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20 scale-[1.02]'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 active:scale-95'
                }`}
            >
              {t('settings.languageKz')}
            </button>
          </div>
        </section>

        <section className="space-y-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            {t('settings.data')}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleExport}
              className="w-full p-3 rounded-xl bg-slate-900 text-slate-200 font-medium hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              {t('settings.export')}
            </button>

            <button
              onClick={handleImportClick}
              className="w-full p-3 rounded-xl bg-slate-900 text-slate-200 font-medium hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Upload className="h-5 w-5" />
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

        <section className="space-y-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            {t('settings.app')}
          </h2>

          {(canInstall || isInstalled) ? (
            <button
              onClick={isInstalled ? undefined : install}
              disabled={isInstalled}
              className={`w-full p-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${isInstalled
                  ? 'bg-green-900/30 text-green-400 cursor-default'
                  : 'bg-slate-900 text-slate-200 hover:bg-slate-800 active:scale-[0.98]'
                }`}
            >
              {isInstalled ? (
                <>
                  <Check className="h-5 w-5" />
                  {t('settings.installed')}
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5" />
                  {t('settings.install')}
                </>
              )}
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900/50 text-slate-500 text-center text-sm">
              {t('settings.openInBrowser')}
            </div>
          )}
        </section>

        <footer className="pt-8 text-center animate-fade-in">
          <p className="text-slate-500 font-semibold">HomeTask</p>
          <p className="text-xs text-slate-600 mt-1">v1.0.0</p>
        </footer>
      </div>
    </div>
  );
}
