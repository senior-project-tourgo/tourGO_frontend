import { HeaderWithBack } from '@/components/PageHeader';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { Screen } from '@/components/Screen';
import { router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useActivePlaces } from '@/features/place/useActivePlaces';
import { AppText } from '@/components/AppText';

export default function CommunityGemsScreen() {
  const { data: activePlaces, loading, error } = useActivePlaces(undefined);

  if (error) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <AppText className="text-lg font-semibold">
          Something went wrong
        </AppText>
        <AppText className="text-muted-foreground mt-2 text-center text-sm">
          {error?.message}
        </AppText>
      </View>
    );
  }

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
