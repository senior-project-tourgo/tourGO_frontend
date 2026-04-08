import { useEffect, useState } from 'react';
import { getUserProfile, toggleSavePlace } from '@/services/user.service';

export function useSavedPlaces() {
  const [savedPlaces, setSavedPlaces] = useState<string[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    getUserProfile()
      .then(profile => setSavedPlaces(profile.savedPlaces))
      .catch(() => {});
  }, []);

  const handleToggleSave = async (placeId: string) => {
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

  return { savedPlaces, handleToggleSave, savingId };
}
