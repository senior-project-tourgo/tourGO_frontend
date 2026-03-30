import { View, Pressable, Image, ScrollView } from 'react-native';
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import colors from '@/theme/colors';
import type { Trip } from '@/features/trip/trip.types';
import { STATUS_LABEL, STATUS_COLOR } from '@/constants/trip';

export const CARD_WIDTH = 200;
const CAROUSEL_HEIGHT = 190;

type Slide = { type: 'collage' } | { type: 'single'; url: string };

function CollageSlide({ imgs }: { imgs: string[] }) {
  if (imgs.length === 2) {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: CARD_WIDTH,
          height: CAROUSEL_HEIGHT
        }}
      >
        {imgs.map((url, i) => (
          <Image
            key={i}
            source={{ uri: url }}
            style={{
              flex: 1,
              height: CAROUSEL_HEIGHT,
              marginLeft: i > 0 ? 1 : 0
            }}
            resizeMode="cover"
          />
        ))}
      </View>
    );
  }

  // 3+: left 2/3, right 1/3 stacked
  return (
    <View
      style={{
        flexDirection: 'row',
        width: CARD_WIDTH,
        height: CAROUSEL_HEIGHT
      }}
    >
      <Image
        source={{ uri: imgs[0] }}
        style={{ flex: 2, height: CAROUSEL_HEIGHT }}
        resizeMode="cover"
      />
      <View style={{ flex: 1, marginLeft: 1, gap: 1 }}>
        <Image
          source={{ uri: imgs[1] }}
          style={{ flex: 1, width: '100%' }}
          resizeMode="cover"
        />
        <Image
          source={{ uri: imgs[2] }}
          style={{ flex: 1, width: '100%' }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

function PlacePhotoCarousel({
  placeIds,
  placeImages
}: {
  placeIds: string[];
  placeImages: Record<string, string>;
}) {
  const imgs = useMemo(
    () => placeIds.map(id => placeImages[id]).filter(Boolean) as string[],
    [placeIds, placeImages]
  );

  const slides = useMemo<Slide[]>(() => {
    if (imgs.length === 0) return [];
    if (imgs.length === 1) return [{ type: 'single', url: imgs[0] }];
    return [
      { type: 'collage' },
      ...imgs.map(url => ({ type: 'single' as const, url }))
    ];
  }, [imgs]);

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slidesLenRef = useRef(slides.length);
  slidesLenRef.current = slides.length;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    if (slidesLenRef.current <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % slidesLenRef.current;
        scrollRef.current?.scrollTo({ x: next * CARD_WIDTH, animated: true });
        return next;
      });
    }, 3000);
  }, [stopTimer]);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [slides.length, startTimer, stopTimer]);

  if (imgs.length === 0) return null;

  return (
    <View style={{ height: CAROUSEL_HEIGHT }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={stopTimer}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
          setActiveIndex(idx);
          startTimer();
        }}
      >
        {slides.map((slide, i) =>
          slide.type === 'collage' ? (
            <CollageSlide key={i} imgs={imgs} />
          ) : (
            <Image
              key={i}
              source={{ uri: slide.url }}
              style={{ width: CARD_WIDTH, height: CAROUSEL_HEIGHT }}
              resizeMode="cover"
            />
          )
        )}
      </ScrollView>

      {slides.length > 1 && (
        <View
          style={{
            position: 'absolute',
            bottom: 8,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 4
          }}
        >
          {slides.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === activeIndex ? 16 : 5,
                height: 5,
                borderRadius: 3,
                backgroundColor:
                  i === activeIndex ? '#fff' : 'rgba(255,255,255,0.5)'
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export function TripCard({
  trip,
  onStart,
  onResume,
  onEdit,
  onDelete,
  starting,
  placeImages = {}
}: {
  trip: Trip;
  onStart: () => void;
  onResume: () => void;
  onEdit: () => void;
  onDelete: () => void;
  starting: boolean;
  placeImages?: Record<string, string>;
}) {
  const visitedCount = trip.places.filter(p => p.visitedAt).length;
  const totalCount = trip.places.length;
  const date = trip.completedAt ?? trip.startedAt ?? trip.createdAt;
  const dateLabel = new Date(date).toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });

  const placeIds = useMemo(
    () =>
      trip.places
        .slice()
        .sort((a, b) => a.order - b.order)
        .map(p => p.placeId),
    [trip.places]
  );

  return (
    // Outer wrapper handles shadow — must NOT have overflow:hidden on Android
    <View
      style={{
        width: CARD_WIDTH,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2
      }}
    >
      {/* Inner clip — rounds the image top corners */}
      <View
        style={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: 'hidden'
        }}
      >
        <PlacePhotoCarousel placeIds={placeIds} placeImages={placeImages} />

        {/* Edit / delete buttons — top-right of image */}
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            flexDirection: 'row',
            gap: 6
          }}
        >
          <Pressable
            onPress={onEdit}
            hitSlop={8}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.85)',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Ionicons
              name="pencil-outline"
              size={13}
              color={colors.brand.primary}
            />
          </Pressable>
          <Pressable
            onPress={onDelete}
            hitSlop={8}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.85)',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Ionicons name="trash-outline" size={13} color="#ef4444" />
          </Pressable>
        </View>

        {/* Status badge — bottom-left of image */}
        <View style={{ position: 'absolute', bottom: 28, left: 8 }}>
          <View
            style={{
              backgroundColor: STATUS_COLOR[trip.status] + 'dd',
              borderRadius: 20,
              paddingHorizontal: 8,
              paddingVertical: 3
            }}
          >
            <AppText
              variant="caption"
              style={{ color: '#fff', fontWeight: '700', fontSize: 10 }}
            >
              {STATUS_LABEL[trip.status]}
            </AppText>
          </View>
        </View>
      </View>

      {/* Content — white background guaranteed by outer wrapper */}
      <View style={{ padding: 10, gap: 6 }}>
        <AppText
          variant="subtitle"
          style={{ fontSize: 13, fontWeight: '700' }}
          numberOfLines={2}
        >
          {trip.itineraryName}
        </AppText>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="location-outline" size={11} color="#94a3b8" />
            <AppText variant="caption" style={{ color: '#94a3b8' }}>
              {totalCount} place{totalCount !== 1 ? 's' : ''}
            </AppText>
          </View>

          {trip.status === 'completed' && (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={11}
                color="#22c55e"
              />
              <AppText variant="caption" style={{ color: '#94a3b8' }}>
                {visitedCount}/{totalCount}
              </AppText>
            </View>
          )}

          {trip.xpEarned > 0 && (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
            >
              <Ionicons
                name="star-outline"
                size={11}
                color={colors.brand.primary}
              />
              <AppText
                variant="caption"
                style={{ color: colors.brand.primary }}
              >
                +{trip.xpEarned} XP
              </AppText>
            </View>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="calendar-outline" size={11} color="#94a3b8" />
            <AppText variant="caption" style={{ color: '#94a3b8' }}>
              {dateLabel}
            </AppText>
          </View>
        </View>

        {trip.status === 'current' && (
          <Button
            title={starting ? 'Loading…' : 'Resume Trip'}
            onPress={onResume}
            disabled={starting}
          />
        )}
        {trip.status === 'saved' && (
          <Button
            title={starting ? 'Starting…' : 'Start Trip'}
            onPress={onStart}
            isLoading={starting}
          />
        )}
      </View>
    </View>
  );
}
