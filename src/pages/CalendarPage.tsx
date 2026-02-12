import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useCompletionStore } from '@/stores/completionStore';
import { useRoomStore } from '@/stores/roomStore';
import { useTaskStore } from '@/stores/taskStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { iconMap } from '@/lib/iconMap';
import { colorMap } from '@/lib/colorMap';

const dotColorMap: Record<string, string> = {
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

export default function CalendarPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const language = useSettingsStore((state) => state.language);
  const rooms = useRoomStore((state) => state.rooms);
  const allTasks = useTaskStore((state) => state.tasks);
  const completions = useCompletionStore((state) => state.completions);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

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

  const completionsByDate = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const c of completions) {
      if (!map.has(c.date)) {
        map.set(c.date, new Set());
      }
      map.get(c.date)!.add(c.roomId);
    }
    return map;
  }, [completions]);

  const selectedDayDetail = useMemo(() => {
    const dayCompletions = completions.filter((c) => c.date === selectedDate);
    const roomIds = [...new Set(dayCompletions.map((c) => c.roomId))];

    return roomIds
      .map((roomId) => {
        const room = rooms.find((r) => r.id === roomId);
        if (!room) return null;
        const roomTasks = allTasks.filter((t) => t.roomId === roomId);
        const completedTaskIds = new Set(
          dayCompletions
            .filter((c) => c.roomId === roomId)
            .map((c) => c.taskId)
        );
        const completedCount = roomTasks.filter((t) =>
          completedTaskIds.has(t.id)
        ).length;
        return {
          room,
          completedCount,
          totalTasks: roomTasks.length,
        };
      })
      .filter(Boolean) as Array<{
      room: (typeof rooms)[0];
      completedCount: number;
      totalTasks: number;
    }>;
  }, [selectedDate, completions, rooms, allTasks]);

  const getDayDots = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const roomIds = completionsByDate.get(dayStr);
    if (!roomIds || roomIds.size === 0) return [];

    return [...roomIds]
      .slice(0, 4)
      .map((roomId) => {
        const room = rooms.find((r) => r.id === roomId);
        return room ? room.color : null;
      })
      .filter(Boolean) as string[];
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="pb-20">
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold text-slate-100">
          {t('calendar.title')}
        </h1>
      </div>

      <div className="px-4 pt-4">
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-semibold text-slate-200 capitalize">
              {format(currentMonth, 'LLLL yyyy', { locale: ru })}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-slate-500 font-medium py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const isSelected = isSameDay(day, new Date(selectedDate));
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const dots = getDayDots(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(dayStr)}
                  className={`
                    h-11 w-full rounded-lg flex flex-col items-center justify-center text-xs transition-all relative
                    ${isSelected ? 'bg-teal-500/20 ring-2 ring-teal-500' : 'hover:bg-slate-800'}
                    ${!isCurrentMonth ? 'opacity-30' : 'opacity-100'}
                  `}
                >
                  <span
                    className={`
                    ${isSelected ? 'text-teal-400 font-bold' : isToday(day) ? 'text-white font-bold' : 'text-slate-400'}
                  `}
                  >
                    {format(day, 'd')}
                  </span>

                  {dots.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dots.map((color, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full ${dotColorMap[color] || 'bg-slate-500'}`}
                        />
                      ))}
                    </div>
                  )}

                  {isToday(day) && !isSelected && (
                    <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
          {format(new Date(selectedDate), 'd MMMM', { locale: ru })}
        </h2>

        {selectedDayDetail.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {t('calendar.noActivity')}
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDayDetail.map(({ room, completedCount, totalTasks }) => {
              const IconComponent = iconMap[room.icon] || Home;
              const bgColor = colorMap[room.color] || 'bg-slate-700';
              const roomName = room.name[language] || room.name.ru;
              const isComplete =
                totalTasks > 0 && completedCount === totalTasks;

              return (
                <button
                  key={room.id}
                  onClick={() => navigate(`/room/${room.id}`)}
                  className="flex items-center gap-3 p-3 w-full rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor}`}
                  >
                    <IconComponent className="text-white w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-100 truncate">
                      {roomName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {completedCount} / {totalTasks}
                    </p>
                  </div>

                  <div
                    className={`text-xs font-medium ${isComplete ? 'text-teal-400' : 'text-slate-500'}`}
                  >
                    {isComplete ? '✓' : `${Math.round((completedCount / Math.max(totalTasks, 1)) * 100)}%`}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
