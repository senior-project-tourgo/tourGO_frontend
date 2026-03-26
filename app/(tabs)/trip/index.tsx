import {
  ScrollView,
  RefreshControl,
  View,
  ActivityIndicator,
  Alert
} from 'react-native';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import colors from '@/theme/colors';
import { TripSection } from '@/components/TripSection';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import {
  fetchAllUserTrips,
  startTrip,
  deleteTrip
} from '@/services/trip.service';
import { router } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import type { Trip } from '@/features/trip/trip.types';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';

export default function TripScreen() {
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
    try {
      setStartingId(trip._id);
      await startTrip(trip._id);
      router.push({ pathname: '/during-trip', params: { tripId: trip._id } });
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to start trip');
    } finally {
      setStartingId(null);
    }
  };

  const handleResume = (trip: Trip) =>
    router.push({ pathname: '/during-trip', params: { tripId: trip._id } });
  const handleEdit = (trip: Trip) =>
    router.push({
      pathname: '/edit-trip/[tripId]',
      params: { tripId: trip._id }
    });

  const confirmDelete = async () => {
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

  const cardProps = (t: Trip) => ({
    onStart: () => handleStart(t),
    onResume: () => handleResume(t),
    onEdit: () => handleEdit(t),
    onDelete: () => setTripToDelete(t),
    starting: startingId === t._id
  });

  const current = trips.filter(t => t.status === 'current');
  const saved = trips.filter(t => t.status === 'saved');
  const completed = trips.filter(t => t.status === 'completed');

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
    <>
      <ScrollView
        className="bg-colors-surface-background"
        contentContainerStyle={{
          paddingTop: 64,
          paddingHorizontal: 24,
          paddingBottom: 120
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={colors.brand.primary}
          />
        }
      >
        <HeaderWithBack title="My Trips" showBack={false} />
        <Button
          title="Plan New Trip"
          onPress={() => router.push('/(tabs)/trip-generator')}
          className="mb-6"
        />

        {trips.length === 0 && (
          <View className="items-center gap-2 pt-10">
            <Ionicons
              name="map-outline"
              size={48}
              color={colors.brand.neutrals}
            />
            <AppText variant="subtitle" className="text-center">
              No trips yet
            </AppText>
            <AppText variant="muted" className="text-center">
              Plan your first trip using the button above
            </AppText>
          </View>
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
      </ScrollView>

      <DeleteConfirmModal
        trip={tripToDelete}
        onCancel={() => setTripToDelete(null)}
        onConfirm={confirmDelete}
        deleting={deleting}
      />
    </>
  );
}
