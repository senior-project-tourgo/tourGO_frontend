import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import { BADGE_THRESHOLDS } from '@/constants/badges';

export function XpBar({ current, badge }: { current: number; badge: string }) {
  const currentIndex = BADGE_THRESHOLDS.findIndex(b => b.badge === badge);

  if (currentIndex === -1) {
    return (
      <AppText variant="muted" className="text-center">
        Progress unavailable
      </AppText>
    );
  }

  const currentTier = BADGE_THRESHOLDS[currentIndex];
  const nextTier = BADGE_THRESHOLDS[currentIndex - 1];

  if (!nextTier) {
    return (
      <AppText variant="muted" className="text-center">
        Maximum badge reached — Legend!
      </AppText>
    );
  }

  const progress = Math.min(
    (current - currentTier.xp) / (nextTier.xp - currentTier.xp),
    1
  );

  return (
    <View className="w-full gap-1">
      <View className="flex-row justify-between">
        <AppText variant="caption">{badge}</AppText>
        <AppText variant="caption">
          {current} / {nextTier.xp} XP → {nextTier.badge}
        </AppText>
      </View>

      <View
        className="h-3 overflow-hidden rounded-full"
        style={{ backgroundColor: colors.brand.neutrals }}
      >
        <View
          className="h-3 rounded-full"
          style={{
            width: `${Math.round(progress * 100)}%`,
            backgroundColor: colors.brand.primary
          }}
        />
      </View>
    </View>
  );
}
