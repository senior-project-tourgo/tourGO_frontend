import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Animated, View } from 'react-native';

export type StampModalData = {
  placeName: string;
  visitCount: number;
  isNew: boolean;
};

interface StampCelebrationOverlayProps {
  data: StampModalData;
  stampScale: Animated.Value;
  stampOpacity: Animated.Value;
}

export function StampCelebrationOverlay({
  data,
  stampScale,
  stampOpacity
}: StampCelebrationOverlayProps) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          opacity: stampOpacity
        }
      ]}
      className="absolute inset-0 z-[100] items-center justify-center bg-colors-text"
    >
      <Animated.View
        style={{
          transform: [{ scale: stampScale }]
        }}
        className="w-[260px] items-center gap-1.5 rounded-3xl bg-colors-surface-background p-7 shadow-lg"
      >
        <View
          className="border-3 h-20 w-20 items-center justify-center rounded-full"
          style={{
            backgroundColor: colors.brand.primary + '18',
            borderColor: colors.brand.primary,
            borderStyle: 'dashed'
          }}
        >
          <Ionicons name="checkmark" size={42} color={colors.brand.primary} />
        </View>

        <AppText
          variant="subtitle"
          className="text-center font-semibold"
          style={{ marginTop: 4 }}
        >
          {data.isNew ? 'Stamp Collected!' : 'Visited Again!'}
        </AppText>

        <AppText variant="muted" className="text-center">
          {data.placeName}
        </AppText>

        {data.visitCount > 1 && (
          <View
            style={{
              backgroundColor: colors.brand.primary + '15',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
              marginTop: 2
            }}
          >
            <AppText variant="caption" className="font-semibold">
              Visit #{data.visitCount}
            </AppText>
          </View>
        )}

        <AppText variant="caption" className="mt-1 text-slate-400">
          +10 XP earned
        </AppText>
      </Animated.View>
    </Animated.View>
  );
}
