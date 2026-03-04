import { Place } from '@/features/place/place.types';
import { useState, useCallback } from 'react';

export type EditableTripPlace = {
  place: Place;
  order: number;
};

export function useEditableTrip(initialPlaces: EditableTripPlace[]) {
  const [places, setPlaces] = useState<EditableTripPlace[]>(initialPlaces);

  const setInitialPlaces = useCallback((newPlaces: EditableTripPlace[]) => {
    setPlaces(newPlaces);
  }, []);

  const addPlace = useCallback((place: Place) => {
    setPlaces(prev => {
      if (prev.some(p => p.place.placeId === place.placeId)) return prev;

      return [
        ...prev,
        {
          place,
          order: prev.length + 1
        }
      ];
    });
  }, []);

  const removePlace = useCallback((placeId: string) => {
    setPlaces(prev =>
      prev
        .filter(p => p.place.placeId !== placeId)
        .map((p, index) => ({
          ...p,
          order: index + 1
        }))
    );
  }, []);

  return {
    places,
    addPlace,
    removePlace,
    setInitialPlaces
  };
}
