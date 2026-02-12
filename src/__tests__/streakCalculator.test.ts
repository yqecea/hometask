import { describe, it, expect } from 'vitest';
import { format, subDays } from 'date-fns';
import { calculateStreak } from '../lib/streakCalculator';
import type { CompletionLog } from '../types';

function makeLog(date: string, roomId = 'room-1', taskId = 'task-1'): CompletionLog {
  return {
    id: crypto.randomUUID(),
    taskId,
    roomId,
    date,
    completedAt: new Date().toISOString(),
  };
}

function daysAgo(n: number): string {
  return format(subDays(new Date(), n), 'yyyy-MM-dd');
}

const today = daysAgo(0);
const yesterday = daysAgo(1);
const dayBefore = daysAgo(2);

describe('calculateStreak', () => {
  it('returns 0 for empty completions', () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('returns 1 for one completion today', () => {
    expect(calculateStreak([makeLog(today)])).toBe(1);
  });

  it('returns 2 for completions today and yesterday', () => {
    const logs = [makeLog(today), makeLog(yesterday)];
    expect(calculateStreak(logs)).toBe(2);
  });

  it('returns 3 for completions today, yesterday, and day before', () => {
    const logs = [makeLog(today), makeLog(yesterday), makeLog(dayBefore)];
    expect(calculateStreak(logs)).toBe(3);
  });

  it('returns 1 when today has completion but yesterday is missing (gap breaks streak)', () => {
    const logs = [makeLog(today), makeLog(dayBefore)];
    expect(calculateStreak(logs)).toBe(1);
  });

  it('returns 2 when no completion today but yesterday and day before exist', () => {
    const logs = [makeLog(yesterday), makeLog(dayBefore)];
    expect(calculateStreak(logs)).toBe(2);
  });

  it('counts multiple completions on the same day as 1 day', () => {
    const logs = [
      makeLog(today, 'room-1', 'task-1'),
      makeLog(today, 'room-2', 'task-2'),
      makeLog(today, 'room-3', 'task-3'),
    ];
    expect(calculateStreak(logs)).toBe(1);
  });

  it('returns 0 for completions only 5 days ago', () => {
    const logs = [makeLog(daysAgo(5))];
    expect(calculateStreak(logs)).toBe(0);
  });

  it('handles a long consecutive streak', () => {
    const logs = Array.from({ length: 10 }, (_, i) => makeLog(daysAgo(i)));
    expect(calculateStreak(logs)).toBe(10);
  });

  it('stops streak at the first gap in a long history', () => {
    const logs = [
      makeLog(daysAgo(0)),
      makeLog(daysAgo(1)),
      makeLog(daysAgo(3)),
      makeLog(daysAgo(4)),
      makeLog(daysAgo(5)),
      makeLog(daysAgo(6)),
    ];
    expect(calculateStreak(logs)).toBe(2);
  });
});
