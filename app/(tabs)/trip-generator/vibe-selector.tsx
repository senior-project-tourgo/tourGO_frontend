import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList } from 'react-native';
import { Button } from '@/components/Button';
import { VibeCard } from '@/components/cards/variants/VibeCard';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { mockVibes } from '@/mock/vibes.mock';
import { generateRecommendation } from '@/services/trip.service';
import { PlaceLocation } from '@/features/place/place.types';
import { AxiosError } from 'axios';

export default function VibeSelectorScreen() {
  const router = useRouter();
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams();

  const toggleVibe = (id: string) => {
    setSelectedVibes(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  /**
   * Normalize expo-router params which can be string | string[]
   * Returns a finite number or throws an error
   */
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

  /**
   * Normalize string param from expo-router
   */
  const normalizeStringParam = (
    param: string | string[] | undefined
  ): string => {
    const value = Array.isArray(param) ? param[0] : param;
    return value || '';
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);

      const result = await generateRecommendation({
        area: normalizeStringParam(
          params.travelingArea
        ) as PlaceLocation['area'],
        vibes: selectedVibes,
        pace: normalizeStringParam(params.pace),
        itineraryName: normalizeStringParam(params.itineraryName),
        durationHours: normalizeNumberParam(
          params.durationHours,
          'durationHours'
        ),
        numberOfPeople: normalizeNumberParam(
          params.numberOfPeople,
          'numberOfPeople'
        )
      });

      router.push({
        pathname: '/review-trip',
        params: {
          placeIds: result.recommendedPlaces.map(p => p.placeId).join(','),
          itineraryName: params.itineraryName
        }
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message ||
          'Failed to generate recommendation'
      );
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
        contentContainerStyle={{
          paddingTop: 16,
          gap: 16,
          paddingBottom: 16
        }}
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
    </Screen>
  );
}
