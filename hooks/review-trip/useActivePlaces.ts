import { useEffect, useState } from 'react';
import { getActivePlaces } from '../../features/place/place.api';
import { Place } from '../../features/place/place.types';

export function useActivePlaces(limit?: number) {
  const [data, setData] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    getActivePlaces(limit)
      .then(places => {
        if (ignore) return;
        setData(places);
      })
      .catch((err: Error) => {
        if (ignore) return;
        setError(err);
      })
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [limit]);

  return { data, loading, error };
}
