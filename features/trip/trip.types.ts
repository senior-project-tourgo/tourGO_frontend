export type TripPlace = {
  placeId: string;
  order: number;
  visitedAt: string | null;
};

export type TripStatus = 'saved' | 'current' | 'completed';

export type Trip = {
  _id: string;
  userId: string;
  itineraryName: string;
  places: TripPlace[];
  status: TripStatus;
  startedAt: string | null;
  pausedAt: string | null;
  completedAt: string | null;
  totalDuration: number | null;
  xpEarned: number;
  createdAt: string;
  updatedAt: string;
};

export type CompleteTripResult = {
  trip: Trip;
  xpEarned: number;
  totalXp: number;
  badge: string;
  visitedCount: number;
  totalDuration: number | null;
};

export type CheckInResult = {
  trip: Trip;
  xpEarned: number;
  totalXp: number;
  badge: string;
};
