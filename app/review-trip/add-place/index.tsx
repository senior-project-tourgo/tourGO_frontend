import { AppText } from '@/components/AppText';
import { searchPlaces, getActivePlaces } from '@/features/place/place.api';
import type { Place } from '@/features/place/place.types';
import { pendingPlaceStore } from '@/stores/pendingPlaceStore';
import colors from '@/theme/colors';
import { haversineKm } from '@/utils/distance';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  TextInput,
  View
} from 'react-native';

// --- Place row ---
function PlaceRow({
  place,
  distanceKm,
  added,
  onAdd
}: {
  place: Place;
  distanceKm: number | null;
  added: boolean;
  onAdd: () => void;
}) {
  return (
    <Pressable
      onPress={added ? undefined : onAdd}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 12,
        backgroundColor: added ? '#f8faff' : '#fff'
      }}
    >
      {/* Thumbnail */}
      <Image
        source={{ uri: place.image }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          backgroundColor: '#f1f5f9'
        }}
        resizeMode="cover"
      />

      {/* Text */}
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="subtitle" style={{ fontSize: 14 }}>
          {place.placeName}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="location-outline" size={12} color="#94a3b8" />
          <AppText variant="muted" style={{ fontSize: 12 }}>
            {place.location.area}
          </AppText>
          {distanceKm !== null && (
            <>
              <AppText variant="muted" style={{ fontSize: 12 }}>
                ·
              </AppText>
              <AppText variant="muted" style={{ fontSize: 12 }}>
                {distanceKm < 1
                  ? `${Math.round(distanceKm * 1000)} m away`
                  : `${distanceKm.toFixed(1)} km away`}
              </AppText>
            </>
          )}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="star" size={11} color={colors.brand.primary} />
          <AppText variant="muted" style={{ fontSize: 12 }}>
            {place.averageRating} · {place.priceRange}
          </AppText>
        </View>
      </View>

      {/* Add / Added button */}
      <Pressable
        onPress={added ? undefined : onAdd}
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: added ? '#dcfce7' : colors.brand.primary,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        hitSlop={8}
      >
        <Ionicons
          name={added ? 'checkmark' : 'add'}
          size={18}
          color={added ? '#16a34a' : '#fff'}
        />
      </Pressable>
    </Pressable>
  );
}

// --- Separator ---
function Separator() {
  return (
    <View
      style={{ height: 1, backgroundColor: '#f1f5f9', marginHorizontal: 20 }}
    />
  );
}

export default function AddPlaceScreen() {
  // existing place IDs passed from parent so we can show checkmarks
  const { addedIds } = useLocalSearchParams<{ addedIds?: string }>();
  const alreadyAdded = new Set(addedIds ? addedIds.split(',') : []);

  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Request location once
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
        setUserCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
    })();
  }, []);

  // Load nearby places on mount (empty query = all active)
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
      // fallback: fetch all
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

  // Sort by distance if we have user coords and no active text search
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View
        style={{
          paddingTop: 56,
          paddingBottom: 12,
          paddingHorizontal: 20,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#f1f5f9',
          gap: 12
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={{
              width: 36,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 18,
              backgroundColor: '#f1f5f9'
            }}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={colors.text.DEFAULT}
            />
          </Pressable>
          <AppText
            variant="subtitle"
            style={{ fontSize: 17, fontWeight: '600', flex: 1 }}
          >
            Add a Place
          </AppText>
        </View>

        {/* Search input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            borderRadius: 14,
            paddingHorizontal: 12,
            paddingVertical: 10,
            gap: 8,
            borderWidth: 1,
            borderColor: '#e2e8f0'
          }}
        >
          <Ionicons name="search-outline" size={18} color="#94a3b8" />
          <TextInput
            value={query}
            onChangeText={onChangeQuery}
            placeholder="Search places..."
            placeholderTextColor="#94a3b8"
            style={{
              flex: 1,
              fontSize: 15,
              color: colors.text.DEFAULT,
              fontFamily: 'Inter'
            }}
            autoFocus
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {loading && (
            <ActivityIndicator size="small" color={colors.brand.primary} />
          )}
        </View>

        {/* Near me label */}
        {!query.trim() && userCoords && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons
              name="navigate-outline"
              size={13}
              color={colors.brand.primary}
            />
            <AppText
              variant="muted"
              style={{ fontSize: 12, color: colors.brand.primary }}
            >
              Sorted by distance from you
            </AppText>
          </View>
        )}
      </View>

      {/* Results */}
      {loading && places.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator size="large" color={colors.brand.primary} />
        </View>
      ) : displayPlaces.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
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
