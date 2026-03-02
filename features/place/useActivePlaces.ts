import { useEffect, useState } from 'react';
import { Place } from './place.types';
import { fetchActivePlaces } from './place.api';

export function useActivePlaces(limit?: number) {
  const [data, setData] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchActivePlaces(limit)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [limit]);

  return { data, loading, error };
}
