import { AppText } from '@/components/AppText';
import { View } from 'react-native';
import { PromotionCard } from '../PromotionCard';
import { getPlaceOpeningStatus } from '@/utils/openingHours';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { mockVibes } from '@/mock/vibes.mock';
import { Badge } from '@/components/Badge';
import { Place } from '@/features/place/place.types';
import type { ApiPromotion } from '@/services/promotion.service';

type PlaceInfoProps = {
  place: Place;
  promotions: ApiPromotion[];
};

export function PlaceInfoCard({ place, promotions }: PlaceInfoProps) {
  const openingHours = getPlaceOpeningStatus(place.openingHours);

  return (
    <View className="bg-colors-surface-background px-6 pb-20 pt-6">
      <AppText variant="title">{place.placeName}</AppText>

      <View className="flex-1 gap-1">
        <AppText variant="subtitle">
          <Ionicons name="star" color={colors.brand.primary} />{' '}
          {place.averageRating}
        </AppText>

        <AppText variant="subtitle">
          {place.location.area} · {place.priceRange}
        </AppText>

        <AppText>
          <AppText
            variant="subtitle"
            style={{
              color: openingHours.isOpenNow
                ? colors.status.success
                : colors.status.error
            }}
          >
            {openingHours.isOpenNow ? 'Open' : 'Closed'}
          </AppText>

          <AppText variant="subtitle">
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
            (id: string | number) => {
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
      {promotions.length > 0 ? (
        <>
          <AppText className="mt-8 text-lg font-semibold">
            Available Promotions
          </AppText>
          <View className="gap-4">
            {promotions.map(promo => (
              <PromotionCard key={promo.promotionId} promo={promo} />
            ))}
          </View>
        </>
      ) : (
        <AppText className="text-muted-foreground mt-6 text-sm">
          No promotions available right now.
        </AppText>
      )}
    </View>
  );
}
