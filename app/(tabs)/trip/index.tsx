import { ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Screen } from '@/components/Screen';
import { HeaderWithBack } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { TripSection } from '@/components/TripSection';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';

import {
  fetchAllUserTrips,
  startTrip,
  deleteTrip
} from '@/services/trip.service';
import type { Trip } from '@/features/trip/trip.types';

function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchAllUserTrips();
      setTrips(data);
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
    starting: startingId === t._id
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
        <Screen padded={false}>
          <Ionicons
            name="map-outline"
            size={48}
            color={colors.brand.neutrals}
            className="mt-10"
          />
          <AppText variant="subtitle" className="mt-4 text-center">
            No trips yet
          </AppText>
          <AppText variant="muted" className="text-center">
            Plan your first trip using the button above
          </AppText>
        </Screen>
      )}

      <TripSection
        title="Active Trip"
        trips={current}
        collapsedLimit={1}
        cardProps={cardProps}
      />
      <TripSection
        title="Saved Trips"
        trips={saved}
        collapsedLimit={1}
        cardProps={cardProps}
      />
      <TripSection
        title="Completed"
        trips={completed}
        collapsedLimit={2}
        cardProps={cardProps}
      />

      <DeleteConfirmModal
        trip={tripToDelete}
        onCancel={() => setTripToDelete(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </Screen>
  );
}
