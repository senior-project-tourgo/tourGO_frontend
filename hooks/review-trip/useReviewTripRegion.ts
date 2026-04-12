import { useEffect, useRef, useState } from 'react';
import { MapRegion } from '@/components/Map';
import { useUserLocation } from '@/hooks/review-trip/add-place/useUserLocation';

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
  // Track whether we've already picked an initial region so that adding /
  // removing places later doesn't reset the map viewport.
  const initialised = useRef(false);
  const { requestLocation } = useUserLocation({ autoRequest: false });

  useEffect(() => {
    // Only run once, or when places first arrive from an async load ([] → [...])
    if (initialised.current) return;
    if (editablePlaces.length === 0) return; // wait for places to arrive

    initialised.current = true;
    setRegion({
      latitude: Number(editablePlaces[0].place.location.lat),
      longitude: Number(editablePlaces[0].place.location.lng),
      latitudeDelta: 0.05,
      longitudeDelta: 0.05
    });
  }, [editablePlaces]);

  // Fallback: if no places arrive (e.g. empty new trip), use device location
  useEffect(() => {
    if (initialised.current) return;

    let active = true;

    async function initFromLocation() {
      if (initialised.current) return;
      try {
        if (!active || initialised.current) return;

        const loc = await requestLocation();
        if (!active || initialised.current) return;

        if (!loc) {
          setRegion(FALLBACK_REGION);
          initialised.current = true;
          return;
        }

        setRegion({
          latitude: loc.lat,
          longitude: loc.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        });
        initialised.current = true;
      } catch {
        if (active && !initialised.current) {
          setRegion(FALLBACK_REGION);
          initialised.current = true;
        }
      }
    }

    // Give places a short window to arrive before falling back to GPS
    const timer = setTimeout(initFromLocation, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [requestLocation]);

  return { region };
}
