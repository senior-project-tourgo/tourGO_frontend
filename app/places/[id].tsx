import { AppText } from '@/components/AppText';
import { ImageWithFallback } from '@/components/cards/variants/PlaceCard/ImageWithFallback';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { useActivePlaces } from '@/hooks/review-trip/useActivePlaces';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { PlaceInfoCard } from '@/components/cards/variants/PlaceCard/PlaceInfoCard';
import { useEffect, useState } from 'react';
import {
  getPromotionsByPlace,
  ApiPromotion
} from '@/services/promotion.service';

export default function PlaceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const placeId = typeof id === 'string' ? id : undefined;
  const { data: places, loading, error } = useActivePlaces(undefined);

  const [promotions, setPromotions] = useState<ApiPromotion[]>([]);
  const [promoLoading, setPromoLoading] = useState(true);
  const [promoError, setPromoError] = useState<string | null>(null);

  useEffect(() => {
    if (!placeId) return;

    setPromoLoading(true);
    getPromotionsByPlace(placeId)
      .then(setPromotions)
      .catch(err => setPromoError(err.message || 'Failed to load promotions'))
      .finally(() => setPromoLoading(false));
  }, [placeId]);

  if (loading || promoLoading) {
    return (
      <Screen scroll={false}>
        <ActivityIndicator size="large" />
      </Screen>
    );
  }

  if (error || promoError) {
    return (
      <Screen scroll={false}>
        <AppText className="text-lg font-semibold">
          Something went wrong
        </AppText>
        <AppText className="text-muted-foreground mt-2 text-center text-sm">
          {error?.message || promoError}
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

  return (
    <Screen scroll padded={false}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Hero Image */}
      <View className="relative">
        <ImageWithFallback
          primaryImageUrl={place.image}
          className="h-[283px] w-full"
          resizeMode="cover"
        />
        {/* Floating Back Button */}
        <View className="absolute left-4 top-12">
          <HeaderWithBack backBg={true} />
        </View>
      </View>

      {/* Content */}
      <PlaceInfoCard place={place} promotions={promotions} />
    </Screen>
  );
}
