import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoomStore } from '@/stores/roomStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconPicker } from '@/components/IconPicker';
import { ColorPicker } from '@/components/ColorPicker';
import type { Room } from '@/types';
import { useSettingsStore } from '@/stores/settingsStore';

interface EditRoomDialogProps {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditRoomDialog({ room, open, onOpenChange }: EditRoomDialogProps) {
  const { t } = useTranslation();
  const { updateRoom, deleteRoom } = useRoomStore();
  const { language } = useSettingsStore();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('home');
  const [color, setColor] = useState('teal');

  useEffect(() => {
    if (room) {
      setName(room.name[language] || room.name.ru || '');
      setIcon(room.icon);
      setColor(room.color);
    }
  }, [room, language, open]);

  const handleSave = async () => {
    if (!room || name.trim().length < 2) return;

    await updateRoom(room.id, {
      name: { ru: name, kz: name },
      icon,
      color,
    });

    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!room) return;
    await deleteRoom(room.id);
    onOpenChange(false);
  };

  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle>{t('roomDialog.editTitle')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="edit-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-400">
              {t('common.name')}
            </label>
            <Input
              id="edit-name"
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
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {!room.isPreset && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="sm:mr-auto bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0">
                  {t('common.delete')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('roomDialog.deleteTitle')}</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    {t('roomDialog.deleteConfirm')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                    {t('common.cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white border-0">
                    {t('common.delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <div className="flex gap-2 justify-end w-full sm:w-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave} disabled={name.trim().length < 2} className="bg-teal-500 hover:bg-teal-600 text-white border-0">
              {t('common.save')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
