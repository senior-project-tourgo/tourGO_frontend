import { Button } from '@/components/Button';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-lg font-semibold">Home</Text>
      <Link href="/(tabs)/home/gems" push asChild>
        <Button title="Go to Gems" />
      </Link>
    </View>
  );
}
