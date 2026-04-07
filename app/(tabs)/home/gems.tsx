import { AppText } from '@/components/AppText';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { useActivePlaces } from '@/hooks/review-trip/useActivePlaces';
import { router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from 'react';
import { getUserProfile, toggleSavePlace } from '@/services/user.service';

export default function CommunityGemsScreen() {
  const { data: activePlaces, loading, error } = useActivePlaces(undefined);

  const [savedPlaces, setSavedPlaces] = useState<string[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    getUserProfile()
      .then(profile => setSavedPlaces(profile.savedPlaces))
      .catch(() => {});
  }, []);

  const handleToggleSave = async (placeId: string) => {
    if (savingId) return;
    setSavingId(placeId);
    setSavedPlaces(prev =>
      prev.includes(placeId)
        ? prev.filter(id => id !== placeId)
        : [...prev, placeId]
    );
    try {
      const result = await toggleSavePlace(placeId);
      setSavedPlaces(result.savedPlaces);
    } catch {
      setSavedPlaces(prev =>
        prev.includes(placeId)
          ? prev.filter(id => id !== placeId)
          : [...prev, placeId]
      );
    } finally {
      setSavingId(null);
    }
  };
  if (error) {
    return (
      <Screen scroll={false}>
        <AppText className="text-lg font-semibold">
          Something went wrong
        </AppText>
        <AppText className="text-muted-foreground mt-2 text-center text-sm">
          {error.message}
        </AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <HeaderWithBack title="Community-vetted Gems" />

      <View className="gap-3">
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          activePlaces.map(place => (
            <PlaceCard
              key={place.placeId}
              place={place}
              onPress={() => router.push(`/places/${place.placeId}`)}
              isSaved={savedPlaces.includes(place.placeId)}
              onToggleSave={p => handleToggleSave(p.placeId)}
            />
          ))
        )}
      </View>
    </Screen>
  );
}
