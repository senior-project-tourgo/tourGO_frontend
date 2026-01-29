// Pressable card
import type { Place } from '@/features/place/place.types';
import { View, Image, Pressable } from 'react-native';
import { AppText } from '@/components/AppText';
import { BaseCardProps } from '../BaseCard';

interface PlaceCardProps extends BaseCardProps {
  place: Place;
  onPress?: (place: Place) => void;
}

export function PlaceCard({ place, onPress }: PlaceCardProps) {
  return (
    <Pressable onPress={() => onPress?.(place)}>
      <View className="rounded-2xl bg-white p-4 shadow-sm">
        <Image
          source={{ uri: place.image }}
          className="h-40 w-full rounded-xl"
        />

        <View className="mt-3 gap-1">
          <AppText variant="title">{place.placeName}</AppText>

          <AppText variant="muted">
            {place.location.area} · {place.priceRange}
          </AppText>

          <AppText variant="muted">{place.openingHours}</AppText>
        </View>
      </View>
    </Pressable>
  );
}
