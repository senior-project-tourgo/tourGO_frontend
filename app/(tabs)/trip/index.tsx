import { Link } from 'expo-router';
import { View } from 'react-native';
import { Button } from '@/components/Button';
import { AppText } from '@/components/Text';

export default function TripScreen() {
  return (
    <View className="bg-background flex-1 items-center justify-center">
      <AppText className="text-lg font-semibold">Trip</AppText>
      <Link href="/(tabs)/trip-generator" asChild>
        <Button title="Trip Generator" />
      </Link>
    </View>
  );
}
