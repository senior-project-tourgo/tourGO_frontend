import { AppText } from '@/components/AppText';
import { DuringTripPlaceCard } from '@/components/cards/variants/PlaceCard/DuringTripPlaceCard';
import type { Trip } from '@/features/trip/trip.types';
import type { Place } from '@/features/place/place.types';
import { getPlacesByIds } from '@/features/place/placeById.api';
import {
  getPromotionsByPlace,
  type ApiPromotion
} from '@/services/promotion.service';
import {
  checkIn as apiCheckIn,
  completeTrip,
  getTripById
} from '@/services/trip.service';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

type PlaceWithPromos = {
  place: Place;
  promotions: ApiPromotion[];
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

  const mapRef = useRef<MapView>(null);

  // Load trip + places + promotions
  const load = useCallback(async () => {
    if (!tripId) return;
    try {
      const [fetchedTrip, locationResult] = await Promise.all([
        getTripById(tripId),
        Location.requestForegroundPermissionsAsync()
      ]);

      setTrip(fetchedTrip);

      const placeIds = fetchedTrip.places
        .sort((a, b) => a.order - b.order)
        .map(p => p.placeId);

      const places = await getPlacesByIds(placeIds);

      // Fetch promotions for each place in parallel
      const withPromos: PlaceWithPromos[] = await Promise.all(
        places.map(async place => {
          try {
            const promos = await getPromotionsByPlace(place.placeId);
            return { place, promotions: promos };
          } catch {
            return { place, promotions: [] };
          }
        })
      );

      setPlaceData(withPromos);

      // Set initial region from user location or first place
      if (locationResult.status === 'granted' && places.length > 0) {
        setRegion({
          latitude: places[0].location.lat,
          longitude: places[0].location.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        });
      } else if (places.length > 0) {
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

  const handleCheckIn = async (placeId: string) => {
    if (!trip || !tripId) return;
    try {
      setCheckingInId(placeId);
      const result = await apiCheckIn(tripId, placeId);
      setTrip(result.trip);
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
      // Show error inline — can't use Alert right after dismissing a Modal on Android
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

  const markers = placeData.map(({ place }, idx) => ({
    latitude: place.location.lat,
    longitude: place.location.lng,
    title: `${idx + 1}. ${place.placeName}`,
    placeId: place.placeId,
    visited: visitedIds.has(place.placeId)
  }));

  return (
    <View className="flex-1">
      {/* End Trip confirmation modal */}
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
      {/* Map fills entire screen */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
        onMapReady={() => {
          if (markers.length > 0) {
            mapRef.current?.fitToCoordinates(markers, {
              edgePadding: { top: 100, right: 40, bottom: 280, left: 40 },
              animated: true
            });
          }
        }}
      >
        {markers.map((m, idx) => (
          <Marker
            key={m.placeId}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.title}
            pinColor={m.visited ? '#22c55e' : colors.brand.primary}
          />
        ))}
      </MapView>

      {/* Header overlay */}
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
          className="rounded-full bg-red-500 px-4 py-2"
        >
          <AppText variant="caption" className="font-semibold text-white">
            {ending ? 'Ending…' : 'End Trip'}
          </AppText>
        </TouchableOpacity>
      </View>

      {/* XP / progress pill */}
      <View className="absolute left-4 right-4 z-10" style={{ top: 108 }}>
        <View className="flex-row items-center justify-center gap-4 self-center rounded-2xl bg-colors-surface-background px-5 py-2 shadow-sm">
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
          <View className="h-4 w-px bg-colors-brand-neutrals" />
          <View className="flex-row items-center gap-1">
            <Ionicons
              name="location"
              size={14}
              color={colors.brand.secondary}
            />
            <AppText variant="caption" className="font-semibold">
              {visitedCount}/{totalCount} visited
            </AppText>
          </View>
        </View>
      </View>

      {/* Bottom cards — mirrors review-trip layout */}
      <View className="absolute bottom-6 z-10 w-full">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {placeData.map(({ place, promotions }) => {
            const tripPlace = trip?.places.find(
              p => p.placeId === place.placeId
            );
            return (
              <DuringTripPlaceCard
                key={place.placeId}
                place={place}
                visitedAt={tripPlace?.visitedAt ?? null}
                promotions={promotions}
                onCheckIn={() => handleCheckIn(place.placeId)}
                checkingIn={checkingInId === place.placeId}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
