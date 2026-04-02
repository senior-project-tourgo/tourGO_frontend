import { View, Pressable } from 'react-native';
import { AppText } from '@/components/AppText';
import { router } from 'expo-router';
import type { Trip } from '@/features/trip/trip.types';
import { STATUS_COLOR, STATUS_LABEL } from '@/constants/tripStatus';
import colors from '@/theme/colors';
import { Badge } from '@/components/Badge';
import { TripMeta } from '@/components/TripMeta';
import { Ionicons } from '@expo/vector-icons';

export function TripHistoryCard({
  trip,
  startingId,
  onStart
}: {
  trip: Trip;
  startingId: string | null;
  onStart: (tripId: string) => void;
}) {
  const visitedCount = trip.places.filter(p => p.visitedAt).length;
  const totalCount = trip.places.length;
  const date = trip.completedAt ?? trip.startedAt ?? trip.createdAt;

  const dateLabel = new Date(date).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const tripMeta: {
    name: keyof typeof Ionicons.glyphMap;
    label: string;
    color?: string;
  }[] = [
    {
      name: 'location-outline' as keyof typeof Ionicons.glyphMap,
      label: `${totalCount} place${totalCount !== 1 ? 's' : ''}`
    },
    ...(trip.status === 'completed'
      ? [
          {
            name: 'checkmark-circle-outline' as keyof typeof Ionicons.glyphMap,
            label: `${visitedCount}/${totalCount} visited`,
            color: colors.status.complete
          }
        ]
      : []),
    ...(trip.xpEarned > 0
      ? [
          {
            name: 'star-outline' as keyof typeof Ionicons.glyphMap,
            label: `+${trip.xpEarned} XP`,
            color: colors.brand.primary
          }
        ]
      : []),
    {
      name: 'calendar-outline' as keyof typeof Ionicons.glyphMap,
      label: dateLabel
    }
  ];

  return (
    <View className="relative gap-2 rounded-2xl bg-colors-surface-background p-4 shadow-sm">
      {/* Header */}
      <View className="flex-row items-start justify-between gap-2">
        <AppText variant="subtitle" className="flex-1">
          {trip.itineraryName}
        </AppText>

        <Badge
          label={STATUS_LABEL[trip.status]}
          bgColor={STATUS_COLOR[trip.status] + 'dd'}
          textColor={colors.text.inverse}
        />
      </View>

      {/* Meta */}
      <View className="flex-row gap-4">
        {tripMeta.map(m => (
          <TripMeta icon={m.name} key={m.label} {...m} />
        ))}
      </View>

      {/* CTA */}
      {(trip.status === 'current' || trip.status === 'saved') && (
        <Pressable
          onPress={() =>
            trip.status === 'current'
              ? router.push({
                  pathname: '/during-trip',
                  params: { tripId: trip._id }
                })
              : onStart(trip._id)
          }
          disabled={startingId === trip._id}
          className="mt-1 items-center rounded-full py-2"
          style={{ backgroundColor: colors.brand.primary }}
        >
          <AppText variant="caption" className="font-semibold text-white">
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
}
