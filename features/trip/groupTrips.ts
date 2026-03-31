import type { Trip } from './trip.types';

export function groupTrips(trips: Trip[]) {
  return {
    current: trips.filter(t => t.status === 'current'),
    saved: trips.filter(t => t.status === 'saved'),
    completed: trips.filter(t => t.status === 'completed')
  };
}
