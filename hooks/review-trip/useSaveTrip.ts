// review-trip/hooks/useSaveTrip.ts

import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { createTrip } from '@/services/trip.service';

interface EditablePlace {
  place: {
    placeId: string;
  };
  order: number;
}

export function useSaveTrip(
  editablePlaces: EditablePlace[],
  itineraryName: string
) {
  const [loading, setLoading] = useState(false);

  const saveTrip = async (status: 'saved' | 'current') => {
    if (editablePlaces.length === 0) {
      Alert.alert('Trip must contain at least one place');
      return;
    }

    try {
      setLoading(true);

      await createTrip({
        itineraryName,
        places: editablePlaces.map(p => ({
          placeId: p.place.placeId,
          order: p.order
        })),
        status
      });

      if (status === 'current') {
        router.replace('/during-trip');
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
