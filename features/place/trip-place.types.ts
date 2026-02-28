// features/trip/trip-place.types.ts

export type TripPlaceId = `tp_${string}`;
export type TripId = `trip_${string}`;
export type PlaceId = `plc_${string}`;

export interface TripPlace {
  tripPlaceId: TripPlaceId;
  tripId: TripId;
  placeId: PlaceId;
  order: number; // position in itinerary
}
