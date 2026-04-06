import { AppText } from '@/components/AppText';
import { ImageWithFallback } from '@/components/cards/variants/PlaceCard/ImageWithFallback';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { getPlaceById } from '@/features/place/placeById.api';
import { Place } from '@/features/place/place.types';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { PlaceInfoCard } from '@/components/cards/variants/PlaceCard/PlaceInfoCard';
import { useEffect, useState } from 'react';
import {
  getPromotionsByPlace,
  ApiPromotion
} from '@/services/promotion.service';
import { getUserProfile, toggleSavePlace } from '@/services/user.service';

export default function PlaceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const placeId = typeof id === 'string' ? id : undefined;

  const [place, setPlace] = useState<Place | null>(null);
  const [promotions, setPromotions] = useState<ApiPromotion[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!placeId) return;

    setLoading(true);
    setError(null);

    console.log('[PlaceDetails] fetching placeId:', placeId);

    Promise.all([
      getPlaceById(placeId),
      getPromotionsByPlace(placeId).catch(err => {
        console.warn('[PlaceDetails] promotions failed:', err.message);
        return [] as ApiPromotion[];
      }),
      getUserProfile().catch(err => {
        console.warn('[PlaceDetails] getUserProfile failed:', err.message);
        return null;
      })
    ])
      .then(([placeData, promos, profile]) => {
        console.log(
          '[PlaceDetails] place:',
          JSON.stringify(placeData, null, 2)
        );
        console.log('[PlaceDetails] promotions count:', promos.length);
        console.log('[PlaceDetails] savedPlaces:', profile?.savedPlaces);
        setPlace(placeData);
        setPromotions(promos);
        if (profile) setIsSaved(profile.savedPlaces.includes(placeId));
      })
      .catch(err => {
        console.error('[PlaceDetails] fatal error:', err.message);
        setError(err.message || 'Failed to load place');
      })
      .finally(() => setLoading(false));
  }, [placeId]);

  const handleToggleSave = async () => {
    if (!placeId || saving) return;
    setSaving(true);
    try {
      const result = await toggleSavePlace(placeId);
      setIsSaved(result.saved);
    } catch {
      // silent fail
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen scroll={false}>
        <ActivityIndicator size="large" />
      </Screen>
    );
  }

  if (error || !place) {
    return (
      <Screen scroll={false}>
        <AppText className="text-lg font-semibold">
          {error ? 'Something went wrong' : 'Page not found.'}
        </AppText>
        <AppText className="text-muted-foreground mt-2 text-center text-sm">
          {error ??
            'The place may have been removed or is temporarily unavailable.'}
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
        <View className="absolute left-4 top-12">
          <HeaderWithBack backBg={true} />
        </View>
      </View>

      {/* Content */}
      <PlaceInfoCard
        place={place}
        promotions={promotions}
        isSaved={isSaved}
        saving={saving}
        onToggleSave={handleToggleSave}
      />
    </Screen>
  );
}
