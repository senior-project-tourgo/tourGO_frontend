import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { HomeSuggestionCard } from '@/components/cards/variants/HomeSuggestionCard';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { VibeChip } from '@/components/VibeChip';
import { VIBES } from '@/constants/vibes/vibes';
import type { Place } from '@/features/place/place.types';
import { useSavePlace } from '@/hooks/place/useSavePlace';
import {
  getHomeRecommendations,
  getSurpriseRecommendation,
  type HomeTripSuggestion
} from '@/services/trip.service';
import { getUserProfile } from '@/services/user.service';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const { savedPlaces, toggleSave, setSavedPlaces } = useSavePlace();

  const [selectedVibe, setSelectedVibe] = useState<string>('all');
  const [topVibes, setTopVibes] = useState<string[]>([]);

  const [places, setPlaces] = useState<Place[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [tripSuggestions, setTripSuggestions] = useState<HomeTripSuggestion[]>(
    []
  );
  const [loadingSurprise, setLoadingSurprise] = useState(false);

  useEffect(() => {
    if (savedPlaces.length > 0) return;

    getUserProfile()
      .then(profile => setSavedPlaces(profile.savedPlaces))
      .catch(() => {});
  }, [savedPlaces.length, setSavedPlaces]);

  const fetchFeed = useCallback(
    async (vibe: string, pageNum: number, append: boolean) => {
      if (pageNum === 0) setIsRefreshing(true);
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
      } finally {
        setIsRefreshing(false);
        setLoadingMore(false);
      }
    },
    []
  );

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

  const vibeChips = useMemo(
    () =>
      [
        { id: 'all', title: 'All', image: null },
        ...topVibes.map(id => VIBES.find(v => v.id === id)).filter(Boolean),
        ...VIBES.filter(v => !topVibes.includes(v.id))
      ] as { id: string; title: string; image: string | null }[],
    [topVibes]
  );

  const ListHeader = useMemo(
    () => (
      <View>
        {/* Top */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 8
          }}
        >
          <View style={{ flex: 1 }}>
            <AppText variant="title">Namaste! {formattedUsername}</AppText>
            <AppText variant="subtitle">Where to today?</AppText>
          </View>

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
              opacity: loadingSurprise ? 0.7 : 1
            }}
          >
            {loadingSurprise ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="shuffle-outline" size={16} color="white" />
            )}
            <AppText
              style={{ color: 'white', fontWeight: '700', fontSize: 13 }}
            >
              {loadingSurprise ? 'Thinking…' : 'Surprise Me'}
            </AppText>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Button
            title="Curate New Trip"
            onPress={() => router.push('/(tabs)/trip-generator')}
          />
        </View>

        {/* Vibes */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        >
          {vibeChips.map(chip => (
            <VibeChip
              key={chip.id}
              id={chip.id}
              title={chip.title}
              isSelected={selectedVibe === chip.id}
              showDot={chip.id !== 'all' && topVibes.includes(chip.id)}
              onPress={() => setSelectedVibe(chip.id)}
            />
          ))}
        </ScrollView>

        {/* Suggestions */}
        {tripSuggestions.length > 0 && (
          <View style={{ marginTop: 16, gap: 12 }}>
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

        {/* ✅ ALWAYS SHOW PLACE SECTION HEADER */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            marginTop: 20,
            marginBottom: 10
          }}
        >
          <AppText style={{ fontSize: 16, fontWeight: '700' }}>
            {selectedVibe === 'all'
              ? 'Explore Places'
              : `${VIBES.find(v => v.id === selectedVibe)?.title ?? selectedVibe} Spots`}
          </AppText>

          <Pressable onPress={() => router.push('/(tabs)/home/gems')}>
            <AppText style={{ fontSize: 13, color: colors.brand.primary }}>
              See all
            </AppText>
          </Pressable>
        </View>
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedVibe, vibeChips, tripSuggestions, loadingSurprise]
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.surface.background }}
    >
      <FlatList
        data={places}
        keyExtractor={item => item.placeId}
        renderItem={({ item: place }) => (
          <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <PlaceCard
              place={place}
              onPress={() => router.push(`/places/${place.placeId}`)}
              isSaved={savedPlaces.includes(place.placeId)}
              onToggleSave={() => toggleSave(place.placeId)}
            />
          </View>
        )}
        ListHeaderComponent={ListHeader}
        refreshing={isRefreshing}
        onRefresh={() => fetchFeed(selectedVibe, 0, false)}
        // ✅ EMPTY STATE INSIDE SECTION
        ListEmptyComponent={
          !isRefreshing ? (
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
          ) : null
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={{ marginVertical: 20 }} />
          ) : null
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
