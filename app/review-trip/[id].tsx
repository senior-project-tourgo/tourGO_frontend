import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import { Map, MapRegion } from '@/components/Map';
import * as Location from 'expo-location';
import { ScrollView, View } from 'react-native';
import { HeaderWithBack } from '@/components/PageHeader';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { AppText } from '@/components/AppText';
import { placesMock } from '@/mock/places.mock';
import { tripPlacesMock } from '@/mock/tripplaces.mock';

export default function ReviewTripDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const places = useMemo(() => {
    const tripPlaces = tripPlacesMock
      .filter(tp => tp.tripId === id)
      .sort((a, b) => a.order - b.order);

    return tripPlaces
      .map(tp => placesMock.find(p => p.placeId === tp.placeId))
      .filter(Boolean);
  }, [id]);

  const [region, setRegion] = useState<MapRegion | null>(null);

  useEffect(() => {
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });
    }

    getLocation();
  }, []);

  if (!region) {
    return (
      <View className="flex-1 items-center justify-center">
        <AppText>Loading map...</AppText>
      </View>
    );
  }
  return (
    <View className="flex-1">
      <HeaderWithBack
        title="Review Your Trip"
        className="absolute z-10 bg-transparent pl-6 pt-16"
        backbg={true}
      />

      <Map region={region} />

      <ScrollView
        horizontal={true}
        className="absolute bottom-[3%] z-10 gap-3 px-6"
      >
        {places.map(place => (
          <PlaceCard
            key={place!.placeId}
            place={place!}
            onPress={() => router.push(`/places/${place!.placeId}`)}
            showCross={true}
          />
        ))}
      </ScrollView>
    </View>
  );
}
