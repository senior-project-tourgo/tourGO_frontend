import { Pressable, View } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { promotionsMock } from '@/mock/promotions.mock';
import { placesMock } from '@/mock/places.mock';
import { AppText } from '@/components/AppText';
import { getPlaceOpeningStatus } from '@/utils/openingHours';
import { Screen } from '@/components/Screen';
import { HeaderWithBack } from '@/components/PageHeader';

export default function PlaceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const place = placesMock.find(p => p.placeId === id);
  if (!place) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <AppText className="text-lg font-semibold">Place not found 😢</AppText>
      </View>
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
        {place.location.area}, {place.location.city}
      </AppText>

      <AppText className="mt-2 text-sm">
        {openingStatus.isOpenNow ? 'Open now' : 'Closed now'} ·{' '}
        {todayOpeningLabel}
      </AppText>

      <AppText className="mt-2 text-sm">
        💸 Price range: {place.priceRange}
      </AppText>

      <AppText className="mt-2 text-sm">
        🎧 Vibe: {place.vibe.join(', ')}
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
