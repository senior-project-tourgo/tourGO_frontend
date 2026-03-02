import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { Screen } from '@/components/Screen';
import { router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useActivePlaces } from '@/features/place/useActivePlaces';

export default function HomeScreen() {
  const { data: activePlaces, loading, error } = useActivePlaces(3);

  const { user } = useAuth();

  const username = user?.username ?? '';
  const formattedUsername = username[0].toUpperCase() + username.slice(1);

  if (error) {
    return (
      <Screen scroll={false}>
        <AppText className="text-lg font-semibold">
          Something went wrong
        </AppText>
        <AppText className="text-muted-foreground mt-2 text-center text-sm">
          {error.message}
        </AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppText variant="title">Namaste! {formattedUsername}</AppText>
      <AppText variant="subtitle">How are you doing today?</AppText>

      <View className="gap-6 pt-6">
        <Button
          title="Curate New Trip"
          onPress={() => router.push('/(tabs)/trip-generator')}
        />

        {/* Places list */}
        <View className="gap-3">
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            activePlaces?.map(place => (
              <PlaceCard
                key={place.placeId}
                place={place}
                onPress={() => router.push(`/places/${place.placeId}`)}
              />
            ))
          )}
        </View>

        <Button
          title="Go to Gems"
          onPress={() => router.push('/(tabs)/home/gems')}
        />
      </View>
    </Screen>
  );
}
