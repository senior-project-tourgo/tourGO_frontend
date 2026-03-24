import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Map } from '@/components/Map';
import { HeaderWithBack } from '@/components/PageHeader';
import { NoPlaceCard } from '@/components/cards/variants/PlaceCard/NoPlaceCard';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { useEditableTrip } from '@/hooks/review-trip/useEditableTrip';
import { useReviewTripParams } from '@/hooks/review-trip/useReviewTripParams';
import { useReviewTripRegion } from '@/hooks/review-trip/useReviewTripRegion';
import { useSaveTrip } from '@/hooks/review-trip/useSaveTrip';
import { pendingPlaceStore } from '@/stores/pendingPlaceStore';
import colors from '@/theme/colors';
import { ActivityIndicator, Alert, FlatList, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { useCallback, useRef, useState } from 'react';
import type { EditableTripPlace } from '@/hooks/review-trip/useEditableTrip';

export default function ReviewTripScreen() {
  const {
    places: editablePlaces,
    addPlace,
    removePlace,
    setInitialPlaces
  } = useEditableTrip([]);

  const { finalItineraryName } = useReviewTripParams({ setInitialPlaces });

  const { region } = useReviewTripRegion(editablePlaces);

  const { saveTrip, loading } = useSaveTrip(editablePlaces, finalItineraryName);

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
        backBg
      />

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

      <View className="absolute bottom-6 z-10 gap-4">
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

        <View className="flex w-[350px] flex-row justify-center gap-4 self-center">
          <Button
            title={loading ? 'Saving...' : 'Save Plan'}
            className="flex-1 bg-colors-brand-secondary"
            onPress={() => saveTrip('saved')}
            disabled={loading}
          />

          <Button
            title={loading ? 'Starting...' : 'Start Trip'}
            className="flex-1"
            onPress={() => saveTrip('current')}
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
