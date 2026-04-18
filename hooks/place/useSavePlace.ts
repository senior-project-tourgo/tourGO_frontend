import { useRef } from 'react';
import { toggleSavePlace } from '@/services/user.service';
import { useSaveStore } from '@/stores/saveStore';

export function useSavePlace() {
  const savedPlaces = useSaveStore(state => state.savedPlaces);
  const setSavedPlaces = useSaveStore(state => state.setSavedPlaces);

  // per-id in-flight guard (sync, no re-render)
  const inFlightRef = useRef<Set<string>>(new Set());

  const toggleSave = async (placeId: string) => {
    if (inFlightRef.current.has(placeId)) return;

    inFlightRef.current.add(placeId);

    let wasSaved = false;

    // SAFE optimistic update (no stale closure)
    setSavedPlaces(prev => {
      wasSaved = prev.includes(placeId);

      return wasSaved ? prev.filter(id => id !== placeId) : [...prev, placeId];
    });

    try {
      const result = await toggleSavePlace(placeId);
      setSavedPlaces(result.savedPlaces);
    } catch {
      // rollback using captured value
      setSavedPlaces(prev =>
        wasSaved ? [...prev, placeId] : prev.filter(id => id !== placeId)
      );
    } finally {
      inFlightRef.current.delete(placeId);
    }
  };

  return {
    savedPlaces,
    toggleSave,
    setSavedPlaces // keep for hydration
  };
}
