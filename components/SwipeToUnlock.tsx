import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, PanResponder, View } from 'react-native';

const TRACK_HEIGHT = 56;
const THUMB_SIZE = 48;
const HORIZONTAL_PADDING = 4;

interface Props {
  label?: string;
  onUnlock: () => void;
  disabled?: boolean;
  trackWidth?: number;
}

export function SwipeToUnlock({
  label = 'Slide to check in',
  onUnlock,
  disabled = false,
  trackWidth = 310
}: Props) {
  const maxTranslate = trackWidth - THUMB_SIZE - HORIZONTAL_PADDING * 2;
  const pan = useRef(new Animated.Value(0)).current;
  const unlocked = useRef(false);

  useEffect(() => {
    if (!disabled && unlocked.current) {
      unlocked.current = false;
      Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
    }
  }, [disabled, pan]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled && !unlocked.current,
    onMoveShouldSetPanResponder: () => !disabled && !unlocked.current,
    onPanResponderMove: (_, g) => {
      const x = Math.max(0, Math.min(g.dx, maxTranslate));
      pan.setValue(x);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dx >= maxTranslate * 0.85) {
        Animated.spring(pan, {
          toValue: maxTranslate,
          useNativeDriver: true
        }).start(() => {
          unlocked.current = true;
          onUnlock();
        });
      } else {
        Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
      }
    }
  });

  const opacity = pan.interpolate({
    inputRange: [0, maxTranslate * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  return (
    <View
      className={`justify-center overflow-hidden rounded-full`}
      style={{
        width: trackWidth,
        height: TRACK_HEIGHT,
        padding: HORIZONTAL_PADDING,
        backgroundColor: disabled ? colors.surface.muted : colors.brand.primary
      }}
    >
      {/* Label fades out */}
      <Animated.View
        style={{
          position: 'absolute',
          alignSelf: 'center',
          opacity
        }}
        pointerEvents="none"
      >
        <AppText
          variant="caption"
          className="font-semibold text-white"
          style={{ color: colors.text.inverse, letterSpacing: 0.5 }}
        >
          {label}
        </AppText>
      </Animated.View>

      {/* Sliding thumb */}
      <Animated.View
        style={{
          transform: [{ translateX: pan }],
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: THUMB_SIZE / 2,
          backgroundColor: colors.surface.background
        }}
        className="items-center justify-center"
        {...panResponder.panHandlers}
      >
        <Ionicons
          name="chevron-forward"
          size={22}
          color={disabled ? colors.surface.muted : colors.brand.primary}
        />
      </Animated.View>
    </View>
  );
}
