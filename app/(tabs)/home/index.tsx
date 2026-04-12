import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { HomeSuggestionCard } from '@/components/cards/variants/HomeSuggestionCard';
import { VIBES } from '@/constants/vibes';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  View
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { getUserProfile, toggleSavePlace } from '@/services/user.service';
import {
  getHomeRecommendations,
  getSurpriseRecommendation,
  type HomeTripSuggestion
} from '@/services/trip.service';
import type { Place } from '@/features/place/place.types';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const VIBE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  thrill: 'rocket-outline',
  mountain: 'triangle-outline',
  spiritual: 'leaf-outline',
  culture: 'book-outline',
  nature: 'leaf-outline',
  foodie: 'restaurant-outline',
  chill: 'moon-outline',
  social: 'people-outline',
  photo: 'camera-outline',
  budget: 'wallet-outline',
  luxury: 'star-outline',
  family: 'home-outline',
  romantic: 'heart-outline',
  solo: 'person-outline',
  offbeat: 'compass-outline',
  wellness: 'fitness-outline'
};

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
    <View style={{ gap: 0 }}>
      {/* ── Top bar ── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 8
        }}
      >
        <View style={{ flex: 1 }}>
          <AppText variant="title">Namaste! {formattedUsername}</AppText>
          <AppText variant="subtitle" style={{ marginTop: 2 }}>
            Where to today?
          </AppText>
        </View>

        {/* Surprise Me pill button */}
        <Pressable
          onPress={handleSurpriseMe}
          disabled={loadingSurprise}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: colors.brand.primary,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 20,
            marginTop: 4,
            opacity: loadingSurprise ? 0.7 : 1
          }}
        >
          {loadingSurprise ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="shuffle-outline" size={16} color="white" />
          )}
          <AppText style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>
            {loadingSurprise ? 'Thinking…' : 'Surprise Me'}
          </AppText>
        </Pressable>
      </View>

      {/* ── Curate trip CTA ── */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <Button
          title="Curate New Trip"
          onPress={() => router.push('/(tabs)/trip-generator')}
        />
      </View>

      {/* ── Vibe selector ── */}
      <View style={{ paddingBottom: 16 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        >
          {vibeChips.map(chip => {
            const isSelected = selectedVibe === chip.id;
            return (
              <Pressable
                key={chip.id}
                onPress={() => setSelectedVibe(chip.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 24,
                  backgroundColor: isSelected
                    ? colors.brand.primary
                    : colors.brand.neutrals,
                  borderWidth: 1.5,
                  borderColor: isSelected
                    ? colors.brand.primary
                    : colors.brand.neutrals
                }}
              >
                {chip.id !== 'all' && chip.image ? (
                  <Image
                    source={{ uri: chip.image }}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      opacity: isSelected ? 1 : 0.85
                    }}
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
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: isSelected ? 'white' : colors.brand.secondary
                  }}
                >
                  {chip.title}
                </AppText>
                {/* "For you" badge on top vibes */}
                {!isSelected &&
                  chip.id !== 'all' &&
                  topVibes.includes(chip.id) && (
                    <View
                      style={{
                        backgroundColor: colors.brand.primary,
                        width: 7,
                        height: 7,
                        borderRadius: 3.5
                      }}
                    />
                  )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Trip suggestions ── */}
      {tripSuggestions.length > 0 && (
        <View style={{ gap: 12, marginBottom: 20 }}>
          <AppText
            style={{
              fontSize: 16,
              fontWeight: '700',
              paddingHorizontal: 16,
              color: colors.text.DEFAULT
            }}
          >
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginBottom: 10
        }}
      >
        <AppText
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: colors.text.DEFAULT
          }}
        >
          {selectedVibe === 'all'
            ? 'Explore Places'
            : `${VIBES.find(v => v.id === selectedVibe)?.title ?? selectedVibe} Spots`}
        </AppText>
        <Pressable onPress={() => router.push('/(tabs)/home/gems')}>
          <AppText
            style={{
              fontSize: 13,
              color: colors.brand.primary,
              fontWeight: '600'
            }}
          >
            See all
          </AppText>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.surface.background }}
    >
      {loadingFeed ? (
        <View style={{ flex: 1 }}>
          {ListHeader}
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator size="large" color={colors.brand.primary} />
          </View>
        </View>
      ) : (
        <FlatList
          data={places}
          keyExtractor={item => item.placeId}
          renderItem={({ item: place }) => (
            <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
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
            <View
              style={{
                alignItems: 'center',
                paddingVertical: 40,
                paddingHorizontal: 16,
                gap: 10
              }}
            >
              <Ionicons
                name="map-outline"
                size={48}
                color={colors.brand.neutrals}
              />
              <AppText style={{ color: '#94a3b8', textAlign: 'center' }}>
                No places found for this vibe yet.{'\n'}Try a different filter!
              </AppText>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.brand.primary} />
              </View>
            ) : hasMore ? (
              <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                <Button title="Load More" onPress={handleLoadMore} />
              </View>
            ) : places.length > 0 ? (
              <AppText
                style={{
                  textAlign: 'center',
                  color: '#94a3b8',
                  fontSize: 12,
                  paddingVertical: 20
                }}
              >
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
