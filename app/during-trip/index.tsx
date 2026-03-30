import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { DuringTripPlaceCard } from '@/components/cards/variants/PlaceCard/DuringTripPlaceCard';
import type { Place } from '@/features/place/place.types';
import { getPlacesByIds } from '@/features/place/placeById.api';
import type { Trip } from '@/features/trip/trip.types';
import { getPlaceOpeningStatus } from '@/utils/openingHours';
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
import { mockVibes } from '@/mock/vibes.mock';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';

type PlaceWithPromos = {
  place: Place;
  promotions: ApiPromotion[];
};

type StampModalData = {
  placeName: string;
  visitCount: number;
  isNew: boolean;
};

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
    return (
      <View className="flex-1 items-center justify-center bg-colors-surface-background">
        <ActivityIndicator size="large" color={colors.brand.primary} />
        <AppText variant="muted" className="mt-3">
          Loading trip…
        </AppText>
      </View>
    );
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
      {/* ── Stamp celebration overlay (non-blocking, auto-dismisses) ── */}
      {stampModal && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              opacity: stampOpacity
            }
          ]}
          className="absolute inset-0 z-[100] items-center justify-center bg-colors-text"
        >
          <Animated.View
            style={{
              transform: [{ scale: stampScale }]
            }}
            className="w-[260px] items-center gap-1.5 rounded-3xl bg-colors-surface-background p-7 shadow-lg"
          >
            {/* Stamp circle */}
            <View
              className="border-3 h-20 w-20 items-center justify-center rounded-full"
              style={{
                backgroundColor: colors.brand.primary + '18',
                borderColor: colors.brand.primary,
                borderStyle: 'dashed'
              }}
            >
              <Ionicons
                name="checkmark"
                size={42}
                color={colors.brand.primary}
              />
            </View>

            <AppText
              variant="subtitle"
              className="text-center font-semibold"
              style={{ marginTop: 4 }}
            >
              {stampModal.isNew ? 'Stamp Collected!' : 'Visited Again!'}
            </AppText>

            <AppText variant="muted" className="text-center">
              {stampModal.placeName}
            </AppText>

            {stampModal.visitCount > 1 && (
              <View
                style={{
                  backgroundColor: colors.brand.primary + '15',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 12,
                  marginTop: 2
                }}
              >
                <AppText variant="caption" className="font-semibold">
                  Visit #{stampModal.visitCount}
                </AppText>
              </View>
            )}

            <AppText variant="caption" className="mt-1 text-slate-400">
              +10 XP earned
            </AppText>
          </Animated.View>
        </Animated.View>
      )}

      {/* ── Place detail bottom sheet ── */}
      {/* animationType="none" so we control card + overlay separately:
          overlay fades in, card slides up — avoids the "whole screen slides" glitch */}
      <Modal
        visible={!!selectedPlace}
        transparent
        animationType="none"
        onRequestClose={closeSheet}
      >
        {selectedPlace && (
          <View className="flex-1 justify-end">
            {/* Transparent dismiss area — map stays fully visible behind */}
            <Pressable className="absolute inset-0" onPress={closeSheet} />

            {/* White card slides up from the bottom */}
            <Animated.View
              className="rounded-t-3xl bg-colors-surface-background"
              style={{
                maxHeight: '82%',
                transform: [{ translateY: sheetTranslateY }]
              }}
            >
              {/* Handle bar — drag down to dismiss */}
              <View
                className="items-center pb-2 pt-3"
                {...sheetPanResponder.panHandlers}
              >
                <View className="h-1 w-10 rounded bg-slate-300" />
              </View>

              <ScrollView
                contentContainerStyle={{ gap: 12 }}
                className="px-5 py-5"
                showsVerticalScrollIndicator={false}
              >
                {/* Name + rating row */}
                <View className="flex-row items-center justify-between">
                  <AppText
                    variant="subtitle"
                    className="mr-2 flex-1 font-semibold"
                  >
                    {selectedPlace.place.placeName}
                  </AppText>
                  <View className="flex-row items-center gap-1">
                    <Ionicons
                      name="star"
                      size={14}
                      color={colors.brand.primary}
                    />
                    <AppText variant="caption" className="font-semibold">
                      {selectedPlace.place.averageRating}
                    </AppText>
                  </View>
                </View>

                {/* Meta */}
                <AppText variant="muted">
                  {selectedPlace.place.location.area} ·{' '}
                  {selectedPlace.place.priceRange} · ~
                  {selectedPlace.place.typicalTimeSpent}
                </AppText>

                {/* Opening status */}
                {(() => {
                  const hours = getPlaceOpeningStatus(
                    selectedPlace.place.openingHours
                  );
                  return (
                    <AppText
                      variant="caption"
                      className={
                        hours.isOpenNow ? 'text-green-500' : 'text-red-500'
                      }
                    >
                      {hours.isOpenNow ? 'Open Now' : 'Closed'}
                      {hours.nextTime
                        ? ` · ${hours.nextTime.type === 'close' ? 'Closes' : 'Opens'} at ${hours.nextTime.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : ''}
                    </AppText>
                  );
                })()}

                {/* Vibe tags */}
                <View className="flex-row flex-wrap gap-2">
                  {selectedPlace.place.vibe
                    .map(id => mockVibes.find(v => v.id === id)?.title)
                    .filter(Boolean)
                    .map((title, i) => (
                      <Badge key={i} label={title as string} />
                    ))}
                </View>

                {/* Visited badge */}
                {visitedIds.has(selectedPlace.place.placeId) && (
                  <View className="flex-row items-center gap-2 rounded-xl bg-green-50 p-3">
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#22c55e"
                    />
                    <AppText
                      variant="caption"
                      className="font-semibold text-green-700"
                    >
                      You visited this place!
                    </AppText>
                  </View>
                )}

                {/* Promotions */}
                {selectedPlace.promotions.length > 0 && (
                  <View className="gap-2">
                    <AppText variant="subtitle" className="font-semibold">
                      Deals Available
                    </AppText>
                    {selectedPlace.promotions.map(promo => (
                      <View
                        key={promo.promotionId}
                        className="rounded-xl bg-gray-50 p-3"
                      >
                        <AppText variant="caption" className="font-semibold">
                          {promo.promotionName}
                        </AppText>
                        <AppText
                          variant="caption"
                          className="mt-1 text-colors-text"
                        >
                          {promo.description}
                        </AppText>
                      </View>
                    ))}
                  </View>
                )}

                {/* Bottom spacing */}
                <View className="h-4" />
              </ScrollView>
            </Animated.View>
          </View>
        )}
      </Modal>

      {/* ── End Trip confirmation modal ── */}
      <Modal
        visible={showEndModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEndModal(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', padding: 24 }}
          onPress={() => setShowEndModal(false)}
        >
          <Pressable
            className="w-full rounded-2xl bg-white p-6"
            style={{ gap: 12 }}
            onPress={() => {}}
          >
            <View className="items-center pb-1">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <Ionicons name="flag-outline" size={26} color="#ef4444" />
              </View>
            </View>
            <AppText variant="subtitle" className="text-center font-semibold">
              End Trip?
            </AppText>
            <AppText variant="muted" className="text-center">
              This will complete your trip and show a summary. You won&apos;t be
              able to check in after this.
            </AppText>
            <View className="mt-1 flex-row gap-2">
              <Pressable
                onPress={() => setShowEndModal(false)}
                className="flex-1 items-center rounded-xl border border-slate-200 py-3"
                style={{ borderWidth: 1.5 }}
              >
                <AppText className="font-semibold">Cancel</AppText>
              </Pressable>
              <Pressable
                onPress={doEndTrip}
                className="flex-1 items-center rounded-xl bg-red-500 py-3"
              >
                <AppText className="font-semibold text-white">End Trip</AppText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

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

      {/* ── Header overlay ── */}
      <View className="absolute left-0 right-0 top-0 z-10 flex-row items-center justify-between px-4 pb-3 pt-14">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-colors-surface-background"
          >
            <Ionicons name="chevron-back" size={22} color="#111" />
          </TouchableOpacity>
          <View className="rounded-2xl bg-colors-surface-background px-3 py-1.5 shadow-sm">
            <AppText
              variant="subtitle"
              className="font-semibold"
              numberOfLines={1}
            >
              {trip?.itineraryName ?? 'Trip'}
            </AppText>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setShowEndModal(true)}
          disabled={ending}
          className="rounded-full bg-red-500 px-5 py-2.5"
        >
          <AppText variant="body" className="font-semibold text-white">
            {ending ? 'Ending…' : 'End Trip'}
          </AppText>
        </TouchableOpacity>
      </View>

      {/* ── Transport mode toggle + Progress pill ── */}
      <View className="absolute left-4 right-4 z-10" style={{ top: 108 }}>
        {/* Mode toggle */}
        <View className="mb-2 flex-row gap-0.5 self-center rounded-full bg-white p-1 shadow-sm">
          {(
            [
              { mode: 'driving', icon: 'car-outline' },
              { mode: 'walking', icon: 'walk-outline' }
            ] as { mode: TransportMode; icon: string }[]
          ).map(({ mode, icon }) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setTransportMode(mode)}
              className={`rounded-full px-[14px] py-[7px] ${
                transportMode === mode ? 'bg-colors-brand-primary' : ''
              }`}
            >
              <Ionicons
                name={icon as any}
                size={18}
                color={transportMode === mode ? '#fff' : '#94a3b8'}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress pill */}
        <View className="rounded-xl bg-colors-surface-background px-4 pb-3 pt-[10px] shadow-sm">
          {/* Stats row */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={14} color={colors.brand.primary} />
              <AppText
                variant="caption"
                className="font-semibold"
                style={{ color: colors.brand.primary }}
              >
                {tripXp} XP earned
              </AppText>
            </View>
            <AppText variant="caption" className="font-semibold">
              {visitedCount}/{totalCount} stops
            </AppText>
          </View>

          {/* Progress bar */}
          <View className="mt-2 h-1 overflow-hidden rounded bg-colors-brand-neutrals">
            <View
              style={{
                height: 4,
                width: `${Math.round(progress * 100)}%`,
                backgroundColor: colors.brand.primary,
                borderRadius: 2
              }}
            />
          </View>
        </View>
      </View>

      {/* ── Journey dots + Cards ── */}
      <View className="absolute bottom-6 z-10 w-full">
        {/* Journey path dots — one per stop */}
        <View className="mb-2.5 flex-row items-center justify-center gap-1.5 px-4">
          {sortedPlaceData.map((pd, idx) => {
            const isVisited = visitedIds.has(pd.place.placeId);
            const isCurrent = pd.place.placeId === nextUnvisitedId;
            return (
              <View
                key={pd.place.placeId}
                className="items-center"
                style={{ gap: 2 }}
              >
                {/* Connector line between dots */}
                {idx > 0 && (
                  <View
                    className=""
                    style={{
                      position: 'absolute',
                      right: '50%',
                      top: isCurrent ? 4 : 3,
                      width: 6,
                      height: 2,
                      backgroundColor: isVisited ? '#22c55e' : '#cbd5e1',
                      transform: [{ translateX: -6 }]
                    }}
                  />
                )}
                <View
                  style={{
                    width: isCurrent ? 12 : 8,
                    height: isCurrent ? 12 : 8,
                    borderRadius: 6,
                    backgroundColor: isVisited
                      ? '#22c55e'
                      : isCurrent
                        ? colors.brand.primary
                        : '#cbd5e1',
                    borderWidth: isCurrent ? 2 : 0,
                    borderColor: '#fff'
                  }}
                />
              </View>
            );
          })}
        </View>

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
