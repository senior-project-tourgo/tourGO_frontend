import { AppText } from '@/components/AppText';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import type { Place } from '@/features/place/place.types';
import {
  getSavedPlaces,
  getUserProfile,
  toggleSavePlace
} from '@/services/user.service';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function SavedPlacesScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

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
  useEffect(() => {
    getSavedPlaces()
      .then(setPlaces)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Screen>
      <HeaderWithBack title="Saved Places" />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.brand.primary}
          className="mt-6"
        />
      ) : places.length === 0 ? (
        <View className="items-center gap-2 pt-10">
          <Ionicons
            name="bookmark-outline"
            size={48}
            color={colors.brand.neutrals}
          />
          <AppText variant="subtitle" className="text-center">
            No saved places yet
          </AppText>
          <AppText variant="muted" className="text-center">
            Bookmark places from the Home or Gems screen
          </AppText>
        </View>
      ) : (
        <View className="items-center gap-3">
          {places.map(place => (
            <PlaceCard
              key={place.placeId}
              place={place}
              onPress={() => router.push(`/places/${place.placeId}`)}
              isSaved={savedPlaces.includes(place.placeId)}
              onToggleSave={p => handleToggleSave(p.placeId)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
