import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface TaskCheckboxProps {
  taskId: string;
  name: string;
  isCompleted: boolean;
  onToggle: () => void;
}

export const TaskCheckbox: React.FC<TaskCheckboxProps> = ({
  taskId,
  name,
  isCompleted,
  onToggle
}) => {
  return (
    <div className="flex items-center gap-3 py-2">
      <Checkbox
        id={`task-${taskId}`}
        checked={isCompleted}
        onCheckedChange={onToggle}
        className="border-slate-500 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
      />
      <label
        htmlFor={`task-${taskId}`}
        className={cn(
          "text-base cursor-pointer select-none transition-colors",
          isCompleted ? "text-slate-500 line-through" : "text-slate-200"
        )}
      >
        {name}
      </label>
    </div>
  );
};
