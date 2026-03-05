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

const FALLBACK_REGION: MapRegion = {
  latitude: 13.7563,
  longitude: 100.5018,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5
};

export function useReviewTripRegion(editablePlaces: EditablePlace[]) {
  const [region, setRegion] = useState<MapRegion | null>(null);

  useEffect(() => {
    let active = true;

    async function initializeRegion() {
      try {
        // If places already exist → use first place
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
          setRegion(FALLBACK_REGION);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});

        if (!active) return;

        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        });
      } catch (error) {
        console.error('Failed to initialize region:', error);

        if (active) {
          setRegion(FALLBACK_REGION);
        }
      }
    }

    initializeRegion();

    return () => {
      active = false;
    };
  }, [editablePlaces]);

  return { region };
}
