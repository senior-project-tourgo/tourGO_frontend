import { HeaderWithBack } from '@/components/PageHeader';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { Screen } from '@/components/Screen';
import { router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useActivePlaces } from '@/features/place/useActivePlaces';

export default function CommunityGemsScreen() {
  const { data: activePlaces, loading } = useActivePlaces(undefined);

  return (
    <Screen>
      <HeaderWithBack title="Community-vetted Gems" />

      <View className="gap-3">
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          activePlaces.map(place => (
            <PlaceCard
              key={place.placeId}
              place={place}
              onPress={() => router.push(`/places/${place.placeId}`)}
            />
          ))
        )}
      </View>
    </Screen>
  );
}
