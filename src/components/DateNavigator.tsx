import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, isSameDay, isYesterday, isToday } from 'date-fns';
import { ru, kk } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';
import { cn } from '@/lib/utils';

interface DateNavigatorProps {
  date: string;
  onDateChange: (date: string) => void;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({ date, onDateChange }) => {
  const { t } = useTranslation();
  const { language } = useSettingsStore();
  
  const currentDate = new Date(date);
  const today = new Date();
  const isCurrentToday = isSameDay(currentDate, today);

  const handlePrevDay = () => {
    onDateChange(format(subDays(currentDate, 1), 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    if (!isCurrentToday) {
      onDateChange(format(addDays(currentDate, 1), 'yyyy-MM-dd'));
    }
  };

  const locale = language === 'kz' ? kk : ru;

  let dateText = '';
  if (isToday(currentDate)) {
    dateText = `${t('calendar.today')}, ${format(currentDate, 'd MMMM', { locale })}`;
  } else if (isYesterday(currentDate)) {
    dateText = `${t('calendar.yesterday')}, ${format(currentDate, 'd MMMM', { locale })}`;
  } else {
    dateText = format(currentDate, 'd MMMM yyyy', { locale });
  }

  dateText = dateText.charAt(0).toUpperCase() + dateText.slice(1);

  return (
    <div className="flex items-center justify-between py-3 text-slate-300">
      <button 
        onClick={handlePrevDay}
        className="p-2 hover:bg-slate-800 rounded-full transition-colors"
        aria-label="Previous day"
      >
        <ChevronLeft size={20} />
      </button>
      
      <span className="text-base font-medium select-none">
        {dateText}
      </span>

      <button 
        onClick={handleNextDay}
        disabled={isCurrentToday}
        className={cn(
          "p-2 rounded-full transition-colors",
          isCurrentToday ? "text-slate-600 cursor-not-allowed" : "hover:bg-slate-800"
        )}
        aria-label="Next day"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
