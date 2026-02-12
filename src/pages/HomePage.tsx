
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RoomCard } from '@/components/RoomCard';
import { useRoomStore } from '@/stores/roomStore';
import { AddRoomDialog } from '@/components/AddRoomDialog';
import { EditRoomDialog } from '@/components/EditRoomDialog';
import { StreakBadge } from '@/components/StreakBadge';
import type { Room } from '@/types';

export default function HomePage() {
  const { t } = useTranslation();
  const rooms = useRoomStore((state) => state.rooms);
  
  const [addRoomOpen, setAddRoomOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-2xl font-bold text-slate-100">{t('home.title')}</h1>
        <StreakBadge />
      </div>

      <div className="flex items-center justify-between px-4 pt-4">
        <h2 className="text-lg font-semibold text-slate-300">{t('home.rooms')}</h2>
        <button 
          onClick={() => setAddRoomOpen(true)}
          className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
        >
          + {t('home.addRoom')}
        </button>
      </div>

      <div className="flex flex-col gap-2 px-4 pt-3 pb-4">
        {rooms.map((room) => (
          <RoomCard 
            key={room.id} 
            room={room} 
            onEdit={setEditRoom}
          />
        ))}
      </div>

      <AddRoomDialog open={addRoomOpen} onOpenChange={setAddRoomOpen} />
      <EditRoomDialog 
        room={editRoom} 
        open={!!editRoom} 
        onOpenChange={(open) => !open && setEditRoom(null)} 
      />
    </div>
  );
}
