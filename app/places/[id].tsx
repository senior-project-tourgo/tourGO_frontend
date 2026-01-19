import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { promotionsMock } from '@/mock/promotions.mock';
import { placesMock } from '@/mock/places.mock';

export default function PlaceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const place = placesMock.find(p => p.placeId === id);
  if (!place) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-lg font-semibold">Place not found 😢</Text>
      </View>
    );
  }

  const placePromotions = promotionsMock.filter(
    promo => promo.placeId === place.placeId
  );

  return (
    <View className="flex-1 bg-background px-6 pt-10">
      <Stack.Screen options={{ title: place.placeName }} />

      {/* Place info */}
      <Text className="text-2xl font-bold">{place.placeName}</Text>

      <Text className="text-muted-foreground mt-2 text-sm">
        {place.location.area}, {place.location.city}
      </Text>

      <Text className="mt-2 text-sm">⏰ {place.openingHours}</Text>

      <Text className="mt-2 text-sm">💸 Price range: {place.priceRange}</Text>

      <Text className="mt-2 text-sm">🎧 Vibe: {place.vibe.join(', ')}</Text>

      {/* Promotions */}
      {placePromotions.length > 0 && (
        <>
          <Text className="mt-8 text-lg font-semibold">
            Available Promotions
          </Text>

          {placePromotions.map(promo => (
            <Link
              key={promo.promotionId}
              href={`/promotions/${promo.promotionId}`}
              asChild
            >
              <Pressable className="mt-3 rounded-xl border p-4">
                <Text className="font-semibold">{promo.promotionName}</Text>
                <Text className="text-muted-foreground mt-1 text-sm">
                  {promo.promotionDescription}
                </Text>
                <Text className="text-muted-foreground mt-2 text-xs">
                  Expires: {promo.expirationDate}
                </Text>
              </Pressable>
            </Link>
          ))}
        </>
      )}

      {placePromotions.length === 0 && (
        <Text className="text-muted-foreground mt-6 text-sm">
          No promotions available right now.
        </Text>
      )}
    </View>
  );
}
