import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';

export function HapticTab(props: BottomTabBarButtonProps) {
  const lastPressInfo = useRef<{ time: number; routeKey: string | undefined }>({
    time: 0,
    routeKey: undefined
  });
  const DEBOUNCE_DELAY = 300; // milliseconds

  return (
    <PlatformPressable
      {...props}
      onPressIn={ev => {
        if (process.env.EXPO_OS === 'ios') {
          // add a soft haptic feedback when pressing down on the tabs
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
      onPress={ev => {
        const now = Date.now();
        // Only debounce if rapidly pressing the same tab
        const routeKey = props.accessibilityState?.selected
          ? props?.testID || undefined
          : undefined;

        if (
          lastPressInfo.current.routeKey === routeKey &&
          now - lastPressInfo.current.time < DEBOUNCE_DELAY
        ) {
          // debounce: do nothing if rapidly re-pressing the same tab
          props.onPress?.(ev); // Still call onPress to propagate event (for accessibility)
          return;
        }

        lastPressInfo.current = {
          time: now,
          routeKey
        };
        props.onPress?.(ev);
      }}
    />
  );
}
