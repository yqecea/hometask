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

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/calendar', icon: Calendar, label: t('nav.schedule') },
    { path: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <nav
      aria-label={t('nav.home')}
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-slate-800/50 glass pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 w-16 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl py-1",
              isActive(path)
                ? "text-teal-400"
                : "text-slate-400 hover:text-slate-300"
            )}
            aria-current={isActive(path) ? 'page' : undefined}
          >
            <Icon className={cn("h-6 w-6 transition-transform duration-200", isActive(path) && "scale-110")} />
            <span className={cn("text-xs transition-all duration-200", isActive(path) ? "font-bold" : "font-medium")}>
              {label}
            </span>
            {isActive(path) && (
              <span className="absolute -bottom-0.5 w-6 h-0.5 bg-teal-400 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
