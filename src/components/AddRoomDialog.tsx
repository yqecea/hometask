import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoomStore } from '@/stores/roomStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconPicker } from '@/components/IconPicker';
import { ColorPicker } from '@/components/ColorPicker';

interface AddRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddRoomDialog({ open, onOpenChange }: AddRoomDialogProps) {
  const { t } = useTranslation();
  const addRoom = useRoomStore((state) => state.addRoom);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('home');
  const [color, setColor] = useState('teal');

  const handleSave = async () => {
    if (name.trim().length < 2) return;

    await addRoom({
      name: { ru: name, kz: name },
      icon,
      color,
    });

    setName('');
    setIcon('home');
    setColor('teal');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle>{t('roomDialog.addTitle')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-400">
              {t('common.name')}
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('roomDialog.namePlaceholder')}
              className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-400">
              {t('common.icon')}
            </label>
            <IconPicker selected={icon} onSelect={setIcon} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-400">
              {t('common.color')}
            </label>
            <ColorPicker selected={color} onSelect={setColor} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={name.trim().length < 2} className="bg-teal-500 hover:bg-teal-600 text-white border-0">
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
