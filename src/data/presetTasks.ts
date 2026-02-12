import type { Task } from '@/types';

function t(id: string, roomId: string, ru: string, kz: string, order: number): Task {
  return {
    id,
    roomId,
    name: { ru, kz },
    order,
    isPreset: true,
    createdAt: new Date().toISOString(),
  };
}

export const presetTasks: Task[] = [
  // Весь дом
  t('task-whole-house-vacuum', 'room-whole-house', 'Пропылесосить', 'Шаңсорғыш тарту', 0),
  t('task-whole-house-mop', 'room-whole-house', 'Влажная уборка', 'Дымқыл тазалау', 1),
  t('task-whole-house-dust', 'room-whole-house', 'Протереть пыль', 'Шаңды сүрту', 2),

  // Прихожая 1 этаж
  t('task-hallway-vacuum', 'room-hallway-1', 'Пропылесосить', 'Шаңсорғыш тарту', 0),
  t('task-hallway-dust', 'room-hallway-1', 'Протереть пыль', 'Шаңды сүрту', 1),
  t('task-hallway-shoes', 'room-hallway-1', 'Убрать обувь', 'Аяқ киімді жинау', 2),

  // Кухня
  t('task-kitchen-dishes', 'room-kitchen', 'Помыть посуду', 'Ыдыс жуу', 0),
  t('task-kitchen-table', 'room-kitchen', 'Протереть стол', 'Үстелді сүрту', 1),
  t('task-kitchen-stove', 'room-kitchen', 'Протереть плиту', 'Плитаны сүрту', 2),
  t('task-kitchen-floor', 'room-kitchen', 'Помыть пол', 'Еденді жуу', 3),
  t('task-kitchen-trash', 'room-kitchen', 'Вынести мусор', 'Қоқысты шығару', 4),

  // Лестница
  t('task-stairs-vacuum', 'room-stairs', 'Пропылесосить', 'Шаңсорғыш тарту', 0),
  t('task-stairs-railing', 'room-stairs', 'Протереть перила', 'Тұтқаларды сүрту', 1),

  // Коридор 2 этаж
  t('task-corridor-vacuum', 'room-corridor-2', 'Пропылесосить', 'Шаңсорғыш тарту', 0),
  t('task-corridor-dust', 'room-corridor-2', 'Протереть пыль', 'Шаңды сүрту', 1),

  // Гостиная
  t('task-living-vacuum', 'room-living', 'Пропылесосить', 'Шаңсорғыш тарту', 0),
  t('task-living-dust', 'room-living', 'Протереть пыль', 'Шаңды сүрту', 1),
  t('task-living-tidy', 'room-living', 'Расставить вещи', 'Заттарды орналастыру', 2),
  t('task-living-floor', 'room-living', 'Помыть пол', 'Еденді жуу', 3),

  // Ванная
  t('task-bathroom-sink', 'room-bathroom', 'Помыть раковину', 'Раковинаны жуу', 0),
  t('task-bathroom-tub', 'room-bathroom', 'Помыть ванну', 'Ваннаны жуу', 1),
  t('task-bathroom-toilet', 'room-bathroom', 'Помыть унитаз', 'Дәретхананы жуу', 2),
  t('task-bathroom-floor', 'room-bathroom', 'Помыть пол', 'Еденді жуу', 3),
  t('task-bathroom-mirror', 'room-bathroom', 'Протереть зеркало', 'Айнаны сүрту', 4),

  // Прачечная
  t('task-laundry-wash', 'room-laundry', 'Постирать', 'Кір жуу', 0),
  t('task-laundry-hang', 'room-laundry', 'Развесить бельё', 'Кірді ілу', 1),
  t('task-laundry-tidy', 'room-laundry', 'Убрать', 'Жинау', 2),

  // Спальня 1
  t('task-bedroom1-bed', 'room-bedroom-1', 'Застелить кровать', 'Төсекті жасау', 0),
  t('task-bedroom1-vacuum', 'room-bedroom-1', 'Пропылесосить', 'Шаңсорғыш тарту', 1),
  t('task-bedroom1-dust', 'room-bedroom-1', 'Протереть пыль', 'Шаңды сүрту', 2),
  t('task-bedroom1-air', 'room-bedroom-1', 'Проветрить', 'Желдету', 3),

  // Спальня 2
  t('task-bedroom2-bed', 'room-bedroom-2', 'Застелить кровать', 'Төсекті жасау', 0),
  t('task-bedroom2-vacuum', 'room-bedroom-2', 'Пропылесосить', 'Шаңсорғыш тарту', 1),
  t('task-bedroom2-dust', 'room-bedroom-2', 'Протереть пыль', 'Шаңды сүрту', 2),
  t('task-bedroom2-air', 'room-bedroom-2', 'Проветрить', 'Желдету', 3),

  // Спальня 3
  t('task-bedroom3-bed', 'room-bedroom-3', 'Застелить кровать', 'Төсекті жасау', 0),
  t('task-bedroom3-vacuum', 'room-bedroom-3', 'Пропылесосить', 'Шаңсорғыш тарту', 1),
  t('task-bedroom3-dust', 'room-bedroom-3', 'Протереть пыль', 'Шаңды сүрту', 2),
  t('task-bedroom3-air', 'room-bedroom-3', 'Проветрить', 'Желдету', 3),

  // Окна
  t('task-windows-wash', 'room-windows', 'Помыть окна', 'Терезелерді жуу', 0),
  t('task-windows-sills', 'room-windows', 'Протереть подоконники', 'Терезе тақтайларын сүрту', 1),

  // Балкон
  t('task-balcony-sweep', 'room-balcony', 'Подмести', 'Сыпыру', 0),
  t('task-balcony-wipe', 'room-balcony', 'Протереть', 'Сүрту', 1),

  // Сад
  t('task-garden-water', 'room-garden', 'Полить растения', 'Өсімдіктерді суару', 0),
  t('task-garden-trash', 'room-garden', 'Убрать мусор', 'Қоқысты жинау', 1),
  t('task-garden-sweep', 'room-garden', 'Подмести дорожки', 'Жолдарды сыпыру', 2),
];
