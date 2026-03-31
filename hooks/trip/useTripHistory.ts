import { useEffect, useState } from 'react';
import type { Trip } from '@/features/trip/trip.types';
import { fetchAllUserTrips, startTrip } from '@/services/trip.service';

export function useTripHistory() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllUserTrips()
      .then(setTrips)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStart = async (tripId: string) => {
    setStartingId(tripId);
    try {
      await startTrip(tripId);
    } finally {
      setStartingId(null);
    }
  };

  return {
    trips,
    loading,
    startingId,
    handleStart
  };
}
