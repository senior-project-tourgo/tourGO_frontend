import { useState } from 'react';
import { FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Screen } from '@/components/Screen';
import { HeaderWithBack } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { VibeCard } from '@/components/cards/variants/VibeCard';
import { mockVibes } from '@/mock/vibes.mock';

export default function VibeSelectorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);

  const toggleVibe = (id: string) => {
    setSelectedVibes(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    router.push({
      pathname: '/(tabs)/trip-generator/review-trip',
      params: {
        ...params,
        vibes: selectedVibes
      }
    });
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
          paddingBottom: 16 // space for button
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
      />
    </Screen>
  );
}
