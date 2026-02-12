import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-slate-800 bg-slate-900 pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-16 items-center justify-around px-2">
        <button
          onClick={() => navigate('/')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 w-16 transition-colors focus:outline-none",
            isActive('/') ? "text-teal-500" : "text-slate-400 hover:text-slate-300"
          )}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs font-medium">{t('nav.home')}</span>
        </button>
        <button
          onClick={() => navigate('/calendar')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 w-16 transition-colors focus:outline-none",
            isActive('/calendar') ? "text-teal-500" : "text-slate-400 hover:text-slate-300"
          )}
        >
          <Calendar className="h-6 w-6" />
          <span className="text-xs font-medium">{t('nav.schedule')}</span>
        </button>
        <button
          onClick={() => navigate('/settings')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 w-16 transition-colors focus:outline-none",
            isActive('/settings') ? "text-teal-500" : "text-slate-400 hover:text-slate-300"
          )}
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs font-medium">{t('nav.settings')}</span>
        </button>
      </div>
    </div>
  );
}
