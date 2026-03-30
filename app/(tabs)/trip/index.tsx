import { ActivityIndicator, Alert, View } from 'react-native';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Screen } from '@/components/Screen';
import { HeaderWithBack } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { TripSection } from '@/components/TripSection';
import { ConfirmActionModal } from '@/components/ConfirmActionModal';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';

import {
  fetchAllUserTrips,
  startTrip,
  deleteTrip
} from '@/services/trip.service';
import type { Trip } from '@/features/trip/trip.types';
import { getPlacesByIds } from '@/features/place/placeById.api';

function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [placeImages, setPlaceImages] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      const data = await fetchAllUserTrips();
      setTrips(data);

      const allIds = [
        ...new Set(data.flatMap(t => t.places.map(p => p.placeId)))
      ];
      if (allIds.length > 0) {
        const places = await getPlacesByIds(allIds);
        const imageMap: Record<string, string> = {};
        places.forEach(p => {
          imageMap[p.placeId] = p.image;
        });
        setPlaceImages(imageMap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleStart = async (trip: Trip) => {
    setStartingId(trip._id);
    try {
      await startTrip(trip._id);
      router.push({ pathname: '/during-trip', params: { tripId: trip._id } });
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to start trip');
    } finally {
      setStartingId(null);
    }
  };

  const handleDelete = async () => {
    if (!tripToDelete) return;
    const target = tripToDelete;
    setDeleting(true);
    setTripToDelete(null);
    try {
      await deleteTrip(target._id);
      setTrips(prev => prev.filter(t => t._id !== target._id));
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to delete trip');
    } finally {
      setDeleting(false);
    }
  };

  return {
    trips,
    loading,
    refreshing,
    startingId,
    tripToDelete,
    deleting,
    placeImages,
    load,
    handleStart,
    handleDelete,
    setRefreshing,
    setTripToDelete
  };
}

export default function TripScreen() {
  const {
    trips,
    loading,
    startingId,
    tripToDelete,
    deleting,
    placeImages,
    handleStart,
    handleDelete,
    setTripToDelete
  } = useTrips();

  const cardProps = (t: Trip) => ({
    onStart: () => handleStart(t),
    onResume: () =>
      router.push({ pathname: '/during-trip', params: { tripId: t._id } }),
    onEdit: () =>
      router.push({
        pathname: '/edit-trip/[tripId]',
        params: { tripId: t._id }
      }),
    onDelete: () => setTripToDelete(t),
    starting: startingId === t._id,
    placeImages
  });

  const current = useMemo(
    () => trips.filter(t => t.status === 'current'),
    [trips]
  );
  const saved = useMemo(() => trips.filter(t => t.status === 'saved'), [trips]);
  const completed = useMemo(
    () => trips.filter(t => t.status === 'completed'),
    [trips]
  );

  if (loading) {
    return (
      <Screen scroll={false}>
        <ActivityIndicator
          size="large"
          color={colors.brand.primary}
          className="mt-10"
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <HeaderWithBack title="My Trips" showBack={false} />

      <Button
        title="Plan New Trip"
        onPress={() => router.push('/(tabs)/trip-generator')}
        className="mb-6"
      />

      {trips.length === 0 && (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Ionicons
            name="map-outline"
            size={48}
            color={colors.brand.neutrals}
          />
          <AppText variant="subtitle" className="mt-4 text-center">
            No trips yet
          </AppText>
          <AppText variant="muted" className="text-center">
            Plan your first trip using the button above
          </AppText>
        </View>
      )}

      <TripSection title="Active Trip" trips={current} cardProps={cardProps} />
      <TripSection title="Saved Plans" trips={saved} cardProps={cardProps} />
      <TripSection title="Completed" trips={completed} cardProps={cardProps} />

      <ConfirmActionModal
        visible={!!tripToDelete}
        icon="trash-outline"
        iconContainerClassName="bg-red-200"
        title="Delete Trip?"
        message={
          <>
            &quot;{tripToDelete?.itineraryName}&quot; will be permanently
            deleted. This cannot be undone.
          </>
        }
        confirmLabel="Delete"
        onCancel={() => setTripToDelete(null)}
        onConfirm={handleDelete}
        pending={deleting}
      />
    </Screen>
  );
}
