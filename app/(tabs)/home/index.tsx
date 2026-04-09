import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { HomeSuggestionCard } from '@/components/cards/variants/HomeSuggestionCard';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { VIBES } from '@/constants/vibes/vibes';
import type { Place } from '@/features/place/place.types';
import {
  getHomeRecommendations,
  getSurpriseRecommendation,
  type HomeTripSuggestion
} from '@/services/trip.service';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext';
import { useSavedPlaces } from '@/hooks/place/useSavedPlaces';
import { VibeSelector } from '@/components/VibeSelector';

export default function HomeScreen() {
  const { user } = useAuth();
  const { savedPlaces, handleToggleSave, savingId } = useSavedPlaces();

  const [selectedVibe, setSelectedVibe] = useState<string>('all');
  const [topVibes, setTopVibes] = useState<string[]>([]);

  const [places, setPlaces] = useState<Place[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingVibe, setLoadingVibe] = useState(false);

  const [tripSuggestions, setTripSuggestions] = useState<HomeTripSuggestion[]>(
    []
  );
  const [loadingSurprise, setLoadingSurprise] = useState(false);

  // ── Fetch feed ─────────────────────────────────────────────
  const fetchFeed = useCallback(
    async (vibe: string, pageNum: number, append: boolean) => {
      if (pageNum === 0 && !append) setLoadingFeed(true);
      else setLoadingMore(true);

      try {
        const result = await getHomeRecommendations(vibe, pageNum);
        setHasMore(result.hasMore);

        if (append) {
          setPlaces(prev => [...prev, ...result.places]);
        } else {
          setPlaces(result.places);
          setTripSuggestions(result.tripSuggestions);

          setTopVibes(prev => {
            const merged = [...new Set([...result.topVibes, ...prev])];
            return merged.slice(0, 10);
          });
        }
      } catch {
        // ignore
      } finally {
        setLoadingFeed(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // ── Initial load ─────────────────────────────────────────────
  useEffect(() => {
    fetchFeed('all', 0, false);
  }, [fetchFeed]);

  // ── Vibe change (NO scroll jump) ─────────────────────────────
  useEffect(() => {
    const loadVibe = async () => {
      setLoadingVibe(true);
      setPage(0);
      setHasMore(true);

      try {
        const result = await getHomeRecommendations(selectedVibe, 0);

        setPlaces(result.places);
        setTripSuggestions(result.tripSuggestions);

        setTopVibes(prev => {
          const merged = [...new Set([...result.topVibes, ...prev])];
          return merged.slice(0, 10);
        });
      } catch {
        // ignore
      } finally {
        setLoadingVibe(false);
      }
    };

    loadVibe();
  }, [selectedVibe]);

  // ── Pagination ─────────────────────────────────────────────
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;

    const next = page + 1;
    setPage(next);

    fetchFeed(selectedVibe, next, true); // ✅ FIXED
  };

  // ── Surprise ─────────────────────────────────────────────
  const handleSurpriseMe = async () => {
    if (loadingSurprise) return;

    setLoadingSurprise(true);
    try {
      const result = await getSurpriseRecommendation();
      const placeIds = result.recommendedPlaces.map(p => p.placeId).join(',');

      router.push({
        pathname: '/review-trip',
        params: {
          placeIds,
          itineraryName: `Surprise Trip ✨`
        }
      });
    } catch {
    } finally {
      setLoadingSurprise(false);
    }
  };

  const handleSuggestionPress = (suggestion: HomeTripSuggestion) => {
    const placeIds = suggestion.places.map(p => p.placeId).join(',');

    router.push({
      pathname: '/review-trip',
      params: { placeIds, itineraryName: `${suggestion.vibe} trip` }
    });
  };

  const username = user?.username ?? '';
  const formattedUsername =
    username.charAt(0).toUpperCase() + username.slice(1);

  // ── Header ─────────────────────────────────────────────
  const ListHeader = (
    <View className="gap-0">
      <View className="flex-row items-start justify-between px-4 pb-2 pt-3">
        <View className="flex-1">
          <AppText variant="title">Namaste! {formattedUsername}</AppText>
          <AppText variant="subtitle" className="mt-[2px]">
            Where to today?
          </AppText>
        </View>

        <Button
          title={loadingSurprise ? 'Thinking…' : 'Surprise!'}
          onPress={handleSurpriseMe}
          isLoading={loadingSurprise}
          className="mt-1 h-12 min-w-[100px] bg-colors-brand-secondary p-2.5"
        />
      </View>

      <View className="px-4 pb-4">
        <Button
          title="Curate New Trip"
          onPress={() => router.push('/(tabs)/trip-generator')}
        />
      </View>

      {tripSuggestions.length > 0 && (
        <View className="mb-5 gap-3">
          <AppText className="px-4 text-lg font-semibold text-colors-text">
            Picked For You
          </AppText>
          <View className="mb-5 gap-3 shadow-sm">
            {tripSuggestions.map((s, i) => (
              <HomeSuggestionCard
                key={i}
                reason={s.reason}
                places={s.places}
                onPress={() => handleSuggestionPress(s)}
              />
            ))}
          </View>
        </View>
      )}

      <VibeSelector
        selectedVibe={selectedVibe}
        setSelectedVibe={setSelectedVibe}
        topVibes={topVibes}
      />

      <View className="mb-2.5 flex-row items-center justify-between px-4">
        <AppText className="text-lg font-semibold text-colors-text">
          {selectedVibe === 'all'
            ? 'Explore Places'
            : `${VIBES.find(v => v.id === selectedVibe)?.title ?? selectedVibe} Spots`}
        </AppText>

        <Pressable onPress={() => router.push('/(tabs)/home/gems')}>
          <AppText className="text-sm font-semibold text-colors-brand-primary">
            See all
          </AppText>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-colors-surface-background">
      {loadingFeed ? (
        <View className="flex-1">
          {ListHeader}
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.brand.primary} />
          </View>
        </View>
      ) : (
        <View className="flex-1">
          <FlatList
            data={places}
            keyExtractor={item => item.placeId}
            renderItem={({ item: place }) => (
              <View className="mb-3 px-4">
                <PlaceCard
                  place={place}
                  onPress={() => router.push(`/places/${place.placeId}`)}
                  isSaved={savedPlaces.includes(place.placeId)}
                  isSaving={savingId === place.placeId}
                  onToggleSave={p => handleToggleSave(p.placeId)}
                />
              </View>
            )}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={
              <View className="items-center gap-2.5 p-4">
                <Ionicons
                  name="map-outline"
                  size={48}
                  color={colors.brand.neutrals}
                />
                <AppText className="py-5 text-center text-sm text-colors-text/60">
                  No places found for this vibe yet.{'\n'}Try a different
                  filter!
                </AppText>
              </View>
            }
            ListFooterComponent={
              loadingMore ? (
                <View className="items-center py-5">
                  <ActivityIndicator
                    size="small"
                    color={colors.brand.primary}
                  />
                </View>
              ) : hasMore ? (
                <View className="px-4 py-3">
                  <Button title="Load More" onPress={handleLoadMore} />
                </View>
              ) : places.length > 0 ? (
                <AppText className="py-5 text-center text-sm text-colors-text/60">
                  {"You've seen it all ✓"}
                </AppText>
              ) : null
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
          />

          {/* 🔥 Smooth loading indicator (no jump) */}
          {loadingVibe && (
            <View className="absolute left-0 right-0 top-2 items-center">
              <ActivityIndicator size="small" color={colors.brand.primary} />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
