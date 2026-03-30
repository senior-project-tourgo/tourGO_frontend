import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import colors from '@/theme/colors';
import { totalRouteKm } from '@/utils/distance';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { StatCard } from '@/components/cards/variants/StatCard';
import { XpBar } from '@/components/Xpbar';

type SummaryParams = {
  tripName: string;
  xpEarned: number;
  totalXp: number;
  badge: string;
  visitedCount: number;
  totalPlaces: number;
  totalDuration: number | null;
};

export default function TripSummaryScreen() {
  const params = useLocalSearchParams<{
    tripId: string;
    summary: string;
    visitedCoords: string;
  }>();

  const summary: SummaryParams = (() => {
    try {
      return params.summary ? JSON.parse(params.summary as string) : null;
    } catch {
      return null;
    }
  })() ?? {
    tripName: 'Trip Complete',
    xpEarned: 0,
    totalXp: 0,
    badge: 'Newcomer',
    visitedCount: 0,
    totalPlaces: 0,
    totalDuration: null
  };

  const coords: { lat: number; lng: number }[] = (() => {
    try {
      return params.visitedCoords
        ? JSON.parse(params.visitedCoords as string)
        : [];
    } catch {
      return [];
    }
  })();

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
