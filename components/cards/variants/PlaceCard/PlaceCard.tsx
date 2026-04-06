import { AppText } from '@/components/AppText';
import type { Place } from '@/features/place/place.types';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { BaseCardProps } from '../../BaseCard';
import { ImageWithFallback } from './ImageWithFallback';
import { getPlaceOpeningStatus } from '@/utils/openingHours';
import { Badge } from '@/components/Badge';
import { VIBES } from '@/constants/vibes';

function formatVibeLabel(id: string) {
  return id
    .replace(/[_-]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

interface PlaceCardProps extends BaseCardProps {
  place: Place;
  onPress?: (place: Place) => void;
  showCross?: boolean;
  onPressCross?: (place: Place) => void;
  isSaved?: boolean;
  onToggleSave?: (place: Place) => void;
}

export function PlaceCard({
  place,
  onPress,
  showCross = false,
  onPressCross,
  isSaved = false,
  onToggleSave
}: PlaceCardProps) {
  const openingHours = getPlaceOpeningStatus(place.openingHours);

  return (
    <Pressable onPress={() => onPress?.(place)} className="w-[345px]">
      <View className="relative h-60 flex-row gap-4 rounded-2xl bg-colors-surface-background p-4 shadow-sm">
        <ImageWithFallback
          primaryImageUrl={place.image}
          className="h-52 w-32 rounded-xl"
          resizeMode="cover"
        />

        <View className="flex-1 gap-1">
          {/* Name + bookmark */}
          <View className="flex-row items-start justify-between">
            <AppText
              variant="subtitle"
              className="flex-1 pr-1"
              numberOfLines={2}
            >
              {place.placeName}
            </AppText>
            {onToggleSave && (
              <Pressable hitSlop={8} onPress={() => onToggleSave(place)}>
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={18}
                  color={isSaved ? colors.brand.primary : '#94a3b8'}
                />
              </Pressable>
            )}
          </View>

          <AppText variant="muted">
            <Ionicons name="star" color={colors.brand.primary} size={12} />{' '}
            {place.averageRating}
          </AppText>

          <AppText variant="muted">
            {place.location.area} · {place.priceRange}
          </AppText>

          <AppText>
            <AppText
              variant="muted"
              style={{
                color: openingHours.isOpenNow
                  ? colors.status.success
                  : colors.status.error
              }}
            >
              {openingHours.isOpenNow ? 'Open' : 'Closed'}
            </AppText>
            <AppText variant="muted">
              {' · '}
              {openingHours.nextTime
                ? openingHours.nextTime.type === 'close'
                  ? `Closes at ${openingHours.nextTime.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : `Opens at ${openingHours.nextTime.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'Hours unavailable'}
            </AppText>
          </AppText>

          <View className="flex-row flex-wrap gap-2">
            {(place.vibe ?? [])
              .map(id => {
                const vibe = VIBES.find(v => v.id === id);
                return {
                  id,
                  title: vibe?.title ?? formatVibeLabel(id)
                };
              })
              .map(vibe => (
                <View key={vibe.id}>
                  <Badge label={vibe.title} />
                </View>
              ))}
          </View>
        </View>

        {/* Remove Button */}
        {showCross && (
          <Pressable
            onPress={() => onPressCross?.(place)}
            className="absolute right-3 top-3 z-10 bg-white p-1"
          >
            <Ionicons name="close" size={18} color={colors.text.DEFAULT} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}
