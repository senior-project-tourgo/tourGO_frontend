import { AppText } from '@/components/AppText';
import { CenteredLoading } from '@/components/CenteredLoading';
import { DuringTripMapHeader } from '@/components/during-trip/DuringTripMapHeader';
import { DuringTripPlaceDetailSheet } from '@/components/during-trip/DuringTripPlaceDetailSheet';
import type { PlaceWithPromos } from '@/components/during-trip/DuringTripPlaceDetailSheet';
import { DuringTripTransportProgress } from '@/components/during-trip/DuringTripTransportProgress';
import { JourneyStepDots } from '@/components/during-trip/JourneyStepDots';
import {
  StampCelebrationOverlay,
  type StampModalData
} from '@/components/during-trip/StampCelebrationOverlay';
import { EndTripConfirmModal } from '@/components/EndTripConfirmModal';
import { DuringTripPlaceCard } from '@/components/cards/variants/PlaceCard/DuringTripPlaceCard';
import { getPlacesByIds } from '@/features/place/placeById.api';
import type { Trip } from '@/features/trip/trip.types';
import {
  getAllPromotions,
  type ApiPromotion
} from '@/services/promotion.service';
import {
  checkIn as apiCheckIn,
  completeTrip,
  getTripById
} from '@/services/trip.service';
import {
  fetchRouteSegment,
  type TransportMode,
  type RouteSegment
} from '@/services/directions.service';
import colors from '@/theme/colors';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, FlatList, PanResponder, View } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';

