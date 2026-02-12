import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRoomStore } from '@/stores/roomStore';
import { useTaskStore } from '@/stores/taskStore';
import { useCompletionStore } from '@/stores/completionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { DateNavigator } from '@/components/DateNavigator';
import { TaskCheckbox } from '@/components/TaskCheckbox';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { iconMap } from '@/lib/iconMap';
import { colorMap } from '@/lib/colorMap';
import { RoomCalendar } from '@/components/RoomCalendar';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { getRoomById } = useRoomStore();
  const { getTasksByRoom, deleteTask } = useTaskStore();
  const { getCompletionsForDate, toggleCompletion } = useCompletionStore();
  const { language } = useSettingsStore();

  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const room = getRoomById(roomId || '');
  const tasks = getTasksByRoom(roomId || '');
  const completions = getCompletionsForDate(selectedDate);

  useEffect(() => {
    if (!room && roomId) {
      navigate('/');
    }
  }, [room, roomId, navigate]);

  if (!room) return null;

  const Icon = iconMap[room.icon] || iconMap.home;
  const roomName = room.name[language] || room.name.ru;

  const handleToggleTask = (taskId: string) => {
    if (roomId) {
      toggleCompletion(taskId, roomId, selectedDate);
    }
  };

  const completedCount = tasks.filter(task => 
    completions.some(c => c.taskId === task.id)
  ).length;

  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="px-4 h-16 flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className={`p-2 rounded-lg ${colorMap[room.color]} bg-opacity-20`}>
            <Icon size={20} className="text-white" />
          </div>
          
          <h1 className="text-lg font-bold text-white truncate">
            {roomName}
          </h1>
        </div>

        <div className="px-4 pb-2">
          <DateNavigator date={selectedDate} onDateChange={setSelectedDate} />
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex justify-between items-end mb-2">
            <span className="text-slate-400 text-sm">
              {t('room.progress', { completed: completedCount, total: totalTasks })}
            </span>
            <span className="text-teal-400 font-bold text-lg">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-slate-400 text-sm font-medium mb-3 uppercase tracking-wider">
            {t('room.tasks')}
          </h2>
          
          {tasks.length === 0 ? (
            <div className="text-slate-500 text-center py-8">
              {t('room.noTasks')}
            </div>
          ) : (
            tasks.map(task => {
              const isCompleted = completions.some(c => c.taskId === task.id);
              return (
                <div key={task.id} className="flex items-center justify-between group">
                  <div className="flex-1">
                    <TaskCheckbox
                      taskId={task.id}
                      name={task.name[language] || task.name.ru}
                      isCompleted={isCompleted}
                      onToggle={() => handleToggleTask(task.id)}
                    />
                  </div>
                  {!task.isPreset && (
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 px-4">
          <button 
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-200"
          >
            {calendarOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {t('room.calendar')}
          </button>
          {calendarOpen && (
            <div className="mt-3">
              <RoomCalendar 
                roomId={roomId!}
                roomColor={room.color}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
          )}
        </div>

        <button 
          onClick={() => setAddTaskOpen(true)}
          className="w-full py-4 text-slate-400 border border-dashed border-slate-700 rounded-xl hover:bg-slate-900/50 hover:text-slate-300 transition-colors flex items-center justify-center gap-2"
        >
          <span>+ {t('room.addTask')}</span>
        </button>
      </main>

      <AddTaskDialog 
        roomId={roomId || ''} 
        open={addTaskOpen} 
        onOpenChange={setAddTaskOpen} 
      />
    </div>
  );
}
