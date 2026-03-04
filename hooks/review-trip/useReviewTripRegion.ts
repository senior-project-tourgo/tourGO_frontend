// review-trip/hooks/useReviewTripRegion.ts

import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { MapRegion } from '@/components/Map';

interface EditablePlace {
  place: {
    location: {
      lat: string | number;
      lng: string | number;
    };
  };
}

export function useReviewTripRegion(editablePlaces: EditablePlace[]) {
  const [region, setRegion] = useState<MapRegion | null>(null);

  useEffect(() => {
    let active = true;

    async function initializeRegion() {
      if (editablePlaces.length > 0) {
        setRegion({
          latitude: Number(editablePlaces[0].place.location.lat),
          longitude: Number(editablePlaces[0].place.location.lng),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        });
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (!active) return;

      if (status !== 'granted') {
        setRegion({
          latitude: 0,
          longitude: 0,
          latitudeDelta: 60,
          longitudeDelta: 60
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      if (!active) return;

      if (editablePlaces.length === 0) {
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        });
      }
    }

    initializeRegion();

    return () => {
      active = false;
    };
  }, [editablePlaces]);

  return { region };
}
