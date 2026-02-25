import { useState } from 'react';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';

import { Screen } from '@/components/Screen';
import { HeaderWithBack } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { VibeCard } from '@/components/cards/variants/VibeCard';
import { mockVibes } from '@/mock/vibes.mock';
import { generateTrip } from '@/services/trip.service';

export default function VibeSelectorScreen() {
  const router = useRouter();
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleVibe = (id: string) => {
    setSelectedVibes(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);

      // 1️⃣ Call simulated backend
      const tripId = await generateTrip('usr_001');

      // 2️⃣ Navigate to review page
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
