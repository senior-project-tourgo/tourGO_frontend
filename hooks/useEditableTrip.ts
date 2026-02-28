import { useState } from 'react';
import { Place } from '@/features/place/place.types';

export type EditableTripPlace = {
  place: Place;
  order: number;
};

export function useEditableTrip(initialPlaces: EditableTripPlace[]) {
  const [places, setPlaces] = useState<EditableTripPlace[]>(initialPlaces);

  const addPlace = (place: Place) => {
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
  };

  const removePlace = (placeId: string) => {
    setPlaces(prev =>
      prev
        .filter(p => p.place.placeId !== placeId)
        .map((p, index) => ({
          ...p,
          order: index + 1 // re-normalize order
        }))
    );
  };

  return {
    places,
    addPlace,
    removePlace
  };
}
