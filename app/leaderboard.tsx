import { AppText } from '@/components/AppText';
import { View } from 'react-native';

export default function LeaderboardScreen() {
  return (
    <View className="bg-background flex-1 items-center justify-center">
      <AppText className="text-lg font-semibold">Leaderboard</AppText>
    </View>
  );
}
