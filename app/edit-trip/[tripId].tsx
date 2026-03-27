import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Map } from '@/components/Map';
import { HeaderWithBack } from '@/components/PageHeader';
import { NoPlaceCard } from '@/components/cards/variants/PlaceCard/NoPlaceCard';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { useEditableTrip } from '@/hooks/review-trip/useEditableTrip';
import { useReviewTripRegion } from '@/hooks/review-trip/useReviewTripRegion';
import { getPlacesByIds } from '@/features/place/placeById.api';
import { getTripById, updateTrip } from '@/services/trip.service';
import { pendingPlaceStore } from '@/stores/pendingPlaceStore';
import colors from '@/theme/colors';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { EditableTripPlace } from '@/hooks/review-trip/useEditableTrip';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TextInput,
  View
} from 'react-native';

export default function EditTripScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  const {
    places: editablePlaces,
    addPlace,
    removePlace,
    setInitialPlaces
  } = useEditableTrip([]);
  const { region } = useReviewTripRegion(editablePlaces);

  const [itineraryName, setItineraryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [focusCoordinate, setFocusCoordinate] = useState<
    { latitude: number; longitude: number } | undefined
  >(undefined);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        const item = viewableItems[0].item as EditableTripPlace;
        setFocusCoordinate({
          latitude: Number(item.place.location.lat),
          longitude: Number(item.place.location.lng)
        });
      }
    }
  ).current;

  // Load the trip + its places on mount
  useEffect(() => {
    if (!tripId) return;

    async function load() {
      try {
        const trip = await getTripById(tripId as string);
        setItineraryName(trip.itineraryName);

        const ids = [...trip.places]
          .sort((a, b) => a.order - b.order)
          .map(p => p.placeId);

        const places = await getPlacesByIds(ids);
        setInitialPlaces(places.map((place, i) => ({ place, order: i + 1 })));
      } catch (err: any) {
        Alert.alert('Error', err.message ?? 'Failed to load trip');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [tripId, setInitialPlaces]);

  // Pick up any place selected from the add-place screen
  useFocusEffect(
    useCallback(() => {
      const pending = pendingPlaceStore.get();
      if (pending) {
        addPlace(pending);
        pendingPlaceStore.clear();
      }
    }, [addPlace])
  );

  const handleSave = async () => {
    if (!tripId) return;

    if (!itineraryName.trim()) {
      Alert.alert('Validation', 'Trip name cannot be empty');
      return;
    }
    if (editablePlaces.length === 0) {
      Alert.alert('Validation', 'A trip must have at least one place');
      return;
    }

    try {
      setSaving(true);
      await updateTrip(tripId as string, {
        itineraryName: itineraryName.trim(),
        places: editablePlaces.map(p => ({
          placeId: p.place.placeId,
          order: p.order
        }))
      });
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !region) {
    return (
      <View className="flex-1 items-center justify-center bg-colors-surface-background">
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  return (
    <View className="relative flex-1">
      {/* Floating header */}
      <HeaderWithBack
        title="Edit Trip"
        className="absolute z-10 bg-transparent pl-6 pt-16"
        backBg
      />

      {/* Full-screen map */}
      <Map
        region={region}
        markers={editablePlaces.map((item, index) => ({
          id: item.place.placeId,
          latitude: Number(item.place.location.lat),
          longitude: Number(item.place.location.lng),
          title: `${index + 1}. ${item.place.placeName}`,
          pinColor: colors.brand.primary
        }))}
        focusCoordinate={focusCoordinate}
      />

      {/* Bottom panel */}
      <View className="absolute bottom-6 z-10 gap-4">
        {/* Editable trip name */}
        <View className="mx-4 rounded-2xl bg-colors-surface-background px-4 py-3 shadow-sm">
          <AppText
            variant="caption"
            className="mb-1"
            style={{ color: colors.brand.secondary }}
          >
            Trip Name
          </AppText>
          <TextInput
            value={itineraryName}
            onChangeText={setItineraryName}
            placeholder="Enter trip name"
            placeholderTextColor="#aaa"
            style={{
              fontFamily: 'Inter',
              fontSize: 16,
              color: colors.text.DEFAULT
            }}
          />
        </View>

        {/* Place cards */}
        <FlatList
          horizontal
          data={editablePlaces}
          keyExtractor={item => item.place.placeId}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          snapToInterval={353}
          decelerationRate="fast"
          snapToAlignment="start"
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          renderItem={({ item }) => (
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
          )}
          ListFooterComponent={
            <NoPlaceCard
              title="+ Add Place"
              subtitle="Find another spot"
              onPress={() =>
                router.push({
                  pathname: '/review-trip/add-place',
                  params: {
                    addedIds: editablePlaces.map(p => p.place.placeId).join(',')
                  }
                })
              }
            />
          }
        />

        {/* Save button */}
        <View className="flex w-[350px] self-center">
          <Button
            title={saving ? 'Saving…' : 'Save Changes'}
            onPress={handleSave}
            disabled={saving}
            isLoading={saving}
          />
        </View>
      </View>

      {saving && (
        <View className="absolute inset-0 items-center justify-center bg-black/10">
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}
