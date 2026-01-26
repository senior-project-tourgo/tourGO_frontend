import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { tripsMock } from '@/mock/trips.mock';
import { tripPlacesMock } from '@/mock/tripplaces.mock';
import { placesMock } from '@/mock/places.mock';

export default function TripsDetails() {
  const { id } = useLocalSearchParams();
  const trips = tripsMock.find(trip => trip.tripId === id);

  if (!trips) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-lg font-semibold">Trips not found 😢</Text>
      </View>
    );
  }

  const tripPlaces = tripPlacesMock.find(
    tripplace => tripplace.tripPlaceId === trips.tripId
  );

  const places = placesMock.filter(place =>
    place.placeId.includes(tripPlaces.tripPlaceId)
  );
  // const tripPlaces = tripPlacesMock.filter(tripplace =>
  //   tripplace.tripPlaceId.includes(trips.tripId)
  // );
  return (
    <View className="flex-1 items-center justify-center bg-background">
      {tripPlaces.map(tripplace => (
        <View key={trip.rewardId} className="mt-3 rounded-xl border p-4">
          <Text className="font-semibold">{reward.rewardName}</Text>
          <Text className="text-muted-foreground mt-1 text-sm">
            {reward.rewardDescription}
          </Text>
        </View>
      ))}
    </View>
  );
}
