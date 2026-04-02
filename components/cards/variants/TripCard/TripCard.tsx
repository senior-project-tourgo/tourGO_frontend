import { View, Pressable } from 'react-native';
import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import colors from '@/theme/colors';
import type { Trip } from '@/features/trip/trip.types';
import { STATUS_LABEL, STATUS_COLOR } from '@/constants/tripStatus';
import { PlacePhotoCarousel } from './PlacePhotoCarousel';
import { CARD_WIDTH } from '@/constants/place-card/carousel';
import { Badge } from '@/components/Badge';

export function TripCard({
  trip,
  onStart,
  onResume,
  onEdit,
  onDelete,
  starting,
  placeImages = {}
}: {
  trip: Trip;
  onStart: () => void;
  onResume: () => void;
  onEdit: () => void;
  onDelete: () => void;
  starting: boolean;
  placeImages?: Record<string, string>;
}) {
  const visitedCount = trip.places.filter(p => p.visitedAt).length;
  const totalCount = trip.places.length;

  const date = trip.completedAt ?? trip.startedAt ?? trip.createdAt;
  const dateLabel = new Date(date).toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });

  const placeIds = useMemo(
    () =>
      trip.places
        .slice()
        .sort((a, b) => a.order - b.order)
        .map(p => p.placeId),
    [trip.places]
  );

  return (
    <View
      style={{ width: CARD_WIDTH }}
      className="rounded-2xl bg-colors-surface-background shadow-sm"
    >
      {/* Image section */}
      <View className="relative overflow-hidden rounded-t-2xl">
        <PlacePhotoCarousel placeIds={placeIds} placeImages={placeImages} />

        {/* Actions */}
        <View className="absolute right-2 top-2 flex-row gap-1.5">
          <Pressable
            onPress={onEdit}
            hitSlop={8}
            className="h-7 w-7 items-center justify-center rounded-full bg-colors-surface-background/85"
          >
            <Ionicons
              name="pencil-outline"
              size={13}
              color={colors.brand.primary}
            />
          </Pressable>

          <Pressable
            onPress={onDelete}
            hitSlop={8}
            className="h-7 w-7 items-center justify-center rounded-full bg-colors-surface-background/85"
          >
            <Ionicons
              name="trash-outline"
              size={13}
              color={colors.status.error}
            />
          </Pressable>
        </View>

        {/* Status */}
        <View className="absolute bottom-7 left-2">
          <Badge
            label={STATUS_LABEL[trip.status]}
            bgColor={STATUS_COLOR[trip.status] + 'dd'}
            textColor={colors.text.inverse}
          />
        </View>
      </View>

      {/* Content */}
      <View className="gap-1.5 p-2.5">
        {/* Title */}
        <AppText variant="subtitle" className="font-bold" numberOfLines={2}>
          {trip.itineraryName}
        </AppText>

        {/* Meta info */}
        <View className="flex-row flex-wrap gap-2">
          {/* Places */}
          <View className="flex-row items-center gap-1">
            <Ionicons name="location-outline" size={11} color="#94a3b8" />
            <AppText variant="caption" className="text-slate-400">
              {totalCount} place{totalCount !== 1 ? 's' : ''}
            </AppText>
          </View>

          {/* Completed */}
          {trip.status === 'completed' && (
            <View className="flex-row items-center gap-1">
              <Ionicons
                name="checkmark-circle-outline"
                size={11}
                color="#22c55e"
              />
              <AppText variant="caption" className="text-slate-400">
                {visitedCount}/{totalCount}
              </AppText>
            </View>
          )}

          {/* XP */}
          {trip.xpEarned > 0 && (
            <View className="flex-row items-center gap-1">
              <Ionicons
                name="star-outline"
                size={11}
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

          {/* Date */}
          <View className="flex-row items-center gap-1">
            <Ionicons name="calendar-outline" size={11} color="#94a3b8" />
            <AppText variant="caption" className="text-slate-400">
              {dateLabel}
            </AppText>
          </View>
        </View>

        {/* Actions */}
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
    </View>
  );
}
