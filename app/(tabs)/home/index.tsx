import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { Screen } from '@/components/Screen';
import { placesMock } from '@/mock/places.mock';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function HomeScreen() {
  const activePlaces = placesMock.filter(place => place.isActive).slice(0, 3);

  return (
    <Screen>
      <View className="flex-1 gap-4">
        <AppText className="text-lg font-semibold">Home</AppText>
        <Button
          title="Curate New Trip"
          onPress={() => router.push('/(tabs)/trip-generator')}
        />

        {/* Places list */}
        <View className="gap-3">
          {activePlaces.map(place => (
            <PlaceCard
              key={place.placeId}
              place={place}
              onPress={() => router.push(`/places/${place.placeId}`)}
            />
          ))}

          <Button
            title="Go to Gems"
            onPress={() => router.push('/(tabs)/home/gems')}
          />
        </View>
      </View>
    </Screen>
  );
}
