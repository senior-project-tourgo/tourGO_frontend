import { Area } from '@/features/place/place.types';
import { PaceValue } from '@/constants/paceOptions';

function formatDate(date: Date) {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

function formatTime(date: Date) {
  return date.toTimeString().slice(0, 5); // HH:mm
}

export function buildTripPayload({
  itineraryName,
  area,
  people,
  pace,
  tripDate,
  startTime,
  endTime,
  groupType
}: {
  itineraryName: string;
  area: Area | null;
  people: number;
  pace: PaceValue;
  tripDate?: Date | null;
  startTime?: Date | null;
  endTime?: Date | null;
  groupType?: string;
}) {
  const payload: Record<string, any> = {
    itineraryName: itineraryName.trim(),
    travelingArea: area,
    numberOfPeople: people,
    pace,
    groupType: groupType ?? ''
  };

  if (tripDate) payload.tripDate = formatDate(tripDate);
  if (startTime) payload.startTime = formatTime(startTime);
  if (endTime) payload.endTime = formatTime(endTime);

  return payload;
}
