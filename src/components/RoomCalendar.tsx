import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  isSameDay
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { kk } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCompletionStore } from '@/stores/completionStore';
import { useTaskStore } from '@/stores/taskStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTranslation } from 'react-i18next';

interface RoomCalendarProps {
  roomId: string;
  roomColor: string;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const partialColorMap: Record<string, string> = {
  green: 'bg-green-500/30',
  yellow: 'bg-yellow-500/30',
  orange: 'bg-orange-500/30',
  blue: 'bg-blue-500/30',
  purple: 'bg-purple-500/30',
  teal: 'bg-teal-500/30',
  cyan: 'bg-cyan-500/30',
  pink: 'bg-pink-500/30',
  indigo: 'bg-indigo-500/30',
  violet: 'bg-violet-500/30',
  rose: 'bg-rose-500/30',
  amber: 'bg-amber-500/30',
  lime: 'bg-lime-500/30',
  emerald: 'bg-emerald-500/30',
};

const fullColorMap: Record<string, string> = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  teal: 'bg-teal-500',
  cyan: 'bg-cyan-500',
  pink: 'bg-pink-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
  lime: 'bg-lime-500',
  emerald: 'bg-emerald-500',
};

const textColorMap: Record<string, string> = {
  green: 'text-green-200',
  yellow: 'text-yellow-200',
  orange: 'text-orange-200',
  blue: 'text-blue-200',
  purple: 'text-purple-200',
  teal: 'text-teal-200',
  cyan: 'text-cyan-200',
  pink: 'text-pink-200',
  indigo: 'text-indigo-200',
  violet: 'text-violet-200',
  rose: 'text-rose-200',
  amber: 'text-amber-200',
  lime: 'text-lime-200',
  emerald: 'text-emerald-200',
};

const localeMap = { ru, kz: kk } as const;

export function RoomCalendar({ roomId, roomColor, selectedDate, onDateSelect }: RoomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const locale = localeMap[language] || ru;

  const { getTasksByRoom } = useTaskStore();
  const { getCompletionsForRoom } = useCompletionStore();

  const tasks = getTasksByRoom(roomId);
  const completions = getCompletionsForRoom(roomId);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const weekDays = [
    t('dates.monday'),
    t('dates.tuesday'),
    t('dates.wednesday'),
    t('dates.thursday'),
    t('dates.friday'),
    t('dates.saturday'),
    t('dates.sunday'),
  ];

  const getDayStatus = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayCompletions = completions.filter(c => c.date === dayStr);

    if (tasks.length === 0) return 'empty';

    const completedCount = tasks.filter(task =>
      dayCompletions.some(c => c.taskId === task.id)
    ).length;

    if (completedCount === 0) return 'empty';
    if (completedCount === tasks.length) return 'complete';
    return 'partial';
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium text-slate-200 capitalize">
          {format(currentMonth, 'LLLL yyyy', { locale })}
        </span>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs text-slate-500 font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const status = getDayStatus(day);
          const isSelected = isSameDay(day, new Date(selectedDate));
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const dayStr = format(day, 'yyyy-MM-dd');

          let bgClass = 'bg-slate-800/50';
          let textClass = 'text-slate-400';

          if (status === 'complete') {
            bgClass = fullColorMap[roomColor] || 'bg-slate-700';
            textClass = 'text-white font-bold';
          } else if (status === 'partial') {
            bgClass = partialColorMap[roomColor] || 'bg-slate-700/50';
            textClass = textColorMap[roomColor] || 'text-slate-200';
          }

          if (!isCurrentMonth) {
            textClass = 'text-slate-600';
            if (status !== 'empty') {
              bgClass = 'bg-slate-900';
            }
          }

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(dayStr)}
              className={`
                h-8 w-full rounded-md flex items-center justify-center text-xs transition-all relative
                ${bgClass}
                ${textClass}
                ${isSelected ? 'ring-2 ring-white z-10' : ''}
                ${!isCurrentMonth ? 'opacity-40' : 'opacity-100'}
                hover:opacity-100
              `}
            >
              {format(day, 'd')}
              {isToday(day) && !isSelected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
