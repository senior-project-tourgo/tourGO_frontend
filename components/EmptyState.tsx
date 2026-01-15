import { View, Text } from 'react-native';

export function EmptyState({ message }: { message: string }) {
  return (
    <View className="items-center justify-center py-10">
      <Text className="text-muted">{message}</Text>
    </View>
  );
}
