import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList } from 'react-native';

import { Button } from '@/components/Button';
import { VibeCard } from '@/components/cards/variants/VibeCard';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { mockVibes } from '@/mock/vibes.mock';

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

  const handleContinue = async () => {
    try {
      setIsLoading(true);

      const data = await generateRecommendation({
        area: params.travelingArea,
        vibes: selectedVibes,
        numberOfPlaces: Number(params.numberOfPlaces)
      });

      router.push({
        pathname: '/review-trip',
        params: {
          recommendation: JSON.stringify(data),
          itineraryName: params.itineraryName,
          durationHours: params.durationHours,
          numberOfPeople: params.numberOfPeople,
          area: params.travelingArea
        }
      });
    } catch (err) {
      console.error(err);
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
