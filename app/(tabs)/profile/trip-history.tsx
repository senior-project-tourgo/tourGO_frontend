import { AppText } from '@/components/AppText';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import type { Trip } from '@/features/trip/trip.types';
import { fetchAllUserTrips, startTrip } from '@/services/trip.service';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';

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

export default function TripHistoryScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllUserTrips()
      .then(setTrips)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <Screen>
      <HeaderWithBack title="Trip History" />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.brand.primary}
          className="mt-6"
        />
      ) : trips.length === 0 ? (
        <View className="items-center gap-2 pt-10">
          <Ionicons
            name="map-outline"
            size={48}
            color={colors.brand.neutrals}
          />
          <AppText variant="subtitle" className="text-center">
            No trips yet
          </AppText>
        </View>
      ) : (
        <View className="gap-3">
          {trips.map(trip => {
            const visitedCount = trip.places.filter(p => p.visitedAt).length;
            const totalCount = trip.places.length;
            const date = trip.completedAt ?? trip.startedAt ?? trip.createdAt;
            const dateLabel = new Date(date).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <View
                key={trip._id}
                className="gap-2 rounded-2xl bg-colors-surface-background p-4 shadow-sm"
              >
                <View className="flex-row items-start justify-between gap-2">
                  <AppText variant="subtitle" className="flex-1">
                    {trip.itineraryName}
                  </AppText>
                  <View
                    style={{
                      backgroundColor: STATUS_COLOR[trip.status] + '22'
                    }}
                    className="rounded-full px-2 py-0.5"
                  >
                    <AppText
                      variant="caption"
                      style={{ color: STATUS_COLOR[trip.status] }}
                      className="font-semibold"
                    >
                      {STATUS_LABEL[trip.status]}
                    </AppText>
                  </View>
                </View>

                <View className="flex-row gap-4">
                  <View className="flex-row items-center gap-1">
                    <Ionicons
                      name="location-outline"
                      size={13}
                      color={colors.text.DEFAULT}
                    />
                    <AppText variant="caption">
                      {totalCount} place{totalCount !== 1 ? 's' : ''}
                    </AppText>
                  </View>
                  {trip.status === 'completed' && (
                    <View className="flex-row items-center gap-1">
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={13}
                        color="#22c55e"
                      />
                      <AppText variant="caption">
                        {visitedCount}/{totalCount} visited
                      </AppText>
                    </View>
                  )}
                  {trip.xpEarned > 0 && (
                    <View className="flex-row items-center gap-1">
                      <Ionicons
                        name="star-outline"
                        size={13}
                        color={colors.brand.primary}
                      />
                      <AppText
                        variant="caption"
                        style={{ color: colors.brand.primary }}
                      >
                        +{trip.xpEarned} XP
                      </AppText>
                    </View>
                  )}
                  <View className="flex-row items-center gap-1">
                    <Ionicons
                      name="calendar-outline"
                      size={13}
                      color={colors.text.DEFAULT}
                    />
                    <AppText variant="caption">{dateLabel}</AppText>
                  </View>
                </View>

                {(trip.status === 'current' || trip.status === 'saved') && (
                  <Pressable
                    onPress={() =>
                      trip.status === 'current'
                        ? router.push({
                            pathname: '/during-trip',
                            params: { tripId: trip._id }
                          })
                        : handleStart(trip)
                    }
                    disabled={startingId === trip._id}
                    className="mt-1 items-center rounded-full py-2"
                    style={{ backgroundColor: colors.brand.primary }}
                  >
                    <AppText
                      variant="caption"
                      className="font-semibold text-white"
                    >
                      {startingId === trip._id
                        ? 'Starting…'
                        : trip.status === 'current'
                          ? 'Resume Trip'
                          : 'Start Trip'}
                    </AppText>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      )}
    </Screen>
  );
}
