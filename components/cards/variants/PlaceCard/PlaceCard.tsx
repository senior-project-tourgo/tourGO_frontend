import { AppText } from '@/components/AppText';
import type { Place } from '@/features/place/place.types';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { BaseCardProps } from '../../BaseCard';
import { ImageWithFallback } from './ImageWithFallback';
import { getPlaceOpeningStatus } from '@/utils/openingHours';
import { Badge } from '@/components/Badge';

interface PlaceCardProps extends BaseCardProps {
  place: Place;
  onPress?: (place: Place) => void;
  showCross?: boolean;
  onPressCross?: (place: Place) => void;
}

export function PlaceCard({
  place,
  onPress,
  showCross = false,
  onPressCross
}: PlaceCardProps) {
  const openingHours = getPlaceOpeningStatus(place.openingHours);

  return (
    <Pressable onPress={() => onPress?.(place)}>
      <View className="h-50 w-100 relative flex-row gap-4 rounded-2xl bg-white p-4 shadow-sm">
        <ImageWithFallback
          primaryImageUrl={place.image}
          className="h-40 w-32 rounded-xl"
          resizeMode="cover"
        />

        <View className="gap-1">
          <AppText variant="subtitle">{place.placeName}</AppText>
          <AppText variant="muted">
            <Ionicons name="star" color={colors.brand.primary} /> {''}
            {place.averageRating}
          </AppText>

          <AppText variant="muted">
            {place.location.area} · {place.priceRange}
          </AppText>

          <AppText>
            <AppText
              variant="muted"
              className={
                openingHours.isOpenNow ? 'text-green-500' : 'text-red-500'
              }
            >
              {openingHours.isOpenNow ? 'Open' : 'Closed'}
            </AppText>

            <AppText variant="muted">
              {' · '}
              {openingHours.nextTime
                ? openingHours.nextTime.type === 'close'
                  ? `Closes at ${openingHours.nextTime.time.toLocaleTimeString(
                      [],
                      {
                        hour: '2-digit',
                        minute: '2-digit'
                      }
                    )}`
                  : `Opens at ${openingHours.nextTime.time.toLocaleTimeString(
                      [],
                      {
                        hour: '2-digit',
                        minute: '2-digit'
                      }
                    )}`
                : 'Hours unavailable'}
            </AppText>
          </AppText>

          <View className="flex-row gap-2">
            {place.vibe.map(vibe => (
              <View key={vibe}>
                <Badge label={vibe} />
              </View>
            ))}
          </View>
        </View>

        {/* Remove Button */}
        {showCross && (
          <Pressable
            onPress={() => {
              onPressCross?.(place);
            }}
            className="absolute right-3 top-3 z-10 bg-white p-1"
          >
            <Ionicons name="close" size={18} color={colors.text.DEFAULT[600]} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}
