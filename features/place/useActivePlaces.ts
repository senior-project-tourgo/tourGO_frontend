import { useEffect, useState } from 'react';
import { Place } from './place.types';
import { fetchActivePlaces } from './place.api';

export function useActivePlaces(limit?: number) {
  const [data, setData] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    fetchActivePlaces(limit)
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
