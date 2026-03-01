import { HeaderWithBack } from '@/components/PageHeader';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { Screen } from '@/components/Screen';
import { placesMock } from '@/mock/places.mock';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function CommunityGemsScreen() {
  const activePlaces = placesMock.filter(place => place.isActive);

  return (
    <Screen>
      <HeaderWithBack title="Community-vetted Gems" />

      <View className="gap-3">
        {activePlaces.map(place => (
          <PlaceCard
            key={place.placeId}
            place={place}
            onPress={() => router.push(`/places/${place.placeId}`)}
          />
        ))}
      </View>
    </Screen>
  );
}
