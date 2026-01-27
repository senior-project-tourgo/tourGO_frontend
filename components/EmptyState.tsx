import { View } from 'react-native';
import { AppText } from './Text';

export function EmptyState({ message }: { message: string }) {
  return (
    <View className="items-center justify-center py-10">
      <AppText className="text-muted">{message}</AppText>
    </View>
  );
}
