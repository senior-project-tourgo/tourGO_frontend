import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { Screen } from '@/components/Screen';
import { useActivePlaces } from '@/hooks/review-trip/useActivePlaces';
import { router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';
import { getUserProfile, toggleSavePlace } from '@/services/user.service';

export default function HomeScreen() {
  const { data: activePlaces, loading, error } = useActivePlaces(3);
  const { user } = useAuth();

  const [savedPlaces, setSavedPlaces] = useState<string[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    getUserProfile()
      .then(profile => {
        console.log('[Home] savedPlaces:', profile.savedPlaces);
        setSavedPlaces(profile.savedPlaces);
      })
      .catch(err => console.warn('[Home] getUserProfile failed:', err.message));
  }, []);

  const handleToggleSave = async (placeId: string) => {
    if (savingId) return;
    console.log('[Home] toggling save for:', placeId);
    setSavingId(placeId);
    setSavedPlaces(prev =>
      prev.includes(placeId)
        ? prev.filter(id => id !== placeId)
        : [...prev, placeId]
    );
    try {
      const result = await toggleSavePlace(placeId);
      console.log('[Home] toggleSave result:', result);
      setSavedPlaces(result.savedPlaces);
    } catch (err: any) {
      console.error('[Home] toggleSave failed:', err.message);
      // revert optimistic update on failure
      setSavedPlaces(prev =>
        prev.includes(placeId)
          ? prev.filter(id => id !== placeId)
          : [...prev, placeId]
      );
    } finally {
      setSavingId(null);
    }
  };

  const username = user?.username ?? '';
  const formattedUsername =
    username.charAt(0).toUpperCase() + username.slice(1);

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
      <AppText variant="title">Namaste! {formattedUsername}</AppText>
      <AppText variant="subtitle">How are you doing today?</AppText>

      <View className="gap-6 pt-6">
        <Button
          title="Curate New Trip"
          onPress={() => router.push('/(tabs)/trip-generator')}
        />

        {/* Places list */}
        <View className="gap-3">
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            activePlaces?.map(place => (
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

        <Button
          title="Go to Gems"
          onPress={() => router.push('/(tabs)/home/gems')}
        />
      </View>
    </Screen>
  );
}
