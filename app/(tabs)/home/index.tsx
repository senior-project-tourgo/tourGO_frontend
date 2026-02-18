import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { Screen } from '@/components/Screen';
import { placesMock } from '@/mock/places.mock';
import { router } from 'expo-router';
import { View } from 'react-native';
import { useAuth } from '../../../context/AuthContext';

export default function HomeScreen() {
  const activePlaces = placesMock.filter(place => place.isActive).slice(0, 3);
  const { user } = useAuth();

  const username = user?.username ?? '';
  const formattedUsername =
    username.charAt(0).toUpperCase() + username.slice(1);

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
          {activePlaces.map(place => (
            <PlaceCard
              key={place.placeId}
              place={place}
              onPress={() => router.push(`/places/${place.placeId}`)}
            />
          ))}
        </View>

        <Button
          title="Go to Gems"
          onPress={() => router.push('/(tabs)/home/gems')}
        />
      </View>
    </Screen>
  );
}
