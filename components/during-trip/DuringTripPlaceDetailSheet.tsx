import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import type { Place } from '@/features/place/place.types';
import { VIBES } from '@/constants/vibes';
import type { ApiPromotion } from '@/services/promotion.service';
import { getPlaceOpeningStatus } from '@/utils/openingHours';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import type { PanResponderInstance } from 'react-native';
import { Animated, Modal, Pressable, ScrollView, View } from 'react-native';

export type PlaceWithPromos = {
  place: Place;
  promotions: ApiPromotion[];
};

interface DuringTripPlaceDetailSheetProps {
  selectedPlace: PlaceWithPromos | null;
  sheetTranslateY: Animated.Value;
  panHandlers: PanResponderInstance['panHandlers'];
  onClose: () => void;
  visitedIds: Set<string>;
}

export function DuringTripPlaceDetailSheet({
  selectedPlace,
  sheetTranslateY,
  panHandlers,
  onClose,
  visitedIds
}: DuringTripPlaceDetailSheetProps) {
  return (
    <Modal
      visible={!!selectedPlace}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {selectedPlace && (
        <View className="flex-1 justify-end">
          <Pressable className="absolute inset-0" onPress={onClose} />

          <Animated.View
            className="rounded-t-3xl bg-colors-surface-background"
            style={{
              maxHeight: '82%',
              transform: [{ translateY: sheetTranslateY }]
            }}
          >
            <View className="items-center pb-2 pt-3" {...panHandlers}>
              <View className="h-1 w-10 rounded bg-slate-300" />
            </View>

            <ScrollView
              contentContainerStyle={{ gap: 12 }}
              className="px-5 py-5"
              showsVerticalScrollIndicator={false}
            >
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

              <AppText variant="muted">
                {selectedPlace.place.location.area} ·{' '}
                {selectedPlace.place.priceRange} · ~
                {selectedPlace.place.typicalTimeSpent}
              </AppText>

              {(() => {
                const hours = getPlaceOpeningStatus(
                  selectedPlace.place.openingHours
                );
                return (
                  <AppText
                    variant="caption"
                    style={{
                      color: hours.isOpenNow
                        ? colors.status.success
                        : colors.status.error
                    }}
                  >
                    {hours.isOpenNow ? 'Open Now' : 'Closed'}
                    {hours.nextTime
                      ? ` · ${hours.nextTime.type === 'close' ? 'Closes' : 'Opens'} at ${hours.nextTime.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : ''}
                  </AppText>
                );
              })()}

              <View className="flex-row flex-wrap gap-2">
                {selectedPlace.place.vibe
                  .map(id => VIBES.find(v => v.id === id)?.title)
                  .filter(Boolean)
                  .map((title, i) => (
                    <Badge key={i} label={title as string} />
                  ))}
              </View>

              {visitedIds.has(selectedPlace.place.placeId) && (
                <View
                  className="flex-row items-center gap-2 rounded-xl p-3"
                  style={{ backgroundColor: colors.status.success + '1A' }}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.status.success}
                  />
                  <AppText
                    variant="caption"
                    className="font-semibold"
                    style={{ color: colors.status.success }}
                  >
                    You visited this place!
                  </AppText>
                </View>
              )}

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

              <View className="h-4" />
            </ScrollView>
          </Animated.View>
        </View>
      )}
    </Modal>
  );
}
