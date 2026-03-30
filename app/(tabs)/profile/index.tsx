import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import {
  getStampCard,
  getUserProfile,
  type StampEntry,
  type UserProfile
} from '@/services/user.service';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  View
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { BADGE_THRESHOLDS } from '@/constants/badges';

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

function StampCardSection({ stamps }: { stamps: StampEntry[] }) {
  if (stamps.length === 0) {
    return (
      <View className="gap-3">
        <AppText variant="body" className="font-semibold">
          Stamp Card
        </AppText>
        <View
          className="items-center rounded-2xl p-6"
          style={{ backgroundColor: colors.surface.background }}
        >
          <Ionicons
            name="map-outline"
            size={32}
            color={colors.brand.secondary}
          />
          <AppText variant="muted" className="mt-2 text-center">
            No stamps yet. Start a trip to collect stamps!
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View className="gap-3">
      <AppText variant="body" className="font-semibold">
        Stamp Card
      </AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-1"
      >
        {stamps.map(stamp => (
          <View
            key={stamp.placeId}
            className="mx-1 w-28 overflow-hidden rounded-2xl"
            style={{ backgroundColor: colors.surface.background }}
          >
            {stamp.image ? (
              <Image
                source={{ uri: stamp.image }}
                style={{ width: '100%', height: 80 }}
                resizeMode="cover"
              />
            ) : (
              <View
                className="items-center justify-center"
                style={{
                  width: '100%',
                  height: 80,
                  backgroundColor: colors.brand.neutrals
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={28}
                  color={colors.brand.secondary}
                />
              </View>
            )}
            <View className="gap-0.5 p-2">
              <AppText
                variant="caption"
                className="font-semibold"
                numberOfLines={2}
              >
                {stamp.placeName}
              </AppText>
              <View className="flex-row items-center gap-1">
                <Ionicons
                  name="checkmark-circle"
                  size={12}
                  color={colors.brand.primary}
                />
                <AppText
                  variant="caption"
                  style={{ color: colors.brand.primary }}
                >
                  {stamp.visitCount}×
                </AppText>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stamps, setStamps] = useState<StampEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUserProfile(), getStampCard().catch(() => [])])
      .then(([p, s]) => {
        setProfile(p);
        setStamps(s);
      })
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
              <AppText variant="caption" className="text-colors-text">
                {profile.xp} XP total
              </AppText>
            </View>
            <XpProgressBar xp={profile.xp} badge={profile.badge} />
          </View>
        ) : null}
      </View>

      {/* Stamp Card */}
      {!loading && <StampCardSection stamps={stamps} />}

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
