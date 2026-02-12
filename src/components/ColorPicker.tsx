import { colorMap } from '@/lib/colorMap';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  selected: string;
  onSelect: (color: string) => void;
}

export const ColorPicker = ({ selected, onSelect }: ColorPickerProps) => {
  return (
    <div className="grid grid-cols-7 gap-2" role="radiogroup" aria-label="Color selection">
      {Object.entries(colorMap).map(([name, bgClass]) => (
        <button
          key={name}
          type="button"
          onClick={() => onSelect(name)}
          className={cn(
            `w-8 h-8 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${bgClass}`,
            selected === name ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : ''
          )}
          aria-label={name}
          role="radio"
          aria-checked={selected === name}
        />
      ))}
    </div>
  );
};
