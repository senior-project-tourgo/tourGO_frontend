import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { HeaderWithBack } from '@/components/PageHeader';
import type { Trip } from '@/features/trip/trip.types';
import {
  fetchAllUserTrips,
  startTrip,
  deleteTrip
} from '@/services/trip.service';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  View
} from 'react-native';
import colors from '@/theme/colors';

const STATUS_LABEL: Record<Trip['status'], string> = {
  current: 'Active',
  saved: 'Saved',
  completed: 'Completed'
};

const STATUS_COLOR: Record<Trip['status'], string> = {
  current: '#22c55e',
  saved: colors.brand.primary,
  completed: '#94a3b8'
};

// ─── Delete confirmation modal ───────────────────────────────────────────────

function DeleteConfirmModal({
  trip,
  onCancel,
  onConfirm
}: {
  trip: Trip | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      visible={!!trip}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24
        }}
        onPress={onCancel}
      >
        <Pressable
          style={{
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 24,
            gap: 12
          }}
          onPress={() => {}}
        >
          <View style={{ alignItems: 'center', paddingBottom: 4 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#fee2e2',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Ionicons name="trash-outline" size={26} color="#ef4444" />
            </View>
          </View>

          <AppText variant="subtitle" className="text-center font-semibold">
            Delete Trip?
          </AppText>
          <AppText variant="muted" className="text-center">
            &quot;{trip?.itineraryName}&quot; will be permanently deleted. This
            cannot be undone.
          </AppText>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            <Pressable
              onPress={onCancel}
              style={{
                flex: 1,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: '#e2e8f0',
                paddingVertical: 12,
                alignItems: 'center'
              }}
            >
              <AppText className="font-semibold">Cancel</AppText>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={{
                flex: 1,
                borderRadius: 12,
                backgroundColor: '#ef4444',
                paddingVertical: 12,
                alignItems: 'center'
              }}
            >
              <AppText style={{ color: '#fff' }} className="font-semibold">
                Delete
              </AppText>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Trip card ────────────────────────────────────────────────────────────────

function TripCard({
  trip,
  onStart,
  onResume,
  onEdit,
  onDelete,
  starting
}: {
  trip: Trip;
  onStart: () => void;
  onResume: () => void;
  onEdit: () => void;
  onDelete: () => void;
  starting: boolean;
}) {
  const visitedCount = trip.places.filter(p => p.visitedAt).length;
  const totalCount = trip.places.length;
  const date = trip.completedAt ?? trip.startedAt ?? trip.createdAt;
  const dateLabel = new Date(date).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <View className="gap-3 rounded-2xl bg-colors-surface-background p-4 shadow-sm">
      {/* Header row */}
      <View className="flex-row items-start justify-between gap-2">
        <AppText variant="subtitle" className="flex-1">
          {trip.itineraryName}
        </AppText>

        <View className="flex-row items-center gap-2">
          <View
            style={{ backgroundColor: STATUS_COLOR[trip.status] + '22' }}
            className="rounded-full px-2 py-1"
          >
            <AppText
              variant="caption"
              style={{ color: STATUS_COLOR[trip.status] }}
              className="font-semibold"
            >
              {STATUS_LABEL[trip.status]}
            </AppText>
          </View>

          <Pressable
            onPress={onEdit}
            hitSlop={8}
            style={{
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
              backgroundColor: colors.brand.primary + '18'
            }}
          >
            <Ionicons
              name="pencil-outline"
              size={15}
              color={colors.brand.primary}
            />
          </Pressable>

          <Pressable
            onPress={onDelete}
            hitSlop={8}
            style={{
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
              backgroundColor: '#fee2e2'
            }}
          >
            <Ionicons name="trash-outline" size={15} color="#ef4444" />
          </Pressable>
        </View>
      </View>

      {/* Meta row */}
      <View className="flex-row flex-wrap gap-4">
        <View className="flex-row items-center gap-1">
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.text.DEFAULT}
          />
          <AppText variant="muted">
            {totalCount} place{totalCount !== 1 ? 's' : ''}
          </AppText>
        </View>

        {trip.status === 'completed' && (
          <View className="flex-row items-center gap-1">
            <Ionicons
              name="checkmark-circle-outline"
              size={14}
              color="#22c55e"
            />
            <AppText variant="muted">
              {visitedCount}/{totalCount} visited
            </AppText>
          </View>
        )}

        {trip.xpEarned > 0 && (
          <View className="flex-row items-center gap-1">
            <Ionicons
              name="star-outline"
              size={14}
              color={colors.brand.primary}
            />
            <AppText variant="muted" style={{ color: colors.brand.primary }}>
              +{trip.xpEarned} XP
            </AppText>
          </View>
        )}

        <View className="flex-row items-center gap-1">
          <Ionicons
            name="calendar-outline"
            size={14}
            color={colors.text.DEFAULT}
          />
          <AppText variant="muted">{dateLabel}</AppText>
        </View>
      </View>

      {/* Action button */}
      {trip.status === 'current' && (
        <Button
          title={starting ? 'Loading…' : 'Resume Trip'}
          onPress={onResume}
          disabled={starting}
        />
      )}
      {trip.status === 'saved' && (
        <Button
          title={starting ? 'Starting…' : 'Start Trip'}
          onPress={onStart}
          isLoading={starting}
        />
      )}
    </View>
  );
}

