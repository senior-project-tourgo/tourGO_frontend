// hooks/useUserLocation.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

export type UserCoords = { lat: number; lng: number };

export type UseUserLocationStatus =
  | 'idle'
  | 'loading'
  | 'granted'
  | 'denied'
  | 'error';

type UseUserLocationOptions = {
  /**
   * Whether we should request permissions + fetch coordinates on mount.
   * Set to `false` if you only want location after a button tap, etc.
   */
  autoRequest?: boolean;
  accuracy?: number;
};

export function useUserLocation(options?: UseUserLocationOptions) {
  const { autoRequest = true, accuracy = Location.Accuracy.Balanced } =
    options ?? {};

  const [coords, setCoords] = useState<UserCoords | null>(null);
  const [status, setStatus] = useState<UseUserLocationStatus>('idle');

  // Avoid state updates after unmount (async permission/location calls).
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const requestLocation = useCallback(async (): Promise<UserCoords | null> => {
    setStatus('loading');
    try {
      const { status: permissionStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (!mountedRef.current) return null;

      if (permissionStatus !== 'granted') {
        setStatus('denied');
        return null;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy });
      if (!mountedRef.current) return null;

      const next = { lat: loc.coords.latitude, lng: loc.coords.longitude };
      setCoords(next);
      setStatus('granted');
      return next;
    } catch {
      if (mountedRef.current) setStatus('error');
      return null;
    }
  }, [accuracy]);

  useEffect(() => {
    if (!autoRequest) return;
    void requestLocation();
  }, [autoRequest, requestLocation]);

  return { coords, status, requestLocation };
}
