import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { VibeCard } from '@/components/cards/variants/VibeCard';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { PaceValue } from '@/constants/paceOptions';
import { Area, Place } from '@/features/place/place.types';
import { mockVibes } from '@/mock/vibes.mock';
import { generateRecommendation } from '@/services/trip.service';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { AxiosError } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Modal, Pressable, View } from 'react-native';

type VibeMismatchData = {
  placeIds: string;
  matchCount: number;
  totalCount: number;
  unmatchedNames: string[];
};

export default function VibeSelectorScreen() {
  const router = useRouter();
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mismatch, setMismatch] = useState<VibeMismatchData | null>(null);
  const params = useLocalSearchParams();

  const toggleVibe = (id: string) => {
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

  const normalizeStringParam = (
    param: string | string[] | undefined
  ): string => {
    const value = Array.isArray(param) ? param[0] : param;
    return value || '';
  };

  const navigateToReview = (placeIds: string) => {
    router.push({
      pathname: '/review-trip',
      params: { placeIds, itineraryName: params.itineraryName }
    });
  };

  /** Check how many recommended places match at least one selected vibe */
  const checkVibeMismatch = (
    places: Place[],
    vibes: string[]
  ): { matchCount: number; unmatchedNames: string[] } => {
    let matchCount = 0;
    const unmatchedNames: string[] = [];
    for (const place of places) {
      const hasMatch = place.vibe.some(v => vibes.includes(v));
      if (hasMatch) {
        matchCount++;
      } else {
        unmatchedNames.push(place.placeName);
      }
    }
    return { matchCount, unmatchedNames };
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);

      const result = await generateRecommendation({
        area: normalizeStringParam(params.travelingArea) as Area,
        vibes: selectedVibes,
        pace: normalizeStringParam(params.pace) as PaceValue,
        itineraryName: normalizeStringParam(params.itineraryName),
        tripDate: normalizeStringParam(params.tripDate),
        startTime: normalizeStringParam(params.startTime),
        endTime: normalizeStringParam(params.endTime),
        numberOfPeople: normalizeNumberParam(
          params.numberOfPeople,
          'numberOfPeople'
        )
      });

      const placeIds = result.recommendedPlaces.map(p => p.placeId).join(',');
      const { matchCount, unmatchedNames } = checkVibeMismatch(
        result.recommendedPlaces,
        selectedVibes
      );

      if (matchCount < result.recommendedPlaces.length) {
        // Some places don't match — show feedback before proceeding
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
      throw new Error(
        axiosError.response?.data?.message ||
          'Failed to generate recommendation'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen scroll={false}>
      <HeaderWithBack title="Select Your Vibes" />

      <FlatList
        showsVerticalScrollIndicator={false}
        data={mockVibes}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 16 }}
        contentContainerStyle={{ paddingTop: 16, gap: 16, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <VibeCard
            title={item.title}
            image={item.image}
            selected={selectedVibes.includes(item.id)}
            onPress={() => toggleVibe(item.id)}
          />
        )}
      />

      <Button
        title="Generate Itinerary"
        onPress={handleContinue}
        disabled={selectedVibes.length === 0}
        isLoading={isLoading}
      />

      {/* ── Vibe mismatch feedback modal ── */}
      <Modal
        visible={!!mismatch}
        transparent
        animationType="fade"
        onRequestClose={() => setMismatch(null)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.55)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24
          }}
          onPress={() => setMismatch(null)}
        >
          <Pressable
            style={{
              width: '100%',
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: 24,
              gap: 16
            }}
            onPress={() => {}}
          >
            {/* Icon */}
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: colors.brand.neutrals,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={30}
                  color={colors.brand.primary}
                />
              </View>
            </View>

            {/* Headline */}
            <AppText variant="subtitle" className="text-center font-semibold">
              Partial Vibe Match
            </AppText>

            {/* Stats */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <View
                style={{
                  backgroundColor: '#f0fdf4',
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  alignItems: 'center'
                }}
              >
                <AppText
                  variant="subtitle"
                  className="font-semibold"
                  style={{ color: '#16a34a' }}
                >
                  {mismatch?.matchCount}
                </AppText>
                <AppText variant="caption" style={{ color: '#16a34a' }}>
                  matched
                </AppText>
              </View>
              <View
                style={{
                  backgroundColor: '#fff7ed',
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  alignItems: 'center'
                }}
              >
                <AppText
                  variant="subtitle"
                  className="font-semibold"
                  style={{ color: colors.brand.primary }}
                >
                  {(mismatch?.totalCount ?? 0) - (mismatch?.matchCount ?? 0)}
                </AppText>
                <AppText
                  variant="caption"
                  style={{ color: colors.brand.primary }}
                >
                  outside vibes
                </AppText>
              </View>
            </View>

            {/* Unmatched place names */}
            {mismatch && mismatch.unmatchedNames.length > 0 && (
              <View style={{ gap: 4 }}>
                <AppText variant="caption" style={{ color: '#64748b' }}>
                  These places don&apos;t match your selected vibes:
                </AppText>
                {mismatch.unmatchedNames.map(name => (
                  <View
                    key={name}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <Ionicons
                      name="location-outline"
                      size={13}
                      color="#94a3b8"
                    />
                    <AppText variant="caption" style={{ color: '#475569' }}>
                      {name}
                    </AppText>
                  </View>
                ))}
              </View>
            )}

            <AppText
              variant="caption"
              className="text-center"
              style={{ color: '#94a3b8' }}
            >
              You can continue with this mix or go back and pick different
              vibes.
            </AppText>

            {/* Actions */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => setMismatch(null)}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: colors.brand.primary,
                  paddingVertical: 12,
                  alignItems: 'center'
                }}
              >
                <AppText
                  className="font-semibold"
                  style={{ color: colors.brand.primary }}
                >
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
                style={{
                  flex: 1,
                  borderRadius: 12,
                  backgroundColor: colors.brand.primary,
                  paddingVertical: 12,
                  alignItems: 'center'
                }}
              >
                <AppText className="font-semibold" style={{ color: '#fff' }}>
                  Continue
                </AppText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
