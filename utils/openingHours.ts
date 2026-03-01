import type { Place } from '@/features/place/place.types';

type TodayOpeningStatus = {
  isOpenNow: boolean;
  nextTime: {
    type: 'open' | 'close';
    time: Date;
  } | null;
};

export function getPlaceOpeningStatus(
  openingHours?: Place['openingHours'],
  now: Date = new Date()
): TodayOpeningStatus {
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ] as const;

  const todayIndex = now.getDay();
  let nextTime: TodayOpeningStatus['nextTime'] = null;

  const yesterdayIndex = (todayIndex + 6) % 7;
  const yesterdayKey = days[yesterdayIndex];
  const yesterdayRanges = openingHours?.[yesterdayKey] ?? [];

  for (const { open, close } of yesterdayRanges) {
    const [openH, openM] = open.split(':').map(Number);
    const [closeH, closeM] = close.split(':').map(Number);

    // Only consider overnight ranges
    if (closeH < openH || (closeH === openH && closeM < openM)) {
      const openTime = new Date(now);
      openTime.setDate(openTime.getDate() - 1);
      openTime.setHours(openH, openM, 0, 0);

      const closeTime = new Date(openTime);
      closeTime.setDate(closeTime.getDate() + 1);
      closeTime.setHours(closeH, closeM, 0, 0);

      if (now >= openTime && now < closeTime) {
        return {
          isOpenNow: true,
          nextTime: { type: 'close', time: closeTime }
        };
      }
    }
  }

  // Check today’s opening hours
  const todayKey = days[todayIndex];
  const todayRanges = openingHours?.[todayKey] ?? [];

  for (const { open, close } of todayRanges) {
    const [openH, openM] = open.split(':').map(Number);
    const [closeH, closeM] = close.split(':').map(Number);

    const openTime = new Date(now);
    openTime.setHours(openH, openM, 0, 0);

    const closeTime = new Date(now);
    closeTime.setHours(closeH, closeM, 0, 0);

    // Overnight case (e.g. 18:00 → 02:00)
    if (closeTime <= openTime) {
      closeTime.setDate(closeTime.getDate() + 1);
    }

    if (now >= openTime && now < closeTime) {
      return {
        isOpenNow: true,
        nextTime: { type: 'close', time: closeTime }
      };
    }

    if (now < openTime) {
      nextTime ??= { type: 'open', time: openTime };
    }
  }

  // If closed today, look ahead for next opening day
  if (!nextTime) {
    for (let i = 1; i <= 7; i++) {
      const dayIndex = (todayIndex + i) % 7;
      const dayKey = days[dayIndex];
      const ranges = openingHours?.[dayKey] ?? [];

      if (!ranges.length) continue;

      const { open } = ranges[0];
      const [openH, openM] = open.split(':').map(Number);

      const openTime = new Date(now);
      openTime.setDate(now.getDate() + i);
      openTime.setHours(openH, openM, 0, 0);

      nextTime = { type: 'open', time: openTime };
      break;
    }
  }

  return {
    isOpenNow: false,
    nextTime
  };
}
