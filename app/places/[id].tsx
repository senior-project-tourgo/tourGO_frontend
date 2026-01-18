import { Text, View } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

export default function PlaceDetails() {
  const { id } = useLocalSearchParams();
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Stack.Screen options={{ title: `Place ${id}` }} />
      <Text className="text-lg font-semibold">Place {id} Details</Text>
    </View>
  );
}
