import type { TripPlace } from '@/features/place/trip-place.types';

export const tripPlacesMock: TripPlace[] = [
  // trip_001
  { tripPlaceId: 'tp_001', tripId: 'trip_001', placeId: 'plc_001', order: 1 },
  { tripPlaceId: 'tp_002', tripId: 'trip_001', placeId: 'plc_003', order: 2 },
  { tripPlaceId: 'tp_003', tripId: 'trip_001', placeId: 'plc_002', order: 3 },

  // trip_002
  { tripPlaceId: 'tp_004', tripId: 'trip_002', placeId: 'plc_002', order: 1 },

  // trip_003
  { tripPlaceId: 'tp_005', tripId: 'trip_003', placeId: 'plc_001', order: 1 },
  { tripPlaceId: 'tp_006', tripId: 'trip_003', placeId: 'plc_003', order: 2 },

  // trip_004
  { tripPlaceId: 'tp_007', tripId: 'trip_004', placeId: 'plc_003', order: 1 },

  // trip_005
  { tripPlaceId: 'tp_008', tripId: 'trip_005', placeId: 'plc_002', order: 1 },
  { tripPlaceId: 'tp_009', tripId: 'trip_005', placeId: 'plc_003', order: 2 }
];
