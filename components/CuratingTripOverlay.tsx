import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';

type Step = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
};

type Props = {
  steps?: Step[];
  durationMs?: number;
};

const DEFAULT_STEPS: Step[] = [
  { icon: 'location-outline', label: 'Scanning nearby places…' },
  { icon: 'compass-outline', label: 'Matching your vibes…' },
  { icon: 'time-outline', label: 'Fitting your time window…' },
  { icon: 'star-outline', label: 'Ranking top spots…' },
  { icon: 'map-outline', label: 'Building your itinerary…' }
];

const SURPRISE_STEPS: Step[] = [
  { icon: 'shuffle-outline', label: 'Picking a random vibe…' },
  { icon: 'location-outline', label: 'Finding hidden gems…' },
  { icon: 'star-outline', label: 'Ranking the best spots…' },
  { icon: 'map-outline', label: 'Assembling your surprise…' }
];

export { DEFAULT_STEPS, SURPRISE_STEPS };

export default function CuratingTripOverlay({
  steps = DEFAULT_STEPS,
  durationMs = 28000
}: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const stepFade = useRef(new Animated.Value(1)).current;
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    barWidth.setValue(0);
    Animated.timing(barWidth, {
      toValue: 1,
      duration: durationMs,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false
    }).start();

    const stepMs = Math.floor(durationMs / steps.length);
    const stepTimer = setInterval(() => {
      setStepIndex(i => (i + 1) % steps.length);
      Animated.sequence([
        Animated.timing(stepFade, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }),
        Animated.timing(stepFade, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true
        })
      ]).start();
    }, stepMs);

    return () => clearInterval(stepTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.brand.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32
      }}
    >
      {/* Icon + message */}
      <Animated.View
        style={{
          opacity: stepFade,
          alignItems: 'center',
          gap: 12,
          marginBottom: 48
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Ionicons name={steps[stepIndex].icon} size={30} color="#fff" />
        </View>
        <AppText
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#fff',
            textAlign: 'center'
          }}
        >
          {steps[stepIndex].label}
        </AppText>
      </Animated.View>

      {/* Progress bar */}
      <View
        style={{
          width: '100%',
          height: 6,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 3,
          overflow: 'hidden',
          marginBottom: 14
        }}
      >
        <Animated.View
          style={{
            height: '100%',
            borderRadius: 3,
            backgroundColor: '#fff',
            width: barWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
            })
          }}
        />
      </View>

      <AppText
        style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'center'
        }}
      >
        Curating your perfect trip…
      </AppText>

      {/* Step dots */}
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 24 }}>
        {steps.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === stepIndex ? 20 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor:
                i === stepIndex ? '#fff' : 'rgba(255,255,255,0.3)'
            }}
          />
        ))}
      </View>
    </View>
  );
}
