import { useState } from 'react';
import { toggleSavePlace } from '@/services/user.service';

export function useSavePlace(initialSaved: string[] = []) {
  const [savedPlaces, setSavedPlaces] = useState<string[]>(initialSaved);
  const [savingId, setSavingId] = useState<string | null>(null);

  const toggleSave = async (placeId: string) => {
    if (savingId) return;

    setSavingId(placeId);

    // optimistic update
    setSavedPlaces(prev =>
      prev.includes(placeId)
        ? prev.filter(id => id !== placeId)
        : [...prev, placeId]
    );

    try {
      const result = await toggleSavePlace(placeId);
      setSavedPlaces(result.savedPlaces);
    } catch {
      // rollback
      setSavedPlaces(prev =>
        prev.includes(placeId)
          ? prev.filter(id => id !== placeId)
          : [...prev, placeId]
      );
    } finally {
      setSavingId(null);
    }
  };

  return {
    savedPlaces,
    savingId,
    toggleSave,
    setSavedPlaces // for initial hydration
  };
}
