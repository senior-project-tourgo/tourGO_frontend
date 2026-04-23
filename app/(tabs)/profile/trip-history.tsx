import { View, ActivityIndicator } from 'react-native';
import { Screen } from '@/components/Screen';
import { HeaderWithBack } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/theme/colors';
import { useMemo } from 'react';
import { TripHistoryCard } from '@/components/cards/variants/TripHistoryCard';
import { groupTrips } from '@/features/trip/groupTrips';
import { useTripHistory } from '@/hooks/trip/useTripHistory';

export default function TripHistoryScreen() {
  const { trips, loading, startingId, handleStart } = useTripHistory();

  // group trips (memoized)
  const { current, saved, completed } = useMemo(
    () => groupTrips(trips),
    [trips]
  );

  const orderedTrips = useMemo(() => {
    return [...completed].sort(
      (a, b) =>
        new Date(b.completedAt ?? b.startedAt ?? b.createdAt).getTime() -
        new Date(a.completedAt ?? a.startedAt ?? a.createdAt).getTime()
    );
  }, [completed]);

  return (
    <Screen>
      <HeaderWithBack title="Trip History" />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.brand.primary}
          className="mt-6"
        />
      ) : orderedTrips.length === 0 ? (
        <EmptyState
          message="No completed trips yet"
          icon={
            <Ionicons
              name="map-outline"
              size={48}
              color={colors.brand.neutrals}
            />
          }
        />
      ) : (
        <View className="gap-3">
          {orderedTrips.map(trip => (
            <TripHistoryCard
              key={trip._id}
              trip={trip}
              startingId={startingId}
              onStart={handleStart}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
