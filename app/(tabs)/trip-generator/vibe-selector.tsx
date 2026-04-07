import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { VibeCard } from '@/components/cards/variants/VibeCard';
import { HeaderWithBack } from '@/components/PageHeader';
import { PaceValue } from '@/constants/paceOptions';
import { TRANSPORT_OPTIONS, TransportMode } from '@/constants/transportOptions';
import { VIBES } from '@/constants/vibes/vibes';
import { Area, Place } from '@/features/place/place.types';
import {
  generateRecommendation,
  getSurpriseRecommendation
} from '@/services/trip.service';

import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { AxiosError } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  Pressable,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type VibeMismatchData = {
  placeIds: string;
  matchCount: number;
  totalCount: number;
  unmatchedNames: string[];
};

/** Minimum ms of idle (no vibe tapped) before the interstitial appears */
const IDLE_TIMEOUT_MS = 7000;

export default function VibeSelectorScreen() {
  const router = useRouter();
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSurprise, setLoadingSurprise] = useState(false);
  const [mismatch, setMismatch] = useState<VibeMismatchData | null>(null);
  const [showIdleModal, setShowIdleModal] = useState(false);
  const params = useLocalSearchParams();

  // Idle timer — fires if user hasn't tapped a vibe in IDLE_TIMEOUT_MS
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Pulsing animation for the Surprise Me button inside the interstitial
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setShowIdleModal(true);
    }, IDLE_TIMEOUT_MS);
  };

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  // Pulse animation for interstitial button
  useEffect(() => {
    if (!showIdleModal) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 700,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true
        })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [showIdleModal, pulseAnim]);

  const toggleVibe = (id: string) => {
    resetIdleTimer();
    setSelectedVibes(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const normalizeNumberParam = (
    param: string | string[] | undefined,
    name: string
  ): number => {
    const value = Array.isArray(param) ? param[0] : param;
    const num = Number(value);
    if (!Number.isFinite(num)) {
      throw new Error(
        `Invalid param "${name}": expected a valid number, got "${value}"`
      );
    }
    return num;
  };

  const normalizeStringParam = (param: string | string[] | undefined): string =>
    (Array.isArray(param) ? param[0] : param) || '';

  const navigateToReview = (placeIds: string) => {
    router.push({
      pathname: '/review-trip',
      params: {
        placeIds,
        itineraryName: params.itineraryName,
        startLat: params.startLat,
        startLng: params.startLng,
        startLabel: params.startLabel
      }
    });
  };

  const checkVibeMismatch = (
    places: Place[],
    vibes: string[]
  ): { matchCount: number; unmatchedNames: string[] } => {
    let matchCount = 0;
    const unmatchedNames: string[] = [];
    for (const place of places) {
      const hasMatch = place.vibe.some(v => vibes.includes(v));
      if (hasMatch) matchCount++;
      else unmatchedNames.push(place.placeName);
    }
    return { matchCount, unmatchedNames };
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);

      const startLatRaw = normalizeStringParam(params.startLat);
      const startLngRaw = normalizeStringParam(params.startLng);
      const transportModeRaw = normalizeStringParam(params.transportMode);

      const areaRaw = normalizeStringParam(params.travelingArea);
      const priceRangeRaw = normalizeStringParam(params.priceRange);
      const result = await generateRecommendation({
        area: (areaRaw || undefined) as Area | undefined,
        vibes: selectedVibes,
        pace: normalizeStringParam(params.pace) as PaceValue,
        itineraryName: normalizeStringParam(params.itineraryName),
        tripDate: normalizeStringParam(params.tripDate),
        startTime: normalizeStringParam(params.startTime),
        endTime: normalizeStringParam(params.endTime),
        numberOfPeople: normalizeNumberParam(
          params.numberOfPeople,
          'numberOfPeople'
        ),
        groupType: normalizeStringParam(params.groupType) || undefined,
        startLat: startLatRaw ? Number(startLatRaw) : undefined,
        startLng: startLngRaw ? Number(startLngRaw) : undefined,
        transportMode: TRANSPORT_OPTIONS.some(o => o.value === transportModeRaw)
          ? (transportModeRaw as TransportMode)
          : undefined,
        priceRange: (['$', '$$', '$$$', '$$$$'] as const).includes(
          priceRangeRaw as any
        )
          ? (priceRangeRaw as '$' | '$$' | '$$$' | '$$$$')
          : undefined
      });

      const placeIds = result.recommendedPlaces.map(p => p.placeId).join(',');
      const { matchCount, unmatchedNames } = checkVibeMismatch(
        result.recommendedPlaces,
        selectedVibes
      );

      if (matchCount < result.recommendedPlaces.length) {
        setMismatch({
          placeIds,
          matchCount,
          totalCount: result.recommendedPlaces.length,
          unmatchedNames
        });
      } else {
        navigateToReview(placeIds);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      Alert.alert(
        'Could not generate itinerary',
        axiosError.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurpriseMe = async () => {
    setShowIdleModal(false);
    if (loadingSurprise) return;
    setLoadingSurprise(true);
    try {
      const result = await getSurpriseRecommendation();
      const placeIds = result.recommendedPlaces.map(p => p.placeId).join(',');
      router.push({
        pathname: '/review-trip',
        params: {
          placeIds,
          itineraryName: `Surprise Trip ✨`,
          startLat: params.startLat,
          startLng: params.startLng,
          startLabel: params.startLabel
        }
      });
    } catch {
      Alert.alert('Oops', 'Could not generate a surprise trip. Try again!');
    } finally {
      setLoadingSurprise(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-colors-surface-background">
      {/* Scrollable content */}
      <FlatList
        data={VIBES}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 16 }}
        columnWrapperStyle={{
          gap: 16,
          justifyContent: 'space-between',
          marginBottom: 16
        }}
        ListHeaderComponent={<HeaderWithBack title="Select Your Vibes" />}
        renderItem={({ item }) => (
          <VibeCard
            title={item.title}
            image={item.image}
            selected={selectedVibes.includes(item.id)}
            onPress={() => toggleVibe(item.id)}
          />
        )}
      />

      {/* Fixed bottom buttons */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}>
        {/* Surprise Me secondary button */}
        <Pressable
          onPress={handleSurpriseMe}
          disabled={loadingSurprise}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: 14,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: colors.brand.primary,
            backgroundColor: 'transparent',
            opacity: loadingSurprise ? 0.6 : 1
          }}
        >
          <Ionicons
            name="shuffle-outline"
            size={18}
            color={colors.brand.primary}
          />
          <AppText
            style={{
              color: colors.brand.primary,
              fontWeight: '700',
              fontSize: 15
            }}
          >
            {loadingSurprise ? 'Generating surprise…' : 'Surprise Me Instead'}
          </AppText>
        </Pressable>

        <Button
          title="Generate Itinerary"
          onPress={handleContinue}
          disabled={selectedVibes.length === 0}
          isLoading={isLoading}
        />
      </View>

      {/* Vibe mismatch modal */}
      <Modal
        visible={!!mismatch}
        transparent
        animationType="fade"
        onRequestClose={() => setMismatch(null)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/55 p-6"
          onPress={() => setMismatch(null)}
        >
          <Pressable
            className="w-full gap-4 rounded-2xl bg-white p-6"
            onPress={() => {}}
          >
            <View className="items-center">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                <Ionicons
                  name="alert-circle-outline"
                  size={30}
                  color={colors.brand.primary}
                />
              </View>
            </View>

            <AppText variant="subtitle" className="text-center font-semibold">
              Partial Vibe Match
            </AppText>

            <View className="mt-2 flex-row justify-center gap-2">
              <View className="items-center rounded-xl bg-green-50 px-3 py-2">
                <AppText
                  variant="subtitle"
                  className="font-semibold text-green-600"
                >
                  {mismatch?.matchCount}
                </AppText>
                <AppText variant="caption" className="text-green-600">
                  matched
                </AppText>
              </View>
              <View className="items-center rounded-xl bg-orange-50 px-3 py-2">
                <AppText
                  variant="subtitle"
                  className="font-semibold text-colors-brand-primary"
                >
                  {(mismatch?.totalCount ?? 0) - (mismatch?.matchCount ?? 0)}
                </AppText>
                <AppText
                  variant="caption"
                  className="text-colors-brand-primary"
                >
                  outside vibes
                </AppText>
              </View>
            </View>

            {mismatch && mismatch.unmatchedNames.length > 0 && (
              <View className="mt-2 gap-1">
                <AppText variant="caption" className="text-gray-500">
                  These places don&apos;t match your selected vibes:
                </AppText>
                {mismatch.unmatchedNames.map(name => (
                  <View key={name} className="flex-row items-center gap-1.5">
                    <Ionicons
                      name="location-outline"
                      size={13}
                      color="#94a3b8"
                    />
                    <AppText variant="caption">{name}</AppText>
                  </View>
                ))}
              </View>
            )}

            <AppText
              variant="caption"
              className="mt-2 text-center text-gray-400"
            >
              You can continue with this mix or go back and pick different
              vibes.
            </AppText>

            <View className="mt-4 flex-row gap-2.5">
              <Pressable
                onPress={() => setMismatch(null)}
                className="border-primary flex-1 items-center rounded-xl border-2 px-0 py-3"
              >
                <AppText className="text-primary font-semibold">
                  Rechoose Vibes
                </AppText>
              </Pressable>

              <Pressable
                onPress={() => {
                  if (mismatch) {
                    setMismatch(null);
                    navigateToReview(mismatch.placeIds);
                  }
                }}
                className="bg-primary flex-1 items-center rounded-xl px-0 py-3"
              >
                <AppText className="font-semibold text-white">Continue</AppText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Idle interstitial ── */}
      <Modal
        visible={showIdleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIdleModal(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'flex-end'
          }}
          onPress={() => setShowIdleModal(false)}
        >
          <Pressable
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: 28,
              gap: 20,
              alignItems: 'center'
            }}
            onPress={() => {}}
          >
            {/* Glowing icon */}
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: colors.brand.primary + '20',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Ionicons name="shuffle" size={34} color={colors.brand.primary} />
            </View>

            <View style={{ alignItems: 'center', gap: 6 }}>
              <AppText
                style={{
                  fontSize: 20,
                  fontWeight: '800',
                  color: colors.text.DEFAULT
                }}
              >
                {"Can't Decide?"}
              </AppText>
              <AppText
                style={{
                  fontSize: 14,
                  color: '#64748b',
                  textAlign: 'center',
                  lineHeight: 20
                }}
              >
                Let us pick something unexpected for you.{'\n'}
                You might just love it.
              </AppText>
            </View>

            <Animated.View
              style={{ width: '100%', transform: [{ scale: pulseAnim }] }}
            >
              <Pressable
                onPress={handleSurpriseMe}
                style={{
                  backgroundColor: colors.brand.primary,
                  borderRadius: 16,
                  paddingVertical: 16,
                  alignItems: 'center',
                  gap: 8,
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
              >
                <Ionicons name="shuffle-outline" size={20} color="white" />
                <AppText
                  style={{ color: 'white', fontWeight: '700', fontSize: 16 }}
                >
                  Surprise Me!
                </AppText>
              </Pressable>
            </Animated.View>

            <Pressable onPress={() => setShowIdleModal(false)}>
              <AppText style={{ color: '#94a3b8', fontSize: 13 }}>
                {"No thanks, I'll choose"}
              </AppText>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
