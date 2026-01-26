import { Button } from '@/components/Button';
import { Link } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16 }}
    >
      <View className="items-center">
        <Text className="text-lg font-semibold">Home</Text>
        <Link href="/(tabs)/trip-generator" asChild>
          <Button title="Curate New Trip" />
        </Link>
        <Link href="/(tabs)/home/gems" asChild>
          <Button title="Go to Gems" />
        </Link>
      </View>
    </ScrollView>
  );
}