export default function DuringTripScreen() {
  const { tripId, startLat, startLng, startLabel } = useLocalSearchParams<{
    tripId: string;
    startLat: string;
    startLng: string;
    startLabel: string;
  }>();

  const startCoords =
    startLat && startLng
      ? { latitude: parseFloat(startLat), longitude: parseFloat(startLng) }
      : null;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [placeData, setPlaceData] = useState<PlaceWithPromos[]>([]);
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [stampModal, setStampModal] = useState<StampModalData | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceWithPromos | null>(
    null
  );
  const [transportMode, setTransportMode] = useState<TransportMode>('driving');
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userRouteSegment, setUserRouteSegment] = useState<RouteSegment | null>(
    null
  );
  // Cache: key = `${fromPlaceId}-${toPlaceId}-${mode}` → full segment (avoids re-fetching on mode switch)
  const routeCache = useRef<Record<string, RouteSegment>>({});

  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<FlatList<PlaceWithPromos>>(null);
  const stampScale = useRef(new Animated.Value(0.5)).current;
  const stampOpacity = useRef(new Animated.Value(0)).current;
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Bottom sheet animation — card slides up from the bottom
  const sheetTranslateY = useRef(new Animated.Value(700)).current;

  // PanResponder for drag-to-dismiss on the handle
  const sheetPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderMove: (_, g) => {
        // Only allow dragging downward
        if (g.dy > 0) sheetTranslateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 60 || g.vy > 0.5) {
          // Fling threshold met — dismiss
          Animated.timing(sheetTranslateY, {
            toValue: 700,
            duration: 220,
            useNativeDriver: true
          }).start(() => setSelectedPlace(null));
        } else {
          // Snap back
          Animated.spring(sheetTranslateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 80,
            friction: 10
          }).start();
        }
      }
    })
  ).current;

  // Stable refs for FlatList viewability — must not change across renders
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        const item = viewableItems[0].item as PlaceWithPromos;
        mapRef.current?.animateToRegion(
          {
            latitude: item.place.location.lat,
            longitude: item.place.location.lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015
          },
          400
        );
      }
    }
  ).current;

  const load = useCallback(async () => {
    if (!tripId) return;
    try {
      const [fetchedTrip, locationPerm] = await Promise.all([
        getTripById(tripId),
        Location.requestForegroundPermissionsAsync()
      ]);

      const devLat = process.env.EXPO_PUBLIC_DEV_LATITUDE;
      const devLng = process.env.EXPO_PUBLIC_DEV_LONGITUDE;

      if (devLat && devLng) {
        setUserLocation({
          latitude: parseFloat(devLat),
          longitude: parseFloat(devLng)
        });
      } else if (locationPerm.status === 'granted') {
        try {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced
          });
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
        } catch {
          // Location unavailable — skip user→first segment
        }
      }

      setTrip(fetchedTrip);

      const placeIds = [...fetchedTrip.places]
        .sort((a, b) => a.order - b.order)
        .map(p => p.placeId);

      const places = await getPlacesByIds(placeIds);

      const allPromos = await getAllPromotions().catch(
        () => [] as ApiPromotion[]
      );
      const promosByPlace = allPromos.reduce((acc, p) => {
        acc.set(p.placeId, [...(acc.get(p.placeId) ?? []), p]);
        return acc;
      }, new Map<string, ApiPromotion[]>());

      const withPromos: PlaceWithPromos[] = places.map(place => ({
        place,
        promotions: promosByPlace.get(place.placeId) ?? []
      }));

      setPlaceData(withPromos);

      if (places.length > 0) {
        setRegion({
          latitude: places[0].location.lat,
          longitude: places[0].location.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        });
      }
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to load trip');
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    load();
  }, [load]);

  // Fetch real road routes whenever placeData or transport mode changes
  useEffect(() => {
    if (placeData.length < 2 || !trip) return;

    const ordered = [...placeData].sort((a, b) => {
      const aO =
        trip.places.find(p => p.placeId === a.place.placeId)?.order ?? 0;
      const bO =
        trip.places.find(p => p.placeId === b.place.placeId)?.order ?? 0;
      return aO - bO;
    });

    const fetchAll = async () => {
      const segments = await Promise.all(
        ordered.slice(0, -1).map(async (pd, i) => {
          const from = pd.place.location;
          const to = ordered[i + 1].place.location;
          const cacheKey = `${pd.place.placeId}-${ordered[i + 1].place.placeId}-${transportMode}`;

          if (routeCache.current[cacheKey]) {
            return routeCache.current[cacheKey];
          }

          const segment = await fetchRouteSegment(from, to, transportMode);
          routeCache.current[cacheKey] = segment;
          return segment;
        })
      );
      // Only update when all segments are ready — old routes stay visible until then
      setRouteSegments(segments);
    };

    fetchAll();
    // routeCache.current is a stable ref, safe to omit
  }, [placeData, transportMode, trip]);

  // Fetch route from user's current location to the first place
  useEffect(() => {
    if (!userLocation || placeData.length === 0 || !trip) return;

    const ordered = [...placeData].sort((a, b) => {
      const aO =
        trip.places.find(p => p.placeId === a.place.placeId)?.order ?? 0;
      const bO =
        trip.places.find(p => p.placeId === b.place.placeId)?.order ?? 0;
      return aO - bO;
    });

    const firstPlace = ordered[0];
    if (!firstPlace) return;

    const cacheKey = `user-${firstPlace.place.placeId}-${transportMode}`;
    if (routeCache.current[cacheKey]) {
      setUserRouteSegment(routeCache.current[cacheKey]);
      return;
    }

    const from = { lat: userLocation.latitude, lng: userLocation.longitude };
    fetchRouteSegment(from, firstPlace.place.location, transportMode)
      .then(segment => {
        routeCache.current[cacheKey] = segment;
        setUserRouteSegment(segment);
      })
      .catch(() => setUserRouteSegment(null));
    // routeCache.current is a stable ref, safe to omit
  }, [userLocation, placeData, trip, transportMode]);

  useEffect(() => {
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, []);

  // Open bottom sheet whenever a place is selected
  useEffect(() => {
    if (selectedPlace) {
      sheetTranslateY.setValue(700);
      Animated.spring(sheetTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    }
    // sheetTranslateY is a stable Animated.Value ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlace]);

  const closeSheet = () => {
    Animated.timing(sheetTranslateY, {
      toValue: 700,
      duration: 240,
      useNativeDriver: true
    }).start(() => setSelectedPlace(null));
  };

  const showStamp = (data: StampModalData) => {
    setStampModal(data);
    stampScale.setValue(0.5);
    stampOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(stampScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 6
      }),
      Animated.timing(stampOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();

    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    dismissTimer.current = setTimeout(() => {
      Animated.timing(stampOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => setStampModal(null));
    }, 2500);
  };

  const handleCheckIn = async (placeId: string) => {
    if (!trip || !tripId) return;
    try {
      setCheckingInId(placeId);
      const result = await apiCheckIn(tripId, placeId);
      setTrip(result.trip);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Scroll to the next card after check-in
      const ordered = [...placeData].sort((a, b) => {
        const aO =
          trip.places.find(p => p.placeId === a.place.placeId)?.order ?? 0;
        const bO =
          trip.places.find(p => p.placeId === b.place.placeId)?.order ?? 0;
        return aO - bO;
      });
      const currentIndex = ordered.findIndex(
        pd => pd.place.placeId === placeId
      );
      if (currentIndex !== -1 && currentIndex + 1 < ordered.length) {
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true
        });
      }

      const placeName =
        placeData.find(pd => pd.place.placeId === placeId)?.place.placeName ??
        'Place';

      showStamp({
        placeName,
        visitCount: result.stamp?.visitCount ?? 1,
        isNew: result.stamp?.isNew ?? true
      });
    } catch (err: any) {
      Alert.alert('Check-in Failed', err.message ?? 'Could not check in');
    } finally {
      setCheckingInId(null);
    }
  };

  const doEndTrip = async () => {
    if (!tripId) return;
    setShowEndModal(false);
    try {
      setEnding(true);
      const summary = await completeTrip(tripId as string);
      router.replace({
        pathname: '/trip-summary',
        params: {
          tripId: tripId as string,
          summary: JSON.stringify({
            tripName: trip?.itineraryName ?? 'Trip',
            xpEarned: summary.xpEarned,
            totalXp: summary.totalXp,
            badge: summary.badge,
            visitedCount: summary.visitedCount,
            totalPlaces: trip?.places.length ?? 0,
            totalDuration: summary.totalDuration
          }),
          visitedCoords: JSON.stringify(
            placeData
              .filter(pd =>
                summary.trip.places.find(
                  p => p.placeId === pd.place.placeId && p.visitedAt
                )
              )
              .map(pd => ({
                lat: pd.place.location.lat,
                lng: pd.place.location.lng
              }))
          )
        }
      });
    } catch (err: any) {
      console.error('End trip failed:', err?.message ?? err);
      Alert.alert(
        'Unable to complete trip',
        'Something went wrong. Please try again.'
      );
    } finally {
      setEnding(false);
    }
  };

  if (loading || !region) {
    return <CenteredLoading message="Loading trip…" />;
  }

  const visitedIds = new Set(
    trip?.places.filter(p => p.visitedAt).map(p => p.placeId) ?? []
  );
  const visitedCount = visitedIds.size;
  const totalCount = trip?.places.length ?? 0;
  const tripXp = trip?.xpEarned ?? 0;
  const progress = totalCount > 0 ? visitedCount / totalCount : 0;

  // Sort placeData by trip order
  const sortedPlaceData = [...placeData].sort((a, b) => {
    const aOrder =
      trip?.places.find(p => p.placeId === a.place.placeId)?.order ?? 0;
    const bOrder =
      trip?.places.find(p => p.placeId === b.place.placeId)?.order ?? 0;
    return aOrder - bOrder;
  });

  // Next place in journey = first unvisited place in order
  const nextUnvisitedId =
    sortedPlaceData.find(pd => !visitedIds.has(pd.place.placeId))?.place
      .placeId ?? null;

  const markers = sortedPlaceData.map(({ place }) => ({
    latitude: place.location.lat,
    longitude: place.location.lng,
    title: place.placeName,
    placeId: place.placeId,
    visited: visitedIds.has(place.placeId),
    isCurrent: place.placeId === nextUnvisitedId
  }));

  // Precompute per-segment styles so Polylines and Markers can be rendered in
  // separate flat passes — Fragment wrapping inside MapView prevents react-native-maps
  // from recognising Polylines at the native layer in some versions.
  const segmentStyles = routeSegments.map((_, i) => {
    const fromPlace = sortedPlaceData[i]?.place;
    const toPlace = sortedPlaceData[i + 1]?.place;
    const fromVisited = visitedIds.has(fromPlace?.placeId);
    const toVisited = visitedIds.has(toPlace?.placeId);
    const isGrey = toVisited;
    const isNext = fromVisited && !toVisited;
    return {
      strokeColor: isGrey ? '#94a3b8' : colors.brand.primary,
      strokeWidth: isNext ? 4 : 3,
      lineDashPattern: (!isGrey && !isNext ? [5, 8] : undefined) as
        | number[]
        | undefined,
      midLat:
        fromPlace && toPlace
          ? (fromPlace.location.lat + toPlace.location.lat) / 2
          : 0,
      midLng:
        fromPlace && toPlace
          ? (fromPlace.location.lng + toPlace.location.lng) / 2
          : 0
    };
  });

  const userSegmentColor =
    userRouteSegment &&
    sortedPlaceData.length > 0 &&
    visitedIds.has(sortedPlaceData[0].place.placeId)
      ? '#94a3b8'
      : colors.brand.primary;

  return (
    <View className="flex-1">
      {stampModal && (
        <StampCelebrationOverlay
          data={stampModal}
          stampScale={stampScale}
          stampOpacity={stampOpacity}
        />
      )}

      <DuringTripPlaceDetailSheet
        selectedPlace={selectedPlace}
        sheetTranslateY={sheetTranslateY}
        panHandlers={sheetPanResponder.panHandlers}
        onClose={closeSheet}
        visitedIds={visitedIds}
      />

      <EndTripConfirmModal
        visible={showEndModal}
        onCancel={() => setShowEndModal(false)}
        onConfirm={doEndTrip}
        ending={ending}
      />

      {/* ── Map (full screen) ── */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
        onMapReady={() => {
          if (markers.length > 0) {
            mapRef.current?.fitToCoordinates(markers, {
              edgePadding: { top: 100, right: 40, bottom: 320, left: 40 },
              animated: true
            });
          }
        }}
      >
        {/* ── Polylines (flat pass — no Fragment wrapper) ── */}

        {/* User location → first place */}
        {userRouteSegment && (
          <Polyline
            key={`user-poly-${visitedCount}`}
            coordinates={userRouteSegment.coords}
            strokeColor={userSegmentColor}
            strokeWidth={4}
          />
        )}

        {/* Place-to-place */}
        {routeSegments.map((segment, i) => (
          <Polyline
            key={`poly-${i}-${visitedCount}`}
            coordinates={segment.coords}
            strokeColor={segmentStyles[i].strokeColor}
            strokeWidth={segmentStyles[i].strokeWidth}
            lineDashPattern={segmentStyles[i].lineDashPattern}
          />
        ))}

        {/* ── Duration labels (flat pass — no Fragment wrapper) ── */}

        {/* User route duration */}
        {userRouteSegment?.duration &&
          userLocation &&
          sortedPlaceData.length > 0 && (
            <Marker
              key="user-dur"
              coordinate={{
                latitude:
                  (userLocation.latitude +
                    sortedPlaceData[0].place.location.lat) /
                  2,
                longitude:
                  (userLocation.longitude +
                    sortedPlaceData[0].place.location.lng) /
                  2
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
            >
              <View
                className="rounded-xl border bg-white px-[7px] py-[3px]"
                style={{
                  borderWidth: 1.5, // for thick border
                  borderColor: userSegmentColor,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3
                }}
              >
                <AppText
                  variant="caption"
                  className="font-semibold"
                  style={{ color: userSegmentColor, fontSize: 11 }}
                >
                  {userRouteSegment.duration}
                </AppText>
              </View>
            </Marker>
          )}

        {/* Place-to-place duration labels */}
        {routeSegments.map((segment, i) =>
          segment.duration ? (
            <Marker
              key={`dur-${i}`}
              coordinate={{
                latitude: segmentStyles[i].midLat,
                longitude: segmentStyles[i].midLng
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
            >
              <View
                className="rounded-xl border bg-white px-[7px] py-[3px]"
                style={{
                  borderWidth: 1.5,
                  borderColor: segmentStyles[i].strokeColor,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3
                }}
              >
                <AppText
                  variant="caption"
                  className="font-semibold"
                  style={{
                    color: segmentStyles[i].strokeColor,
                    fontSize: 11
                  }}
                >
                  {segment.duration}
                </AppText>
              </View>
            </Marker>
          ) : null
        )}

        {markers.map(m => (
          <Marker
            key={`${m.placeId}-${m.visited}`}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.title}
            pinColor={
              m.visited ? '#22c55e' : m.isCurrent ? 'red' : colors.brand.primary
            }
          />
        ))}

        {/* Starting point */}
        {startCoords && (
          <Marker
            key="starting-point"
            coordinate={startCoords}
            title={
              typeof startLabel === 'string' && startLabel
                ? startLabel
                : 'Starting Point'
            }
            pinColor="#22c55e"
          />
        )}
      </MapView>

      <DuringTripMapHeader
        tripName={trip?.itineraryName ?? 'Trip'}
        onEndTrip={() => setShowEndModal(true)}
        ending={ending}
      />

      <DuringTripTransportProgress
        transportMode={transportMode}
        onTransportModeChange={setTransportMode}
        tripXp={tripXp}
        visitedCount={visitedCount}
        totalCount={totalCount}
        progress={progress}
      />

      {/* ── Journey dots + Cards ── */}
      <View className="absolute bottom-6 z-10 w-full">
        <JourneyStepDots
          sortedPlaceData={sortedPlaceData}
          visitedIds={visitedIds}
          nextUnvisitedId={nextUnvisitedId}
        />

        {/* Place cards — horizontal FlatList with map sync on scroll */}
        <FlatList
          ref={flatListRef}
          horizontal
          data={sortedPlaceData}
          keyExtractor={item => item.place.placeId}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          snapToInterval={353}
          decelerationRate="fast"
          snapToAlignment="start"
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          renderItem={({ item: { place, promotions } }) => {
            const tripPlace = trip?.places.find(
              p => p.placeId === place.placeId
            );
            return (
              <DuringTripPlaceCard
                place={place}
                visitedAt={tripPlace?.visitedAt ?? null}
                promotions={promotions}
                onCheckIn={() => handleCheckIn(place.placeId)}
                checkingIn={checkingInId === place.placeId}
                onPress={() => setSelectedPlace({ place, promotions })}
              />
            );
          }}
        />
      </View>
    </View>
  );
}
