import { Link } from 'expo-router';
import { View, Text } from 'react-native';
import { Button } from '@/components/Button';

export default function ItinerariesScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-lg font-semibold">Itinerary</Text>
      <Link href="/(tabs)/itinerary-generator" replace>
        <Button title="Itinerary Generator"></Button>
      </Link>
    </View>
  );
}
