import { AppText } from '@/components/AppText';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import type { Place } from '@/features/place/place.types';
import { getSavedPlaces } from '@/services/user.service';
import { useSavePlace } from '@/hooks/place/useSavePlace'; // ✅ NEW
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function SavedPlacesScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ shared save logic
  const { savedPlaces, toggleSave, setSavedPlaces } = useSavePlace();

  // ✅ initial fetch + hydrate
  useEffect(() => {
    getSavedPlaces()
      .then(data => {
        setPlaces(data);
        setSavedPlaces(data.map(p => p.placeId)); // hydrate IDs
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [setSavedPlaces]);

  // ✅ IMPORTANT: sync UI when unsaving
  useEffect(() => {
    setPlaces(prev =>
      prev.filter(place => savedPlaces.includes(place.placeId))
    );
  }, [savedPlaces]);

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
              isSaved={savedPlaces.includes(place.placeId)} // ✅
              onToggleSave={p => toggleSave(p.placeId)} // ✅
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
