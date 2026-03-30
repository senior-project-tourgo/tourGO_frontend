import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { SwipeToUnlock } from '@/components/SwipeToUnlock';
import type { ApiPromotion } from '@/services/promotion.service';
import type { Place } from '@/features/place/place.types';
import colors from '@/theme/colors';
import { getPlaceOpeningStatus } from '@/utils/openingHours';
import { Ionicons } from '@expo/vector-icons';
import { mockVibes } from '@/mock/vibes.mock';
import { useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { ImageWithFallback } from './ImageWithFallback';

type Tab = 'checkin' | 'promotions';

interface Props {
  place: Place;
  visitedAt: string | null;
  promotions: ApiPromotion[];
  onCheckIn: () => void;
  checkingIn?: boolean;
  onPress?: () => void;
}

export function DuringTripPlaceCard({
  place,
  visitedAt,
  promotions,
  onCheckIn,
  checkingIn = false,
  onPress
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('checkin');
  const openingHours = getPlaceOpeningStatus(place.openingHours);
  const isVisited = !!visitedAt;

  return (
    <View className="w-[345px] overflow-hidden rounded-2xl bg-colors-surface-background shadow-sm">
      {/* Top section — tappable to open place detail */}
      <TouchableOpacity
        activeOpacity={onPress ? 0.85 : 1}
        onPress={onPress}
        disabled={!onPress}
      >
        <View className="h-60 flex-row gap-4 p-4">
          <ImageWithFallback
            primaryImageUrl={place.image}
            className="h-52 w-32 rounded-xl"
            resizeMode="cover"
          />

          <View className="flex-1 gap-1">
            <AppText variant="subtitle">{place.placeName}</AppText>
            <AppText variant="muted">
              <Ionicons name="star" color={colors.brand.primary} />{' '}
              {place.averageRating}
            </AppText>

            <AppText variant="muted">
              {place.location.area} · {place.priceRange}
            </AppText>

            <AppText>
              <AppText
                variant="muted"
                style={{
                  color: openingHours.isOpenNow
                    ? colors.status.success
                    : colors.status.error
                }}
              >
                {openingHours.isOpenNow ? 'Open' : 'Closed'}
              </AppText>
              <AppText variant="muted">
                {' · '}
                {openingHours.nextTime
                  ? openingHours.nextTime.type === 'close'
                    ? `Closes at ${openingHours.nextTime.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : `Opens at ${openingHours.nextTime.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'Hours unavailable'}
              </AppText>
            </AppText>

            <View className="flex-row flex-wrap gap-2">
              {place.vibe
                .flatMap(id => {
                  const title = mockVibes.find(v => v.id === id)?.title;
                  return title ? [{ id, title }] : [];
                })
                .map(({ id, title }) => (
                  <View key={id}>
                    <Badge label={title} />
                  </View>
                ))}
            </View>

            {/* Visited badge */}
            {isVisited && (
              <View className="mt-1 flex-row items-center gap-1">
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={colors.status.success}
                />
                <AppText
                  variant="caption"
                  className="font-semibold"
                  style={{ color: colors.status.success }}
                >
                  Visited
                </AppText>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Tab strip */}
      <View className="flex-row border-t border-colors-brand-neutrals">
        {(['checkin', 'promotions'] as Tab[]).map(tab => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            className="flex-1 items-center py-2"
            style={{
              borderBottomWidth: 2,
              borderBottomColor:
                activeTab === tab ? colors.brand.primary : 'transparent'
            }}
          >
            <AppText
              variant="caption"
              className="font-semibold"
              style={{
                color:
                  activeTab === tab ? colors.brand.primary : colors.text.DEFAULT
              }}
            >
              {tab === 'checkin' ? 'Check In' : `Deals (${promotions.length})`}
            </AppText>
          </Pressable>
        ))}
      </View>

      {/* Tab content */}
      <View
        className="items-center justify-center px-4 py-3"
        style={{ minHeight: 76 }}
      >
        {activeTab === 'checkin' &&
          (isVisited ? (
            <View className="flex-row items-center gap-2">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.status.success}
              />
              <AppText
                variant="subtitle"
                className="font-semibold"
                style={{ color: colors.status.success }}
              >
                Checked In · +10 XP
              </AppText>
            </View>
          ) : (
            <SwipeToUnlock
              label="Slide to check in  ›  +10 XP"
              onUnlock={onCheckIn}
              disabled={checkingIn}
              trackWidth={310}
            />
          ))}

        {activeTab === 'promotions' &&
          (promotions.length === 0 ? (
            <AppText variant="muted" className="text-center">
              No promotions available
            </AppText>
          ) : (
            <View className="w-full gap-2">
              {promotions.map(promo => (
                <View
                  key={promo.promotionId}
                  className="rounded-xl bg-colors-surface-muted p-3"
                >
                  <AppText variant="caption" className="font-semibold">
                    {promo.promotionName}
                  </AppText>
                  <AppText
                    variant="caption"
                    className="mt-0.5 text-colors-text"
                  >
                    {promo.description}
                  </AppText>
                </View>
              ))}
            </View>
          ))}
      </View>
    </View>
  );
}
