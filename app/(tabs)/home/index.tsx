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
import { getUserProfile, toggleSavePlace } from '@/services/user.service';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext';
import { VIBE_ICONS } from '@/constants/vibes/vibesIcon';

export default function HomeScreen() {
  const { user } = useAuth();

  const [savedPlaces, setSavedPlaces] = useState<string[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Vibe filter — 'all' means use history-based algo
  const [selectedVibe, setSelectedVibe] = useState<string>('all');
  const [topVibes, setTopVibes] = useState<string[]>([]);

  // Infinite-scroll place feed
  const [places, setPlaces] = useState<Place[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Personalised trip suggestions
  const [tripSuggestions, setTripSuggestions] = useState<HomeTripSuggestion[]>(
    []
  );

  // Surprise Me loading state
  const [loadingSurprise, setLoadingSurprise] = useState(false);

  // Track current vibe to reset on vibe change
  const currentVibeRef = useRef(selectedVibe);

  // Fetch saved places on mount
  useEffect(() => {
    getUserProfile()
      .then(profile => setSavedPlaces(profile.savedPlaces))
      .catch(() => {});
  }, []);

  // Fetch first page of feed + trip suggestions
  const fetchFeed = useCallback(
    async (vibe: string, pageNum: number, append: boolean) => {
      if (pageNum === 0) setLoadingFeed(true);
      else setLoadingMore(true);

      try {
        const result = await getHomeRecommendations(vibe, pageNum);
        setHasMore(result.hasMore);

        if (append) {
          setPlaces(prev => [...prev, ...result.places]);
        } else {
          setPlaces(result.places);
          setTripSuggestions(result.tripSuggestions);
          // Merge in top vibes (keep user's existing selection visible)
          setTopVibes(prev => {
            const merged = [...new Set([...result.topVibes, ...prev])];
            return merged.slice(0, 10);
          });
        }
      } catch {
        // silently fail — keep existing data
      } finally {
        setLoadingFeed(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    currentVibeRef.current = selectedVibe;
    setPage(0);
    fetchFeed(selectedVibe, 0, false);
  }, [selectedVibe, fetchFeed]);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchFeed(selectedVibe, next, true);
  };

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
      // ignore
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

  // All vibe chips: "All" + user's top vibes from history + rest of VIBES
  const vibeChips = [
    { id: 'all', title: 'All', image: null },
    ...topVibes.map(id => VIBES.find(v => v.id === id)).filter(Boolean),
    ...VIBES.filter(v => !topVibes.includes(v.id))
  ] as { id: string; title: string; image: string | null }[];

  // ── List header ─────────────────────────────────────────────────────────────
  const ListHeader = (
    <View className="gap-0">
      {/* ── Top bar ── */}
      <View className="flex-row items-start justify-between px-4 pb-2 pt-3">
        <View className="flex-1">
          <AppText variant="title">Namaste! {formattedUsername}</AppText>
          <AppText variant="subtitle" className="mt-[2px]">
            Where to today?
          </AppText>
        </View>

        {/* Surprise Me pill button */}
        <Pressable
          onPress={handleSurpriseMe}
          disabled={loadingSurprise}
          className={`mt-1 flex-row items-center gap-1.5 rounded-full px-3.5 py-2.5 bg-colors-brand-primary${
            loadingSurprise ? 'opacity-70' : 'opacity-100'
          }`}
        >
          {loadingSurprise ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="shuffle-outline" size={16} color="white" />
          )}

          <AppText className="text-[13px] font-bold text-white">
            {loadingSurprise ? 'Thinking…' : 'Surprise Me'}
          </AppText>
        </Pressable>
      </View>

      {/* ── Curate trip CTA ── */}
      <View className="px-4 pb-4">
        <Button
          title="Curate New Trip"
          onPress={() => router.push('/(tabs)/trip-generator')}
        />
      </View>

      {/* ── Vibe selector ── */}
      <View className="pb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4 gap-2.5"
        >
          {vibeChips.map(chip => {
            const isSelected = selectedVibe === chip.id;

            return (
              <Pressable
                key={chip.id}
                onPress={() => setSelectedVibe(chip.id)}
                className={`flex-row items-center gap-2 rounded-full border-[1.5px] px-3.5 py-2 ${
                  isSelected ? 'opacity-100' : 'opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected
                    ? colors.brand.primary
                    : colors.brand.neutrals,
                  borderColor: isSelected
                    ? colors.brand.primary
                    : colors.brand.neutrals
                }}
              >
                {chip.id !== 'all' && chip.image ? (
                  <Image
                    source={{ uri: chip.image }}
                    className="h-[22px] w-[22px] rounded-full"
                    style={{ opacity: isSelected ? 1 : 0.85 }}
                  />
                ) : chip.id === 'all' ? (
                  <Ionicons
                    name="apps-outline"
                    size={16}
                    color={isSelected ? 'white' : colors.brand.secondary}
                  />
                ) : (
                  <Ionicons
                    name={VIBE_ICONS[chip.id] ?? 'sparkles-outline'}
                    size={16}
                    color={isSelected ? 'white' : colors.brand.secondary}
                  />
                )}

                <AppText
                  className="text-[13px] font-semibold"
                  style={{
                    color: isSelected ? 'white' : colors.brand.secondary
                  }}
                >
                  {chip.title}
                </AppText>

                {/* "For you" badge */}
                {!isSelected &&
                  chip.id !== 'all' &&
                  topVibes.includes(chip.id) && (
                    <View className="h-[7px] w-[7px] rounded-full bg-colors-brand-primary" />
                  )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Trip suggestions ── */}
      {tripSuggestions.length > 0 && (
        <View className="mb-5 gap-3">
          <AppText className="px-4 text-lg font-semibold text-colors-text">
            Picked For You
          </AppText>
          {tripSuggestions.map((s, i) => (
            <HomeSuggestionCard
              key={i}
              reason={s.reason}
              places={s.places}
              onPress={() => handleSuggestionPress(s)}
            />
          ))}
        </View>
      )}

      {/* ── Section title for the place feed ── */}
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
        <FlatList
          data={places}
          keyExtractor={item => item.placeId}
          renderItem={({ item: place }) => (
            <View className="mb-3 px-4">
              <PlaceCard
                place={place}
                onPress={() => router.push(`/places/${place.placeId}`)}
                isSaved={savedPlaces.includes(place.placeId)}
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
                No places found for this vibe yet.{'\n'}Try a different filter!
              </AppText>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View className="items-center py-5">
                <ActivityIndicator size="small" color={colors.brand.primary} />
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
      )}
    </SafeAreaView>
  );
}
