// hooks/usePlaces.ts
import { useEffect, useRef, useState } from 'react';
import { getActivePlaces, searchPlaces } from '@/features/place/place.api';
import type { Place } from '@/features/place/place.types';

export function usePlaces(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    loadPlaces('');

    return () => {
      // Cleanup on unmount
      if (searchTimer.current) clearTimeout(searchTimer.current);
      isMounted.current = false;
    };
  }, []);

  function onChangeQuery(text: string) {
    setQuery(text);
    if (searchTimer.current) clearTimeout(searchTimer.current);

    searchTimer.current = setTimeout(() => {
      if (isMounted.current) {
        loadPlaces(text);
      }
    }, 350);
  }

  async function loadPlaces(q: string) {
    setLoading(true);
    try {
      const results = await searchPlaces(q, 50);
      setPlaces(results);
    } catch {
      try {
        const all = await getActivePlaces(50);
        setPlaces(all);
      } catch {}
    } finally {
      setLoading(false);
    }
  }

  return { query, setQuery, places, loading, onChangeQuery };
}
