import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';

export function HapticTab(props: BottomTabBarButtonProps) {
  const lastPressTime = useRef<number>(0);
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
        // Prevent rapid clicks that could cause navigation state issues
        if (now - lastPressTime.current < DEBOUNCE_DELAY) {
          return;
        }
        lastPressTime.current = now;
        props.onPress?.(ev);
      }}
    />
  );
}
