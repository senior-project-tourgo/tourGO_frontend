import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { getUserProfile, type UserProfile } from '@/services/user.service';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useAuth } from '../../../context/AuthContext';

const BADGE_THRESHOLDS = [
  { badge: 'Legend', xp: 1000 },
  { badge: 'Adventurer', xp: 500 },
  { badge: 'Explorer', xp: 100 },
  { badge: 'Newcomer', xp: 0 }
];

function XpProgressBar({ xp, badge }: { xp: number; badge: string }) {
  const idx = BADGE_THRESHOLDS.findIndex(b => b.badge === badge);
  const next = BADGE_THRESHOLDS[idx - 1];
  const prev = BADGE_THRESHOLDS[idx];
  if (!next) {
    return (
      <View className="gap-1">
        <AppText variant="caption" className="font-semibold">
          Legend — Max Badge
        </AppText>
        <View
          className="h-2 rounded-full"
          style={{ backgroundColor: colors.brand.primary }}
        />
      </View>
    );
  }
  const progress = Math.min((xp - prev.xp) / (next.xp - prev.xp), 1);
  return (
    <View className="gap-1">
      <View className="flex-row justify-between">
        <AppText variant="caption">{badge}</AppText>
        <AppText variant="caption">
          {xp} / {next.xp} XP
        </AppText>
      </View>
      <View
        className="h-2 overflow-hidden rounded-full"
        style={{ backgroundColor: colors.brand.neutrals }}
      >
        <View
          className="h-2 rounded-full"
          style={{
            width: `${Math.round(progress * 100)}%`,
            backgroundColor: colors.brand.primary
          }}
        />
      </View>
      <AppText variant="caption" className="text-right">
        Next: {next.badge}
      </AppText>
    </View>
  );
}

function NavRow({
  icon,
  label,
  onPress
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl bg-colors-surface-background px-4 py-4 shadow-sm"
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.brand.neutrals }}
      >
        <Ionicons name={icon} size={18} color={colors.brand.secondary} />
      </View>
      <AppText variant="body" className="flex-1 font-semibold">
        {label}
      </AppText>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={colors.brand.secondary}
      />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile()
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <Screen>
      {/* Avatar + name */}
      <View className="items-center gap-3 pb-6">
        <View
          className="h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.brand.neutrals }}
        >
          <AppText
            variant="heading24"
            className="font-semibold"
            style={{ color: colors.brand.secondary }}
          >
            {initials}
          </AppText>
        </View>

        <View className="items-center gap-0.5">
          <AppText variant="subtitle" className="font-semibold">
            {user?.name ?? '—'}
          </AppText>
          <AppText variant="muted">@{user?.username ?? '—'}</AppText>
        </View>

        {/* XP / Badge */}
        {loading ? (
          <ActivityIndicator color={colors.brand.primary} />
        ) : profile ? (
          <View
            className="w-full gap-3 rounded-2xl p-4"
            style={{ backgroundColor: colors.brand.neutrals }}
          >
            <View className="flex-row items-center justify-between">
              <AppText variant="caption" className="font-semibold">
                🏅 {profile.badge}
              </AppText>
              <AppText
                variant="caption"
                style={{ color: colors.brand.secondary }}
              >
                {profile.xp} XP total
              </AppText>
            </View>
            <XpProgressBar xp={profile.xp} badge={profile.badge} />
          </View>
        ) : null}
      </View>

      {/* Nav rows */}
      <View className="gap-3">
        <NavRow
          icon="create-outline"
          label="Edit Profile"
          onPress={() => router.push('/(tabs)/profile/edit')}
        />
        <NavRow
          icon="map-outline"
          label="Trip History"
          onPress={() => router.push('/(tabs)/profile/trip-history')}
        />
        <NavRow
          icon="pricetag-outline"
          label="Saved Deals"
          onPress={() => router.push('/(tabs)/profile/saved-deals')}
        />
        <NavRow
          icon="bookmark-outline"
          label="Saved Places"
          onPress={() => router.push('/(tabs)/profile/saved-places')}
        />
        <NavRow
          icon="trophy-outline"
          label="Leaderboard"
          onPress={() => router.push('/leaderboard')}
        />
        <NavRow
          icon="log-out-outline"
          label="Logout"
          onPress={() => router.push('/(tabs)/profile/logout')}
        />
      </View>
    </Screen>
  );
}
