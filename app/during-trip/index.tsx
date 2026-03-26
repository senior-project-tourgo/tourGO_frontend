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
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

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

      const placeIds = fetchedTrip.places
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
      setEnding(false);
      console.error('End trip failed:', err.message);
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
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.35)',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: stampOpacity
          }}
        >
          <Animated.View
            style={{
              transform: [{ scale: stampScale }],
              backgroundColor: '#fff',
              borderRadius: 24,
              padding: 28,
              alignItems: 'center',
              gap: 6,
              width: 260,
              shadowColor: '#000',
              shadowOpacity: 0.18,
              shadowRadius: 24,
              elevation: 12
            }}
          >
            {/* Stamp circle */}
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.brand.primary + '18',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
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
                <AppText
                  variant="caption"
                  className="font-semibold"
                  style={{ color: colors.brand.primary }}
                >
                  Visit #{stampModal.visitCount}
                </AppText>
              </View>
            )}

            <AppText
              variant="caption"
              style={{ color: '#94a3b8', marginTop: 4 }}
            >
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
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            {/* Transparent dismiss area — map stays fully visible behind */}
            <Pressable
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
              onPress={closeSheet}
            />

            {/* White card slides up from the bottom */}
            <Animated.View
              style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: '82%',
                transform: [{ translateY: sheetTranslateY }]
              }}
            >
              {/* Handle bar — drag down to dismiss */}
              <View
                style={{
                  alignItems: 'center',
                  paddingTop: 12,
                  paddingBottom: 8
                }}
                {...sheetPanResponder.panHandlers}
              >
                <View
                  style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: '#cbd5e1'
                  }}
                />
              </View>

              <ScrollView
                contentContainerStyle={{ padding: 20, gap: 12 }}
                showsVerticalScrollIndicator={false}
              >
                {/* Name + rating row */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <AppText
                    variant="subtitle"
                    className="font-semibold"
                    style={{ flex: 1, marginRight: 8 }}
                  >
                    {selectedPlace.place.placeName}
                  </AppText>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
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
                      style={{ color: hours.isOpenNow ? '#22c55e' : '#ef4444' }}
                    >
                      {hours.isOpenNow ? 'Open Now' : 'Closed'}
                      {hours.nextTime
                        ? ` · ${hours.nextTime.type === 'close' ? 'Closes' : 'Opens'} at ${hours.nextTime.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : ''}
                    </AppText>
                  );
                })()}

                {/* Vibe tags */}
                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}
                >
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
                <View style={{ height: 16 }} />
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
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.55)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24
          }}
          onPress={() => setShowEndModal(false)}
        >
          <Pressable
            style={{
              width: '100%',
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: 24,
              gap: 12
            }}
            onPress={() => {}}
          >
            <View style={{ alignItems: 'center', paddingBottom: 4 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: '#fee2e2',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
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
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
              <Pressable
                onPress={() => setShowEndModal(false)}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: '#e2e8f0',
                  paddingVertical: 12,
                  alignItems: 'center'
                }}
              >
                <AppText className="font-semibold">Cancel</AppText>
              </Pressable>
              <Pressable
                onPress={doEndTrip}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  backgroundColor: '#ef4444',
                  paddingVertical: 12,
                  alignItems: 'center'
                }}
              >
                <AppText style={{ color: '#fff' }} className="font-semibold">
                  End Trip
                </AppText>
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
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                  borderWidth: 1.5,
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
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  paddingHorizontal: 7,
                  paddingVertical: 3,
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
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            backgroundColor: '#fff',
            borderRadius: 24,
            padding: 4,
            gap: 2,
            marginBottom: 8,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3
          }}
        >
          {(
            [
              { mode: 'driving', icon: 'car-outline' },
              { mode: 'walking', icon: 'walk-outline' }
            ] as { mode: TransportMode; icon: string }[]
          ).map(({ mode, icon }) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setTransportMode(mode)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 20,
                backgroundColor:
                  transportMode === mode ? colors.brand.primary : 'transparent'
              }}
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
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: 12,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3
          }}
        >
          {/* Stats row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
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
          <View
            style={{
              height: 4,
              backgroundColor: colors.brand.neutrals,
              borderRadius: 2,
              marginTop: 8,
              overflow: 'hidden'
            }}
          >
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginBottom: 10,
            paddingHorizontal: 16
          }}
        >
          {sortedPlaceData.map((pd, idx) => {
            const isVisited = visitedIds.has(pd.place.placeId);
            const isCurrent = pd.place.placeId === nextUnvisitedId;
            return (
              <View
                key={pd.place.placeId}
                style={{ alignItems: 'center', gap: 2 }}
              >
                {/* Connector line between dots */}
                {idx > 0 && (
                  <View
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
