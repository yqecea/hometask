import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Home, Pencil } from 'lucide-react';
import { iconMap } from '@/lib/iconMap';
import { colorMap } from '@/lib/colorMap';
import type { Room } from '@/types';
import { useTaskStore } from '@/stores/taskStore';
import { useCompletionStore } from '@/stores/completionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { cn } from '@/lib/utils';

interface RoomCardProps {
  room: Room;
  onEdit?: (room: Room) => void;
}

export const RoomCard = ({ room, onEdit }: RoomCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);

  const allTasks = useTaskStore((state) => state.tasks);
  const allCompletions = useCompletionStore((state) => state.completions);
  const todayStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

  const tasks = useMemo(
    () => allTasks.filter((t) => t.roomId === room.id),
    [allTasks, room.id]
  );
  const completions = useMemo(
    () => allCompletions.filter((c) => c.roomId === room.id && c.date === todayStr),
    [allCompletions, room.id, todayStr]
  );

  const totalTasks = tasks.length;
  const completedToday = completions.length;

  const IconComponent = iconMap[room.icon] || Home;
  const bgColorClass = colorMap[room.color] || 'bg-slate-700';

  return (
    <button
      onClick={() => navigate(`/room/${room.id}`)}
      className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 cursor-pointer group w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      aria-label={`${room.name[language]} — ${totalTasks === 0 ? t('home.noTasks') : t('home.tasksProgress', { completed: completedToday, total: totalTasks })}`}
    >
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105", bgColorClass)}>
        <IconComponent className="text-white w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-slate-100 truncate">
          {room.name[language]}
        </h3>
      </div>

      <div className={cn("text-xs font-medium", completedToday > 0 ? 'text-teal-400' : 'text-slate-500')}>
        {totalTasks === 0 ? (
          t('home.noTasks')
        ) : completedToday > 0 ? (
          t('home.tasksProgress', { completed: completedToday, total: totalTasks })
        ) : (
          t('home.noTasks')
        )}
      </div>

      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(room);
          }}
          className="p-2 -mr-2 text-slate-500 hover:text-teal-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg"
          aria-label={`${t('common.edit')} ${room.name[language]}`}
        >
          <Pencil size={16} />
        </button>
      )}
    </button>
  );
};
