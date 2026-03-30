// review-trip/hooks/useSaveTrip.ts

import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { createTrip } from '@/services/trip.service';
import type { Trip } from '@/features/trip/trip.types';

interface EditablePlace {
  place: {
    placeId: string;
  };
  order: number;
}

export function useSaveTrip(
  editablePlaces: EditablePlace[],
  itineraryName: string,
  startCoords?: { latitude: number; longitude: number } | null,
  startLabel?: string | null
) {
  const [loading, setLoading] = useState(false);

  const saveTrip = async (status: 'saved' | 'current') => {
    if (editablePlaces.length === 0) {
      Alert.alert('Trip must contain at least one place');
      return;
    }

    try {
      setLoading(true);

      const trip: Trip = await createTrip({
        itineraryName,
        places: editablePlaces.map(p => ({
          placeId: p.place.placeId,
          order: p.order
        })),
        status
      });

      if (status === 'current') {
        router.replace({
          pathname: '/during-trip',
          params: {
            tripId: trip._id,
            ...(startCoords && {
              startLat: startCoords.latitude,
              startLng: startCoords.longitude
            }),
            ...(startLabel && { startLabel })
          }
        });
      } else {
        router.replace('/(tabs)/trip');
      }
    } catch (error) {
      console.error('Failed to save trip:', error);
      Alert.alert('Error', 'Failed to save trip');
    } finally {
      setLoading(false);
    }
  };

  return { saveTrip, loading };
}
