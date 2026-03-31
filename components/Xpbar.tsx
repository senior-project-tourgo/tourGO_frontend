import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import { BADGE_THRESHOLDS } from '@/constants/badges';

type XpBarProps = {
  current: number;
  badge: string;

  // optional controls
  showLabels?: boolean;
  height?: number;
  showMaxMessage?: boolean;
};

export function XpBar({
  current,
  badge,
  showLabels = true,
  height = 12,
  showMaxMessage = true
}: XpBarProps) {
  const currentIndex = BADGE_THRESHOLDS.findIndex(b => b.badge === badge);

  // ❌ invalid badge
  if (currentIndex === -1) {
    return showLabels ? (
      <AppText variant="muted" className="text-center">
        Progress unavailable
      </AppText>
    ) : null;
  }

  const currentTier = BADGE_THRESHOLDS[currentIndex];
  const nextTier = BADGE_THRESHOLDS[currentIndex - 1];

  // 🏆 max badge
  if (!nextTier) {
    return showMaxMessage && showLabels ? (
      <AppText variant="muted" className="text-center">
        Maximum badge reached — Legend!
      </AppText>
    ) : (
      <View
        className="w-full rounded-full"
        style={{
          height,
          backgroundColor: colors.brand.primary
        }}
      />
    );
  }

  const progress = Math.min(
    (current - currentTier.xp) / (nextTier.xp - currentTier.xp),
    1
  );

  return (
    <View className="w-full gap-1">
      {/* Labels */}
      {showLabels && (
        <View className="flex-row justify-between">
          <AppText variant="caption">{badge}</AppText>
          <AppText variant="caption">
            {current} / {nextTier.xp} XP → {nextTier.badge}
          </AppText>
        </View>
      )}

      {/* Bar */}
      <View
        className="overflow-hidden rounded-full"
        style={{
          height,
          backgroundColor: colors.brand.neutrals
        }}
      >
        <View
          style={{
            height,
            width: `${Math.round(progress * 100)}%`,
            backgroundColor: colors.brand.primary
          }}
        />
      </View>
    </View>
  );
}
