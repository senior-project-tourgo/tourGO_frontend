import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

/**
 * variant="default"  — white background, standard spinner
 * variant="map"      — orange background, large pulsing ring loader
 */
export function CenteredLoading({
  message = 'Loading…',
  variant = 'default'
}: {
  message?: string;
  variant?: 'default' | 'map';
}) {
  if (variant === 'map') {
    return <MapLoadingScreen message={message} />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-colors-surface-background">
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          borderWidth: 4,
          borderColor: colors.brand.primary,
          borderTopColor: 'transparent'
        }}
      />
      <AppText variant="muted" className="mt-3">
        {message}
      </AppText>
    </View>
  );
}

function MapLoadingScreen({ message }: { message: string }) {
  // Spinning ring
  const spin = useRef(new Animated.Value(0)).current;
  // Pulsing outer ring
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.18,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();
  }, [spin, pulse]);

  const rotation = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.brand.primary,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28
      }}
    >
      {/* Concentric rings + spinner */}
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {/* Outermost pulse ring */}
        <Animated.View
          style={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: 70,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.25)',
            transform: [{ scale: pulse }]
          }}
        />

        {/* Middle static ring */}
        <View
          style={{
            position: 'absolute',
            width: 108,
            height: 108,
            borderRadius: 54,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.35)'
          }}
        />

        {/* Spinning arc */}
        <Animated.View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 5,
            borderColor: 'rgba(255,255,255,0.9)',
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            transform: [{ rotate: rotation }]
          }}
        />

        {/* Centre dot */}
        <View
          style={{
            position: 'absolute',
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: 'white'
          }}
        />
      </View>

      {/* Message */}
      <View style={{ alignItems: 'center', gap: 6 }}>
        <AppText
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '700',
            letterSpacing: 0.3
          }}
        >
          {message}
        </AppText>
        <AppText style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
          Plotting the perfect route for you
        </AppText>
      </View>
    </View>
  );
}
