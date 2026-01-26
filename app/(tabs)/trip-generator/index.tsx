import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@/components/Button';

export default function TripGeneratorScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-lg font-semibold">Trip Generator</Text>
      <Link href="/(tabs)/trip-generator/vibe-selector" asChild>
        <Button title="Select Vibes"></Button>
      </Link>
    </View>
  );
}
