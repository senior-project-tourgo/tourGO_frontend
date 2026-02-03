// features/place/utils/openingHours.ts
import type { Place } from '@/features/place/place.types';

type TodayOpeningStatus = {
  isOpenNow: boolean;
  todayHours: {
    open: string;
    close: string;
  }[];
};

export function getPlaceOpeningStatus(
  openingHours: Place['openingHours'],
  now: Date = new Date()
): TodayOpeningStatus {
  const day = now
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as keyof Place['openingHours'];

  const todayRanges = openingHours?.[day] ?? [];

  let isOpenNow = false;

  for (const { open, close } of todayRanges) {
    const [openH, openM] = open.split(':').map(Number);
    const [closeH, closeM] = close.split(':').map(Number);

    const openTime = new Date(now);
    openTime.setHours(openH, openM, 0, 0);

    const closeTime = new Date(now);
    closeTime.setHours(closeH, closeM, 0, 0);

    // Handles overnight opening (e.g. 18:00 → 02:00)
    if (closeTime <= openTime) {
      closeTime.setDate(closeTime.getDate() + 1);
    }

    if (now >= openTime && now <= closeTime) {
      isOpenNow = true;
      break;
    }
  }

  return {
    isOpenNow,
    todayHours: todayRanges
  };
}
