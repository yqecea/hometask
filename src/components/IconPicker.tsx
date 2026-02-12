import { iconMap } from '@/lib/iconMap';
import { cn } from '@/lib/utils';

interface IconPickerProps {
  selected: string;
  onSelect: (icon: string) => void;
}

export const IconPicker = ({ selected, onSelect }: IconPickerProps) => {
  return (
    <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto p-1" role="radiogroup" aria-label="Icon selection">
      {Object.entries(iconMap).map(([name, Icon]) => (
        <button
          key={name}
          type="button"
          onClick={() => onSelect(name)}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
            selected === name
              ? 'bg-teal-500/20 border border-teal-500 text-teal-500 scale-105'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
          )}
          aria-label={name}
          role="radio"
          aria-checked={selected === name}
        >
          <Icon size={20} />
        </button>
      ))}
    </div>
  );
};
