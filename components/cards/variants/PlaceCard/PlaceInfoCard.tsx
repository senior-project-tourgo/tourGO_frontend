import { AppText } from '@/components/AppText';
import { View } from 'react-native';
import { PromotionCard } from '../PromotionCard';
import { getPlaceOpeningStatus } from '@/utils/openingHours';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { mockVibes } from '@/mock/vibes.mock';
import { Badge } from '@/components/Badge';

type PlaceInfoProps = {
  place: any;
  promotions: any[];
};

export function PlaceInfo({ place, promotions }: PlaceInfoProps) {
  const openingHours = getPlaceOpeningStatus(place.openingHours);

  return (
    <View className="bg-colors-surface-background px-6 pb-20 pt-6">
      <AppText variant="title">{place.placeName}</AppText>

      <View className="flex-1 gap-1">
        <AppText variant="subtitle">{place.placeName}</AppText>
        <AppText variant="muted">
          <Ionicons name="star" color={colors.brand.primary} />{' '}
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

        <View className="flex-row flex-wrap gap-2">
          {(Array.isArray(place.vibe) ? place.vibe : []).map(
            (id: string | number, index: number) => {
              const vibeObj = mockVibes.find(v => v.id === id);
              if (!vibeObj) return null;
              return (
                <View key={id}>
                  <Badge label={vibeObj.title} />
                </View>
              );
            }
          )}
        </View>
      </View>

      {/* Promotions */}
      {promotions.length > 0 && (
        <>
          <AppText className="mt-8 text-lg font-semibold">
            Available Promotions
          </AppText>
          {promotions.map((promo: any) => (
            <PromotionCard key={promo.promotionId} promotion={promo} />
          ))}
        </>
      )}

      {promotions.length === 0 && (
        <AppText className="text-muted-foreground mt-6 text-sm">
          No promotions available right now.
        </AppText>
      )}
    </View>
  );
}
