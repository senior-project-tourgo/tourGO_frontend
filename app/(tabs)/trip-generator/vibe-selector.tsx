import { useState } from 'react';
import { FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/Screen';
import { HeaderWithBack } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { VibeCard } from '@/components/cards/variants/VibeCard';
import { mockVibes } from '@/mock/vibes.mock';
import { generateTrip } from '@/services/trip.service';
import type { VibeId } from '@/features/vibe/vibe.types';

export default function VibeSelectorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedVibes, setSelectedVibes] = useState<VibeId[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleVibe = (id: VibeId) => {
    setSelectedVibes(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);

      const tripId = await generateTrip('usr_001', {
        area: params.travelingArea as
          | 'Kathmandu'
          | 'Pokhara'
          | 'Bhaktapur'
          | 'Lalitpur',
        vibes: selectedVibes,
        numberOfPlaces: Number(params.numberOfPlaces),
        itineraryName: params.itineraryName as string,
        budgetLevel: Number(params.budgetLevel),
        durationHours: Number(params.durationHours),
        numberOfPeople: Number(params.numberOfPeople)
      });

      router.push({
        pathname: '/review-trip/[id]',
        params: { id: tripId }
      });
    } catch (error) {
      console.error('Failed to generate trip:', error);
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
