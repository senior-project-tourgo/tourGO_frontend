import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import colors from '@/theme/colors';
import type { Trip } from '@/features/trip/trip.types';
import { STATUS_LABEL, STATUS_COLOR } from '@/constants/trip';

export function TripCard({
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
