import { Pressable, View } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { promotionsMock } from '@/mock/promotions.mock';
import { placesMock } from '@/mock/places.mock';
import { AppText } from '@/components/AppText';

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

  const placePromotions = promotionsMock.filter(
    promo => promo.placeId === place.placeId
  );

  return (
    <View className="bg-background flex-1 px-6 pt-10">
      <Stack.Screen options={{ title: place.placeName }} />

      {/* Place info */}
      <AppText className="text-2xl font-bold">{place.placeName}</AppText>

      <AppText className="text-muted-foreground mt-2 text-sm">
        {place.location.area}, {place.location.city}
      </AppText>

      <AppText className="mt-2 text-sm">
        {typeof place.openingHours === 'string'
          ? place.openingHours
          : Array.isArray(place.openingHours)
            ? place.openingHours.join(', ')
            : 'N/A'}
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
    </View>
  );
}
