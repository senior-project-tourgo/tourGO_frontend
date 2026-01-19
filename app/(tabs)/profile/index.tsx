import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@/components/Button';

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-lg font-semibold">Profile</Text>
      <Link href="/(tabs)/profile/edit" asChild>
        <Button title="Edit Profile"></Button>
      </Link>
      <Link href="/(tabs)/profile/itinerary-history" asChild>
        <Button title="Itineraries History"></Button>
      </Link>
      <Link href="/(tabs)/profile/saved-deals" asChild>
        <Button title="Saved Deals"></Button>
      </Link>
      <Link href="/(tabs)/profile/saved-places" asChild>
        <Button title="Saved Places"></Button>
      </Link>
      <Link href="/leaderboard" asChild>
        <Button title="Leaderboard"></Button>
      </Link>
    </View>
  );
}
