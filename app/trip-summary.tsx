import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import colors from '@/theme/colors';
import { totalRouteKm } from '@/utils/distance';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

type SummaryParams = {
  tripName: string;
  xpEarned: number;
  totalXp: number;
  badge: string;
  visitedCount: number;
  totalPlaces: number;
  totalDuration: number | null;
};

const BADGE_THRESHOLDS = [
  { badge: 'Legend', xp: 1000 },
  { badge: 'Adventurer', xp: 500 },
  { badge: 'Explorer', xp: 100 },
  { badge: 'Newcomer', xp: 0 }
];

function XpBar({ current, badge }: { current: number; badge: string }) {
  const idx = BADGE_THRESHOLDS.findIndex(b => b.badge === badge);
  const next = BADGE_THRESHOLDS[idx - 1];
  const prev = BADGE_THRESHOLDS[idx];

  if (idx === -1) {
    return (
      <AppText variant="muted" className="text-center">
        Progress unavailable
      </AppText>
    );
  }

  if (!next) {
    return (
      <AppText variant="muted" className="text-center">
        Maximum badge reached — Legend!
      </AppText>
    );
  }

  const progress = Math.min((current - prev.xp) / (next.xp - prev.xp), 1);

  return (
    <View className="w-full gap-1">
      <View className="flex-row justify-between">
        <AppText variant="caption">{badge}</AppText>
        <AppText variant="caption">
          {current} / {next.xp} XP → {next.badge}
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

function StatCard({
  icon,
  value,
  label,
  color
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <View
      className="flex-1 items-center gap-1 rounded-2xl p-4 shadow-sm"
      style={{ backgroundColor: colors.surface.background }}
    >
      <Ionicons name={icon} size={24} color={color ?? colors.brand.primary} />
      <AppText variant="subtitle" className="font-semibold">
        {value}
      </AppText>
      <AppText variant="caption" className="text-center">
        {label}
      </AppText>
    </View>
  );
}

export default function TripSummaryScreen() {
  const params = useLocalSearchParams<{
    tripId: string;
    summary: string;
    visitedCoords: string;
  }>();

  const summary: SummaryParams = params.summary
    ? JSON.parse(params.summary as string)
    : {
        tripName: 'Trip Complete',
        xpEarned: 0,
        totalXp: 0,
        badge: 'Newcomer',
        visitedCount: 0,
        totalPlaces: 0,
        totalDuration: null
      };

  const coords: { lat: number; lng: number }[] = params.visitedCoords
    ? JSON.parse(params.visitedCoords as string)
    : [];

  const km = totalRouteKm(coords);
  const hours = summary.totalDuration
    ? Math.floor(summary.totalDuration / 60)
    : null;
  const mins = summary.totalDuration ? summary.totalDuration % 60 : null;
  const durationLabel =
    summary.totalDuration != null
      ? hours && hours > 0
        ? `${hours}h ${mins}m`
        : `${mins}m`
      : '—';

  return (
    <Screen>
      {/* Hero */}
      <View className="items-center gap-2 pb-6">
        <View
          className="h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.brand.neutrals }}
        >
          <AppText style={{ fontSize: 40 }}>🎉</AppText>
        </View>
        <AppText variant="title" className="text-center">
          Trip Complete!
        </AppText>
        <AppText variant="subtitle" className="text-center">
          {summary.tripName}
        </AppText>
      </View>

      {/* Stats row */}
      <View className="flex-row gap-3 pb-6">
        <StatCard
          icon="location"
          value={`${summary.visitedCount}/${summary.totalPlaces}`}
          label="Places visited"
        />
        <StatCard
          icon="navigate"
          value={`${km.toFixed(1)} km`}
          label="Distance"
          color={colors.brand.secondary}
        />
        <StatCard
          icon="time-outline"
          value={durationLabel}
          label="Duration"
          color="#6366f1"
        />
      </View>

      {/* XP earned */}
      <View
        className="mb-6 items-center gap-1 rounded-2xl p-4"
        style={{ backgroundColor: colors.brand.neutrals }}
      >
        <AppText
          variant="heading24"
          className="font-semibold"
          style={{ color: colors.brand.secondary }}
        >
          +{summary.xpEarned} XP earned!
        </AppText>
        <AppText variant="muted">
          Total: {summary.totalXp} XP · Badge: {summary.badge}
        </AppText>
      </View>

      {/* Badge progress */}
      <View
        className="mb-6 gap-3 rounded-2xl p-4 shadow-sm"
        style={{ backgroundColor: colors.surface.background }}
      >
        <AppText variant="subtitle" className="font-semibold">
          Badge Progress
        </AppText>
        <XpBar current={summary.totalXp} badge={summary.badge} />
      </View>

      {/* Actions */}
      <View className="gap-3">
        <Button
          title="Back to Trips"
          onPress={() => router.replace('/(tabs)/trip')}
        />
        <Button
          title="Go Home"
          className="bg-colors-brand-secondary"
          onPress={() => router.replace('/(tabs)/home')}
        />
      </View>
    </Screen>
  );
}
