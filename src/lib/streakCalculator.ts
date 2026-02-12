import { format, subDays } from 'date-fns';
import type { CompletionLog } from '@/types';

export function calculateStreak(completions: CompletionLog[]): number {
  if (completions.length === 0) return 0;

  const completedDates = new Set(completions.map((c) => c.date));
  const today = format(new Date(), 'yyyy-MM-dd');

  let streak = 0;
  let currentDate = today;

  if (completedDates.has(currentDate)) {
    streak = 1;
    currentDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  } else {
    currentDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  }

  let daysBack = 1;
  while (completedDates.has(currentDate)) {
    streak++;
    daysBack++;
    currentDate = format(subDays(new Date(), daysBack), 'yyyy-MM-dd');
  }

  return streak;
}