// ─── Collapsible section ──────────────────────────────────────────────────────

function TripSection({
  title,
  trips,
  collapsedLimit,
  cardProps
}: {
  title: string;
  trips: Trip[];
  /** How many cards to show before showing the "Show more" toggle */
  collapsedLimit: number;
  cardProps: (t: Trip) => Omit<React.ComponentProps<typeof TripCard>, 'trip'>;
}) {
  const [expanded, setExpanded] = useState(false);

  if (trips.length === 0) return null;

  const hasMore = trips.length > collapsedLimit;
  const visible = expanded ? trips : trips.slice(0, collapsedLimit);
  const hiddenCount = trips.length - collapsedLimit;

  return (
    <View className="mb-6 gap-3">
      {/* Section header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <AppText variant="subtitle" className="flex-1 font-semibold">
          {title}
        </AppText>
        {/* Count badge */}
        <View
          style={{
            backgroundColor: colors.brand.primary + '18',
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 2
          }}
        >
          <AppText
            variant="caption"
            style={{ color: colors.brand.primary, fontWeight: '600' }}
          >
            {trips.length}
          </AppText>
        </View>
      </View>

      {/* Cards */}
      {visible.map(t => (
        <TripCard key={t._id} trip={t} {...cardProps(t)} />
      ))}

      {/* Show more / less toggle */}
      {hasMore && (
        <Pressable
          onPress={() => setExpanded(prev => !prev)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#e2e8f0',
            backgroundColor: '#f8fafc'
          }}
        >
          <AppText variant="muted" style={{ fontWeight: '500' }}>
            {expanded ? 'Show less' : `Show ${hiddenCount} more`}
          </AppText>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color="#94a3b8"
          />
        </Pressable>
      )}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function TripScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [_deleting, setDeleting] = useState(false);

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

  const handleResume = (trip: Trip) => {
    router.push({ pathname: '/during-trip', params: { tripId: trip._id } });
  };

  const handleEdit = (trip: Trip) => {
    router.push({
      pathname: '/edit-trip/[tripId]',
      params: { tripId: trip._id }
    });
  };

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

  // Shared card props factory
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

        {/* Active — always show 1, expand if somehow more exist */}
        <TripSection
          title="Active Trip"
          trips={current}
          collapsedLimit={1}
          cardProps={cardProps}
        />

        {/* Saved — show 1 by default */}
        <TripSection
          title="Saved Trips"
          trips={saved}
          collapsedLimit={1}
          cardProps={cardProps}
        />

        {/* Completed — show 2 by default (historical, less urgent) */}
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
      />
    </>
  );
}
