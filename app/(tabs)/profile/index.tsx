import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@/components/Button';

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-lg font-semibold">Profile</Text>
      <Link href="/(tabs)/profile/edit" asChild>
        <Button title="Edit Profile" />
      </Link>
      <Link href="/(tabs)/profile/trip-history" asChild>
        <Button title="Trips History" />
      </Link>
      <Link href="/(tabs)/profile/saved-deals" asChild>
        <Button title="Saved Deals" />
      </Link>
      <Link href="/(tabs)/profile/saved-places" asChild>
        <Button title="Saved Places" />
      </Link>
      <Link href="/leaderboard" asChild>
        <Button title="Leaderboard" />
      </Link>
    </View>
  );
}
