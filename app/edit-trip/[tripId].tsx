import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Map } from '@/components/Map';
import { HeaderWithBack } from '@/components/PageHeader';
import { ConfirmActionModal } from '@/components/ConfirmActionModal';
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
  FlatList,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  BackHandler
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
  const [initialName, setInitialName] = useState('');
  const [initialPlaceIds, setInitialPlaceIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [showDiscardModal, setShowDiscardModal] = useState(false);

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

  // ✅ Keyboard handling
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // ✅ Load trip
  useEffect(() => {
    if (!tripId) return;

    async function load() {
      try {
        const trip = await getTripById(tripId as string);

        setItineraryName(trip.itineraryName);
        setInitialName(trip.itineraryName);

        const ids = [...trip.places]
          .sort((a, b) => a.order - b.order)
          .map(p => p.placeId);

        setInitialPlaceIds(ids);

        const places = await getPlacesByIds(ids);
        setInitialPlaces(places.map((place, i) => ({ place, order: i + 1 })));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [tripId, setInitialPlaces]);

  // Pending place
  useFocusEffect(
    useCallback(() => {
      const pending = pendingPlaceStore.get();
      if (pending) {
        addPlace(pending);
        pendingPlaceStore.clear();
      }
    }, [addPlace])
  );

  // ✅ Stable change detection
  const currentPlaceIds = editablePlaces.map(p => p.place.placeId);

  const hasChanges =
    itineraryName.trim() !== initialName.trim() ||
    currentPlaceIds.length !== initialPlaceIds.length ||
    currentPlaceIds.some((id, i) => id !== initialPlaceIds[i]);

  // ✅ Back handler
  const handleBack = () => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      router.back();
    }
  };

  // ✅ Android back (safe)
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (hasChanges) {
        setShowDiscardModal(true);
      } else {
        router.back();
      }
      return true;
    });

    return () => sub.remove();
  }, [hasChanges]);

  const handleSave = async () => {
    if (!tripId) return;

    if (!itineraryName.trim() || editablePlaces.length === 0) return;

    try {
      setSaving(true);

      await updateTrip(tripId as string, {
        itineraryName: itineraryName.trim(),
        places: editablePlaces.map(p => ({
          placeId: p.place.placeId,
          order: p.order
        }))
      });

      // ✅ Sync state after save
      setInitialName(itineraryName.trim());
      setInitialPlaceIds(currentPlaceIds);

      router.back();
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
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="relative flex-1">
          {/* Header */}
          <HeaderWithBack
            title="Edit Trip"
            className="absolute z-10 bg-transparent pl-6 pt-16"
            backBg
            onPressBack={handleBack}
          />

          {/* Map */}
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
          <View
            className="absolute z-10 gap-4"
            style={{
              bottom: keyboardHeight > 0 ? keyboardHeight + 10 : 24
            }}
          >
            {/* Trip name */}
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
                className="font-[Inter] text-base text-colors-text"
              />
            </View>

            {/* Places */}
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
                  showCross={editablePlaces.length > 1}
                  onPressCross={() => removePlace(item.place.placeId)}
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
                        addedIds: currentPlaceIds.join(',')
                      }
                    })
                  }
                />
              }
            />

            {/* Save */}
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
            <View className="absolute inset-0 items-center justify-center bg-colors-text/10">
              <ActivityIndicator size="large" />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>

      {/* Discard Modal */}
      <ConfirmActionModal
        visible={showDiscardModal}
        icon="warning-outline"
        title="Leave without saving?"
        message="Your changes will be lost if you leave this page."
        cancelLabel="Keep Editing"
        confirmLabel="Discard"
        onCancel={() => setShowDiscardModal(false)}
        onConfirm={() => {
          setShowDiscardModal(false);
          router.back();
        }}
      />
    </>
  );
}
