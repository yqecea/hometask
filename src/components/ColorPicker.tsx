import { colorMap } from '@/lib/colorMap';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  selected: string;
  onSelect: (color: string) => void;
}

export const ColorPicker = ({ selected, onSelect }: ColorPickerProps) => {
  return (
    <div className="grid grid-cols-7 gap-2">
      {Object.entries(colorMap).map(([name, bgClass]) => (
        <div
          key={name}
          onClick={() => onSelect(name)}
          className={cn(
            `w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 ${bgClass}`,
            selected === name ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
          )}
        />
      ))}
    </div>
  );
};
