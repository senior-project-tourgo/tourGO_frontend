import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { VibeCard } from '@/components/cards/variants/VibeCard';
import { HeaderWithBack } from '@/components/PageHeader';
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
import { SafeAreaView } from 'react-native-safe-area-context';

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

  const toggleVibe = (id: string) =>
    setSelectedVibes(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );

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
      params: { placeIds, itineraryName: params.itineraryName }
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
        ),
        groupType: normalizeStringParam(params.groupType) || undefined,
        startLat: startLatRaw ? Number(startLatRaw) : undefined,
        startLng: startLngRaw ? Number(startLngRaw) : undefined,
        transportMode: (transportModeRaw as any) || undefined
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
      throw new Error(
        axiosError.response?.data?.message ||
          'Failed to generate recommendation'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-colors-surface-background">
      {/* Scrollable content */}
      <FlatList
        data={mockVibes}
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

      {/* Fixed bottom button */}
      <View className="mt-8 px-4 pb-24">
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
    </SafeAreaView>
  );
}
