import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Link } from 'expo-router';
import { View } from 'react-native';

export default function TripGeneratorScreen() {
  return (
    <View className="bg-background flex-1 items-center justify-center">
      <AppText className="text-lg font-semibold">Trip Generator</AppText>
      <Link href="/(tabs)/trip-generator/vibe-selector" asChild>
        <Button title="Select Vibes" />
      </Link>
    </View>
  );
}
