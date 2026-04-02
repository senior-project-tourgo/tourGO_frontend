import { Screen } from '@/components/Screen';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

import { NavRow } from '@/components/NavRow';
import { StampCardSection } from '@/components/StampCardSection';
import { ProfileHeader } from '@/components/ProfileHeader';
import { useProfileData } from '@/hooks/profile/useProfileData';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { profile, stamps, loading } = useProfileData();

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
      <ProfileHeader
        name={user?.name}
        username={user?.username}
        initials={initials}
        profile={profile}
        loading={loading}
      />
      <View className="my-3">
        {!loading && <StampCardSection stamps={stamps} />}
      </View>

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
