import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { CenteredLoading } from '@/components/CenteredLoading';
import { Map } from '@/components/Map';
import type { MapRoute } from '@/components/Map';
import { HeaderWithBack } from '@/components/PageHeader';
import { NoPlaceCard } from '@/components/cards/variants/PlaceCard/NoPlaceCard';
import { PlaceCard } from '@/components/cards/variants/PlaceCard/PlaceCard';
import { useEditableTrip } from '@/hooks/review-trip/useEditableTrip';
import { useReviewTripParams } from '@/hooks/review-trip/useReviewTripParams';
import { useReviewTripRegion } from '@/hooks/review-trip/useReviewTripRegion';
import { useSaveTrip } from '@/hooks/review-trip/useSaveTrip';
import { pendingPlaceStore } from '@/stores/pendingPlaceStore';
import {
  fetchRouteSegment,
  type RouteSegment
} from '@/services/directions.service';
import colors from '@/theme/colors';
import { ActivityIndicator, Alert, FlatList, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { EditableTripPlace } from '@/hooks/review-trip/useEditableTrip';

export default function ReviewTripScreen() {
  const {
    places: editablePlaces,
    addPlace,
    removePlace,
    setInitialPlaces
  } = useEditableTrip([]);

  const { finalItineraryName, startCoords, startLabel } = useReviewTripParams({
    setInitialPlaces
  });

  const { region } = useReviewTripRegion(editablePlaces);

  const { saveTrip, loading } = useSaveTrip(
    editablePlaces,
    finalItineraryName,
    startCoords,
    startLabel
  );

  const [focusCoordinate, setFocusCoordinate] = useState<
    { latitude: number; longitude: number } | undefined
  >(undefined);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);

  // ✅ Default Kathmandu location (fallback only)
  const DEFAULT_REGION = {
    latitude: 27.7061,
    longitude: 85.3148,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05
  };

  // Fetch route segments whenever places or startCoords change
  useEffect(() => {
    if (editablePlaces.length === 0) return;

    const waypoints: { lat: number; lng: number }[] = [
      ...(startCoords
        ? [{ lat: startCoords.latitude, lng: startCoords.longitude }]
        : []),
      ...editablePlaces.map(p => ({
        lat: Number(p.place.location.lat),
        lng: Number(p.place.location.lng)
      }))
    ];

    if (waypoints.length < 2) return;

    Promise.all(
      waypoints
        .slice(0, -1)
        .map((from, i) => fetchRouteSegment(from, waypoints[i + 1], 'driving'))
    )
      .then(setRouteSegments)
      .catch(() => {});
  }, [editablePlaces, startCoords]);

  // Convert segments to MapRoute, marking the one leading to the focused card as solid
  const solidSegmentIndex = startCoords ? focusedIndex : focusedIndex - 1;
  const mapRoutes: MapRoute[] = routeSegments.map((seg, i) => ({
    coords: seg.coords,
    solid: i === solidSegmentIndex
  }));

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        const item = viewableItems[0].item as EditableTripPlace;
        const index = viewableItems[0].index ?? 0;
        setFocusedIndex(index);
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
    return <CenteredLoading message="Loading map…" variant="map" />;
  }

  return (
    <View className="relative flex-1">
      <HeaderWithBack
        title="Review Your Trip"
        className="absolute z-10 bg-transparent pl-6 pt-16"
        backBg
      />

      <Map
        region={region ?? DEFAULT_REGION}
        markers={[
          ...(startCoords
            ? [
                {
                  id: 'starting-point',
                  latitude: startCoords.latitude,
                  longitude: startCoords.longitude,
                  title: 'Starting Point',
                  pinColor: '#22c55e'
                }
              ]
            : []),
          ...editablePlaces.map((item, index) => ({
            id: item.place.placeId,
            latitude: Number(item.place.location.lat),
            longitude: Number(item.place.location.lng),
            title: `${index + 1}. ${item.place.placeName}`,
            pinColor: colors.brand.primary
          }))
        ]}
        focusCoordinate={focusCoordinate}
        routes={mapRoutes}
      />

      <View className="absolute bottom-6 z-10 gap-4">
        <FlatList
          horizontal
          data={editablePlaces}
          keyExtractor={item => item.place.placeId}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          ListHeaderComponent={
            startCoords ? (
              <View className="h-60 w-40 items-center justify-center rounded-2xl bg-white shadow-sm">
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#dcfce7',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}
                >
                  <Ionicons name="navigate" size={20} color="#22c55e" />
                </View>
                <AppText
                  className="text-center font-semibold"
                  style={{ color: '#22c55e' }}
                >
                  Start
                </AppText>
                {startLabel && (
                  <AppText
                    variant="muted"
                    className="text-center"
                    style={{ fontSize: 11, marginTop: 4, paddingHorizontal: 8 }}
                    numberOfLines={3}
                  >
                    {startLabel}
                  </AppText>
                )}
              </View>
            ) : null
          }
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
