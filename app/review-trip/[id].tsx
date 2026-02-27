import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import { Map, MapRegion } from '@/components/Map';
import * as Location from 'expo-location';
import { ScrollView, View, Alert } from 'react-native';
import { HeaderWithBack } from '@/components/PageHeader';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { AppText } from '@/components/AppText';
import { placesMock } from '@/mock/places.mock';
import { tripPlacesMock } from '@/mock/tripplaces.mock';
import { EditableTripPlace, useEditableTrip } from '@/hooks/useEditableTrip';
import { Button } from '@/components/Button';
import { NoPlaceCard } from '@/components/cards/variants/PlaceCard/NoPlaceCard';

export default function ReviewTripDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const initialEditablePlaces = useMemo(() => {
    const tripPlaces = tripPlacesMock
      .filter(tp => tp.tripId === id)
      .sort((a, b) => a.order - b.order);

    return tripPlaces
      .map((tp, index) => {
        const place = placesMock.find(p => p.placeId === tp.placeId);
        if (!place) return null;

        return {
          place,
          order: index + 1
        };
      })
      .filter(Boolean) as EditableTripPlace[];
  }, [id]);
  const { places, removePlace } = useEditableTrip(initialEditablePlaces);

  const [region, setRegion] = useState<MapRegion | null>(null);

  useEffect(() => {
    async function initializeRegion() {
      if (places.length > 0) {
        setRegion({
          latitude: Number(places[0].place.location.lat),
          longitude: Number(places[0].place.location.lng),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        });
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Fallback region when location permission is denied
        setRegion({
          latitude: 0,
          longitude: 0,
          latitudeDelta: 60,
          longitudeDelta: 60
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });
    }

    initializeRegion();
  }, [places]);

  if (!region) {
    return (
      <View className="flex-1 items-center justify-center">
        <AppText>Loading map...</AppText>
      </View>
    );
  }
  return (
    <View className="relative flex-1">
      <HeaderWithBack
        title="Review Your Trip"
        className="absolute z-10 bg-transparent pl-6 pt-16"
        backbg={true}
      />

      <Map
        region={region}
        markers={places.map(item => ({
          latitude: Number(item.place.location.lat),
          longitude: Number(item.place.location.lng),
          title: item.place.placeName
        }))}
      />

      <View className="absolute bottom-6 z-10 gap-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 8
          }}
        >
          {places.map((item, index) => (
            <View
              key={item.place.placeId}
              style={{ marginRight: index === places.length - 1 ? 0 : 12 }}
            >
              <PlaceCard
                place={item.place}
                onPress={() => router.push(`/places/${item.place.placeId}`)}
                showCross
                onPressCross={place => {
                  if (places.length === 1) {
                    Alert.alert(
                      'Cannot Remove',
                      'A trip must have at least one place😕'
                    );
                    return;
                  }
                  removePlace(place.placeId);
                }}
              />
            </View>
          ))}
          <NoPlaceCard
            title="+ Add Place"
            subtitle="Find another spot"
            onPress={() => router.push('/review-trip/add-place')}
          />
        </ScrollView>
        <View className="flex w-[350px] flex-row justify-center gap-4 self-center">
          <Link href="/(tabs)/trip" asChild>
            <Button
              title="Save Plan"
              className="flex-1 bg-colors-brand-secondary"
            />
          </Link>
          <Link href="/during-trip" asChild>
            <Button title="Start Trip" className="flex-1" />
          </Link>
        </View>
      </View>
    </View>
  );
}
