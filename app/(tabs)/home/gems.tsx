import { AppText } from '@/components/AppText';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { Screen } from '@/components/Screen';
import { placesMock } from '@/mock/places.mock';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function CommunityGemsScreen() {
  const activePlaces = placesMock.filter(place => place.isActive);

  return (
    <Screen>
      <AppText className="text-center font-semibold" variant="heading24">
        Community-vetted Gems
      </AppText>

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
