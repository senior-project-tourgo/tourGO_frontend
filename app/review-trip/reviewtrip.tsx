import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Map, MapRegion } from '@/components/Map';
import { HeaderWithBack } from '@/components/PageHeader';
import { NoPlaceCard } from '@/components/cards/variants/PlaceCard/NoPlaceCard';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { Place } from '@/features/place/place.types';
import { useEditableTrip } from '@/hooks/useEditableTrip';
import { createTrip } from '@/services/trip.service';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';

export default function ReviewTripScreen() {
  const { places, itineraryName } = useLocalSearchParams<{
    places: string;
    itineraryName: string;
  }>();

  /** normalize router string param (handles string | string[] | undefined) */
  const normalizeStringParam = (
    param: string | string[] | undefined
  ): string => {
    const value = Array.isArray(param) ? param[0] : param;
    return value || '';
  };

  const cleanedItineraryName = normalizeStringParam(itineraryName);
  const defaultItineraryName = 'My Trip';
  // if the provided name is empty use a fallback
  const finalItineraryName =
    cleanedItineraryName.trim() || defaultItineraryName;

  const [region, setRegion] = useState<MapRegion | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    places: editablePlaces,
    removePlace,
    setInitialPlaces
  } = useEditableTrip([]);

  /* -------------------------------------------------- */
  /* 1️⃣ Parse incoming places from router              */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (!places) return;

    try {
      const parsed: Place[] = JSON.parse(places as string);

      const formatted = parsed.map((place, index) => ({
        place,
        order: index + 1
      }));

      setInitialPlaces(formatted);
    } catch (error) {
      console.error('Failed to parse places:', error);
    }
  }, [places]);

  /* -------------------------------------------------- */
  /* 2️⃣ Initialize map region                         */
  /*
   * We use a single effect, but it has two responsibilities:
   * 1. immediately center on the first place when any are available
   * 2. otherwise fall back to the user's current location
   *
   * The original implementation triggered a race between the
   * async location request and a later update to editablePlaces.
   * if the permission call resolved after the place list arrived,
   * it would overwrite the region and the map would zoom to the
   * wrong spot until a manual refresh. The fix uses a cancellation
   * flag so only the _latest_ invocation may update state.
   */
  useEffect(() => {
    let active = true;

    async function initializeRegion() {
      // if we already have at least one place, center on the first marker
      if (editablePlaces.length > 0) {
        setRegion({
          latitude: Number(editablePlaces[0].place.location.lat),
          longitude: Number(editablePlaces[0].place.location.lng),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        });
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!active) return; // cancelled by cleanup

      if (status !== 'granted') {
        if (active) {
          setRegion({
            latitude: 0,
            longitude: 0,
            latitudeDelta: 60,
            longitudeDelta: 60
          });
        }
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      if (!active) return;

      // only apply the user location when there still aren't any places
      if (editablePlaces.length === 0 && active) {
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        });
      }
    }

    initializeRegion();

    return () => {
      active = false;
    };
  }, [editablePlaces]);

  /* -------------------------------------------------- */
  /* 3️⃣ Save / Start Trip                             */
  /* -------------------------------------------------- */
  const handleSave = async (status: 'saved' | 'current') => {
    if (editablePlaces.length === 0) {
      Alert.alert('Trip must contain at least one place');
      return;
    }

    // use default name if none provided
    const itineraryToSave = finalItineraryName;

    try {
      setLoading(true);

      await createTrip({
        itineraryName: itineraryToSave,
        places: editablePlaces.map(p => ({
          placeId: p.place.placeId, // ✅ correct id
          order: p.order
        })),
        status
      });

      if (status === 'current') {
        router.replace('/during-trip');
      } else {
        router.replace('/(tabs)/trip');
      }
    } catch (error) {
      console.error('Failed to save trip:', error);
      Alert.alert('Error', 'Failed to save trip');
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------- */
  /* 4️⃣ Loading state for map                         */
  /* -------------------------------------------------- */
  if (!region) {
    return (
      <View className="flex-1 items-center justify-center">
        <AppText>Loading map...</AppText>
      </View>
    );
  }

  /* -------------------------------------------------- */
  /* 5️⃣ UI (UNCHANGED DESIGN)                         */
  /* -------------------------------------------------- */
  return (
    <View className="relative flex-1">
      <HeaderWithBack
        title="Review Your Trip"
        className="absolute z-10 bg-transparent pl-6 pt-16"
        backBg={true}
      />

      <Map
        region={region}
        markers={editablePlaces.map(item => ({
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
          {editablePlaces.map((item, index) => (
            <View
              key={item.place.placeId}
              style={{
                marginRight: index === editablePlaces.length - 1 ? 0 : 12
              }}
            >
              <PlaceCard
                place={item.place}
                onPress={() => router.push(`/places/${item.place.placeId}`)}
                showCross
                onPressCross={() => {
                  if (editablePlaces.length === 1) {
                    Alert.alert(
                      'Cannot Remove',
                      'A trip must have at least one place 😕'
                    );
                    return;
                  }

                  removePlace(item.place.placeId);
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
          <Button
            title={loading ? 'Saving...' : 'Save Plan'}
            className="flex-1 bg-colors-brand-secondary"
            onPress={() => handleSave('saved')}
            disabled={loading}
          />

          <Button
            title={loading ? 'Starting...' : 'Start Trip'}
            className="flex-1"
            onPress={() => handleSave('current')}
            disabled={loading}
          />
        </View>
      </View>

      {loading && (
        <View className="absolute inset-0 items-center justify-center bg-black/10">
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}
