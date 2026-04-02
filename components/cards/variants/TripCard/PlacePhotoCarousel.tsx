import { View, ScrollView } from 'react-native';
import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import {
  CARD_WIDTH,
  CAROUSEL_HEIGHT,
  Slide
} from '@/constants/place-card/carousel';
import { CollageSlide } from './CollageSlide';
import { ImageWithFallback } from '../PlaceCard/ImageWithFallback';

export function PlacePhotoCarousel({
  placeIds,
  placeImages,
  vibeImage
}: {
  placeIds: string[];
  placeImages: Record<string, string>;
  vibeImage?: string;
}) {
  const imgs = useMemo(
    () => placeIds.map(id => placeImages[id]).filter(Boolean) as string[],
    [placeIds, placeImages]
  );

  const slides = useMemo<Slide[]>(() => {
    if (imgs.length === 0) return [{ type: 'fallback' } as any];
    if (imgs.length === 1) return [{ type: 'single', url: imgs[0] }];

    return [
      { type: 'collage' },
      ...imgs.map(url => ({ type: 'single' as const, url }))
    ];
  }, [imgs]);

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    if (slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % slides.length;
        scrollRef.current?.scrollTo({ x: next * CARD_WIDTH, animated: true });
        return next;
      });
    }, 3000);
  }, [slides.length, stopTimer]);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  return (
    <View style={{ height: CAROUSEL_HEIGHT }} className="relative">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={stopTimer}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
          setActiveIndex(idx);
          startTimer();
        }}
      >
        {slides.map((slide, i) => {
          if (slide.type === 'collage') {
            return <CollageSlide key={i} imgs={imgs} />;
          }

          return (
            <View
              key={i}
              style={{ width: CARD_WIDTH, height: CAROUSEL_HEIGHT }}
              className="overflow-hidden rounded-t-2xl"
            >
              <ImageWithFallback
                primaryImageUrl={
                  slide.type === 'single' ? slide.url : undefined
                }
                vibeImageUrl={vibeImage}
                className="h-full w-full"
              />
            </View>
          );
        })}
      </ScrollView>

      {slides.length > 1 && (
        <View className="absolute bottom-2 left-0 right-0 flex-row justify-center space-x-1">
          {slides.map((_, i) => (
            <View
              key={i}
              className={`rounded-full ${
                i === activeIndex
                  ? 'bg-colors-surface-background'
                  : 'bg-colors-surface-background/50'
              }`}
              style={{
                width: i === activeIndex ? 16 : 5,
                height: 5
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
