// Pressable card
import { AppText } from '@/components/AppText';
import type { Place } from '@/features/place/place.types';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { BaseCardProps } from '../../BaseCard';
import { ImageWithFallback } from './ImageWithFallback';
import { getPlaceOpeningStatus } from '@/utils/openingHours';

interface PlaceCardProps extends BaseCardProps {
  place: Place;
  onPress?: (place: Place) => void;
}

export function PlaceCard({ place, onPress }: PlaceCardProps) {
  const openingHours = getPlaceOpeningStatus(place.openingHours);

  return (
    <Pressable onPress={() => onPress?.(place)}>
      <View className="h-40 flex-row gap-4 rounded-2xl bg-white p-4 shadow-sm">
        <ImageWithFallback
          primaryImageUrl={place.image}
          className="aspect-square h-full rounded-xl"
          resizeMode="contain"
        />

        <View className="mt-3 gap-1">
          <AppText variant="title">{place.placeName}</AppText>
          <AppText variant="muted">
            <Ionicons name="star" color={colors.brand.primary} />
            {place.averageRating}
          </AppText>

          <AppText variant="muted">
            {place.location.area} · {place.priceRange}
          </AppText>

          <AppText variant="muted">
            <AppText
              variant="muted"
              className={
                openingHours.isOpenNow ? 'text-green-500' : 'text-red-500'
              }
            >
              {openingHours.isOpenNow ? 'Open' : 'Closed'}
            </AppText>
            {' · '}
            {openingHours.todayHours
              .map(hour => hour.open + ' - ' + hour.close)
              .join(' - ')}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}
