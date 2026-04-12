import { Area, PriceRange } from '@/features/place/place.types';
import { PaceValue } from '@/constants/paceOptions';
import { TransportMode } from '@/constants/transportOptions';

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
  groupType,
  transportMode,
  budgetTier,
  startLat,
  startLng,
  startLabel
}: {
  itineraryName: string;
  area: Area | null;
  people: number;
  pace: PaceValue;
  tripDate?: Date | null;
  startTime?: Date | null;
  endTime?: Date | null;
  groupType?: string;
  transportMode?: TransportMode;
  budgetTier?: PriceRange;
  startLat?: number;
  startLng?: number;
  startLabel?: string;
}) {
  const payload: Record<string, any> = {
    itineraryName: itineraryName.trim(),
    travelingArea: area,
    numberOfPeople: people,
    pace
  };

  if (groupType) payload.groupType = groupType;
  if (tripDate) payload.tripDate = formatDate(tripDate);
  if (startTime) payload.startTime = formatTime(startTime);
  if (endTime) payload.endTime = formatTime(endTime);
  if (transportMode) payload.transportMode = transportMode;
  if (budgetTier) payload.priceRange = budgetTier;
  if (startLat != null) payload.startLat = startLat;
  if (startLng != null) payload.startLng = startLng;
  if (startLabel) payload.startLabel = startLabel;

  return payload;
}
