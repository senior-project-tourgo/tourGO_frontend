import { AppText } from '@/components/AppText';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import type { Place } from '@/features/place/place.types';
import { getSavedPlaces } from '@/services/user.service';
import { useSavePlace } from '@/hooks/place/useSavePlace';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // ✅ NEW

export default function SavedPlacesScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const { savedPlaces, toggleSave, setSavedPlaces } = useSavePlace();

  // ✅ shared fetch logic (reuse for mount + focus)
  const fetchSaved = useCallback(async () => {
    try {
      const data = await getSavedPlaces();
      setPlaces(data);
      setSavedPlaces(data.map(p => p.placeId));
    } catch {}
  }, [setSavedPlaces]);

  // ✅ initial load
  useEffect(() => {
    fetchSaved().finally(() => setLoading(false));
  }, [fetchSaved]);

  // ✅ refetch on screen focus (fix stale tabs issue)
  useFocusEffect(
    useCallback(() => {
      fetchSaved();
    }, [fetchSaved])
  );

  // ✅ derived UI
  const visiblePlaces = useMemo(
    () => places.filter(place => savedPlaces.includes(place.placeId)),
    [places, savedPlaces]
  );

  return (
    <Screen>
      <HeaderWithBack title="Saved Places" />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.brand.primary}
          className="mt-6"
        />
      ) : visiblePlaces.length === 0 ? (
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
          {visiblePlaces.map(place => (
            <PlaceCard
              key={place.placeId}
              place={place}
              onPress={() => router.push(`/places/${place.placeId}`)}
              isSaved={savedPlaces.includes(place.placeId)}
              onToggleSave={p => toggleSave(p.placeId)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
