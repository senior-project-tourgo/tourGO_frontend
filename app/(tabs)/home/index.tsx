import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { Screen } from '@/components/Screen';
import { Place } from '@/features/place/place.types';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../../context/AuthContext';

export default function HomeScreen() {
  const [activePlaces, setActivePlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/places?active=true&limit=3`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }

        const data: Place[] = await response.json();
        console.log(data);

        setActivePlaces(data);
      } catch (error) {
        console.error('Failed to fetch places:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

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

        <Button
          title="Go to Gems"
          onPress={() => router.push('/(tabs)/home/gems')}
        />
      </View>
    </Screen>
  );
}
