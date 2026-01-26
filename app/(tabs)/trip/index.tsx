import { Link } from 'expo-router';
import { View, Text } from 'react-native';
import { Button } from '@/components/Button';

export default function TripScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-lg font-semibold">Trip</Text>
      <Link href="/(tabs)/trip-generator" asChild>
        <Button title="Trip Generator"></Button>
      </Link>
    </View>
  );
}
