import { AppText } from '@/components/AppText';
import { View } from 'react-native';

export default function HistoryScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-colors-surface-background">
      <AppText className="text-lg font-semibold">History</AppText>
    </View>
  );
}
