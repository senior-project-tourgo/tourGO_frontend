import { Area } from '@/features/place/place.types';
import { PaceValue } from '@/constants/paceOptions';

export function buildTripPayload({
  itineraryName,
  area,
  people,
  pace,
  tripDate,
  startTime,
  endTime
}: {
  itineraryName: string;
  area: Area | null;
  people: number;
  pace: PaceValue;
  tripDate?: Date | null;
  startTime?: Date | null;
  endTime?: Date | null;
}) {
  const payload: Record<string, any> = {
    itineraryName: itineraryName.trim(),
    travelingArea: area,
    numberOfPeople: people,
    pace
  };

  if (tripDate) payload.tripDate = tripDate.toISOString();
  if (startTime) payload.startTime = startTime.toISOString();
  if (endTime) payload.endTime = endTime.toISOString();

  return payload;
}
