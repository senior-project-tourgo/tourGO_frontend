import { View, ActivityIndicator } from 'react-native';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import { XpBar } from './Xpbar';
import type { UserProfile } from '@/services/user.service';

type Props = {
  name?: string;
  username?: string;
  initials: string;
  profile: UserProfile | null;
  loading: boolean;
};

export function ProfileHeader({
  name,
  username,
  initials,
  profile,
  loading
}: Props) {
  return (
    <View className="items-center gap-4 pb-6">
      {/* Avatar */}
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

      {/* Name */}
      <View className="items-center gap-0.5">
        <AppText variant="subtitle" className="font-semibold">
          {name ?? '—'}
        </AppText>
        <AppText variant="muted">@{username ?? '—'}</AppText>
      </View>

      {/* XP / Badge */}
      {loading ? (
        <ActivityIndicator color={colors.brand.primary} />
      ) : profile ? (
        <View
          className="w-full gap-2 rounded-2xl border p-4"
          style={{ backgroundColor: colors.surface.background }}
        >
          {/* Top row */}
          <View className="flex-row items-center justify-between">
            <AppText variant="caption" className="font-semibold">
              🏅 {profile.badge}
            </AppText>
            <AppText variant="caption">{profile.xp} XP total</AppText>
          </View>

          {/* Progress bar */}
          <XpBar
            current={profile.xp} // ✅ FIXED
            badge={profile.badge}
          />
        </View>
      ) : null}
    </View>
  );
}
