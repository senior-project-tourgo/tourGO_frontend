import { View } from 'react-native';
import { AppText } from './AppText';

export function EmptyState({ message }: { message: string }) {
  return (
    <View className="items-center justify-center py-10">
      <AppText className="text-colors-surface-muted">{message}</AppText>
    </View>
  );
}
