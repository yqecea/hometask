import { iconMap } from '@/lib/iconMap';

interface IconPickerProps {
  selected: string;
  onSelect: (icon: string) => void;
}

export const IconPicker = ({ selected, onSelect }: IconPickerProps) => {
  return (
    <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto p-1">
      {Object.entries(iconMap).map(([name, Icon]) => (
        <div
          key={name}
          onClick={() => onSelect(name)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${
            selected === name
              ? 'bg-teal-500/20 border border-teal-500 text-teal-500'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Icon size={20} />
        </div>
      ))}
    </div>
  );
};
