// screens/AddPlaceScreen.tsx
import { useEffect, useState, useRef } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { AppText } from '@/components/AppText';
import { AppTextInput } from '@/components/AppTextInput';
import { HeaderWithBack } from '@/components/PageHeader';
import { pendingPlaceStore } from '@/stores/pendingPlaceStore';
import { searchPlaces, getActivePlaces } from '@/features/place/place.api';
import type { Place } from '@/features/place/place.types';
import colors from '@/theme/colors';
import { haversineKm } from '@/utils/distance';
import PlaceRow from '@/components/PlaceRow';
import Separator from '@/components/Separator';
import { useUserLocation } from '@/hooks/review-trip/add-place/useUserLocation';

// --- Main Screen ---
export default function AddPlaceScreen() {
  const { addedIds } = useLocalSearchParams<{ addedIds?: string }>();
  const alreadyAdded = new Set(addedIds ? addedIds.split(',') : []);

  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { coords: userCoords } = useUserLocation();

  // --- Load initial places ---
  useEffect(() => {
    loadPlaces('');
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  async function loadPlaces(q: string) {
    setLoading(true);
    try {
      const results = await searchPlaces(q, 50);
      setPlaces(results);
    } catch {
      try {
        const all = await getActivePlaces(50);
        setPlaces(all);
      } catch {}
    } finally {
      setLoading(false);
    }
  }

  function onChangeQuery(text: string) {
    setQuery(text);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => loadPlaces(text), 350);
  }

  function handleAdd(place: Place) {
    pendingPlaceStore.set(place);
    router.back();
  }

  const displayPlaces =
    userCoords && !query.trim()
      ? [...places].sort((a, b) => {
          const da = haversineKm(
            userCoords.lat,
            userCoords.lng,
            Number(a.location.lat),
            Number(a.location.lng)
          );
          const db = haversineKm(
            userCoords.lat,
            userCoords.lng,
            Number(b.location.lat),
            Number(b.location.lng)
          );
          return da - db;
        })
      : places;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="border-b border-slate-100 bg-white px-5 pt-14">
        <HeaderWithBack title="Add a Place" backBg />

        {/* Search */}
        <View className="mt-3 px-3">
          <AppTextInput
            value={query}
            onChangeText={onChangeQuery}
            placeholder="Search places..."
            autoFocus
            returnKeyType="search"
            rightIcon={
              loading ? (
                <ActivityIndicator size="small" color={colors.brand.primary} />
              ) : (
                <Ionicons
                  name="search"
                  size={18}
                  color={colors.brand.primary}
                />
              )
            }
          />
        </View>

        {!query.trim() && userCoords && (
          <View className="my-2 flex-row items-center gap-1">
            <Ionicons
              name="navigate-outline"
              size={13}
              color={colors.brand.primary}
            />
            <AppText
              variant="muted"
              className="text-xs"
              style={{ color: colors.brand.primary }}
            >
              Sorted by distance from you
            </AppText>
          </View>
        )}
      </View>

      {/* Content */}
      {loading && places.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brand.primary} />
        </View>
      ) : displayPlaces.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-2">
          <Ionicons name="search-outline" size={40} color="#cbd5e1" />
          <AppText variant="muted">
            No places found for &quot;{query}&quot;
          </AppText>
        </View>
      ) : (
        <FlatList
          data={displayPlaces}
          keyExtractor={item => item.placeId}
          renderItem={({ item }) => (
            <PlaceRow
              place={item}
              distanceKm={
                userCoords
                  ? haversineKm(
                      userCoords.lat,
                      userCoords.lng,
                      Number(item.location.lat),
                      Number(item.location.lng)
                    )
                  : null
              }
              added={alreadyAdded.has(item.placeId)}
              onAdd={() => handleAdd(item)}
            />
          )}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}
