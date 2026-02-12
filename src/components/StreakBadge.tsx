import { useMemo } from 'react';
import { Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCompletionStore } from '@/stores/completionStore';
import { calculateStreak } from '@/lib/streakCalculator';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function StreakBadge() {
  const { t } = useTranslation();
  const completions = useCompletionStore((state) => state.completions);
  
  const streak = useMemo(() => calculateStreak(completions), [completions]);

  const getBadgeStyles = (streak: number) => {
    if (streak === 0) return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    if (streak <= 3) return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    if (streak <= 7) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    if (streak <= 14) return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

  const getIconColor = (streak: number) => {
    if (streak === 0) return "fill-slate-500";
    if (streak <= 3) return "fill-slate-400";
    if (streak <= 7) return "fill-yellow-500";
    if (streak <= 14) return "fill-orange-500";
    return "fill-red-500";
  };

  return (
    <Badge 
      variant="secondary" 
      className={cn("gap-1 transition-colors duration-300", getBadgeStyles(streak))}
    >
      <Flame className={cn("w-3 h-3", getIconColor(streak))} />
      <span>{t('streak.days_many', { count: streak })}</span>
    </Badge>
  );
}
