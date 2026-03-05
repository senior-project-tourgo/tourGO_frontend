import { AppText } from '@/components/AppText';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { useActivePlaces } from '@/hooks/review-trip/useActivePlaces';
import { promotionsMock } from '@/mock/promotions.mock';
import { getPlaceOpeningStatus } from '@/utils/openingHours';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable } from 'react-native';

export default function PlaceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const placeId = typeof id === 'string' ? id : undefined;
  const { data: places, loading, error } = useActivePlaces(undefined);

  if (loading) {
    return (
      <Screen scroll={false}>
        <ActivityIndicator size="large" />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen scroll={false}>
        <AppText className="text-lg font-semibold">
          Something went wrong
        </AppText>
        <AppText className="text-muted-foreground mt-2 text-center text-sm">
          {error?.message}
        </AppText>
      </Screen>
    );
  }

  const place = places.find(p => p.placeId === placeId);

  if (!place) {
    return (
      <Screen scroll={false}>
        <AppText className="text-lg font-semibold">Page not found.</AppText>
        <AppText className="text-muted-foreground mt-2 text-center text-sm">
          The place may have been removed or is temporarily unavailable.
        </AppText>
      </Screen>
    );
  }

  const openingStatus = getPlaceOpeningStatus(place.openingHours);
  const todayOpeningLabel = openingStatus.nextTime
    ? openingStatus.nextTime.type === 'close'
      ? `Closes at ${openingStatus.nextTime.time.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}`
      : `Opens at ${openingStatus.nextTime.time.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}`
    : 'Closed';

  const placePromotions = promotionsMock.filter(
    promo => promo.placeId === place.placeId
  );

  return (
    <Screen>
      <Stack.Screen options={{ title: place.placeName }} />

      <HeaderWithBack title={place.placeName} />

      <AppText className="text-muted-foreground mt-2 text-sm">
        {place.location.area}
      </AppText>

      <AppText className="mt-2 text-sm">
        {openingStatus.isOpenNow ? 'Open now' : 'Closed now'} ·{' '}
        {todayOpeningLabel}
      </AppText>

      <AppText className="mt-2 text-sm">
        💸 Price range: {place.priceRange}
      </AppText>

      <AppText className="mt-2 text-sm">
        🎧 Vibe: {place.vibe?.length ? place.vibe.join(', ') : '—'}
      </AppText>

      {/* Promotions */}
      {placePromotions.length > 0 && (
        <>
          <AppText className="mt-8 text-lg font-semibold">
            Available Promotions
          </AppText>

          {placePromotions.map(promo => (
            <Link
              key={promo.promotionId}
              href={`/promotions/${promo.promotionId}`}
              asChild
            >
              <Pressable className="mt-3 rounded-xl border p-4">
                <AppText className="font-semibold">
                  {promo.promotionName}
                </AppText>
                <AppText className="text-muted-foreground mt-1 text-sm">
                  {promo.promotionDescription}
                </AppText>
                <AppText className="text-muted-foreground mt-2 text-xs">
                  Expires: {promo.expirationDate}
                </AppText>
              </Pressable>
            </Link>
          ))}
        </>
      )}

      {placePromotions.length === 0 && (
        <AppText className="text-muted-foreground mt-6 text-sm">
          No promotions available right now.
        </AppText>
      )}
    </Screen>
  );
}
