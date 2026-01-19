import { Link } from 'expo-router';
import { View, Text } from 'react-native';
import { Button } from '@/components/Button';

export default function RewardsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-lg font-semibold">Rewards</Text>
      <Link href="/leaderboard" asChild>
        <Button title="Leaderboard"></Button>
      </Link>
    </View>
  );
}
