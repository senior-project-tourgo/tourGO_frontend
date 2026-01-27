import { Button } from '@/components/Button';
import { Link } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { AppText } from '@/components/Text';

export default function HomeScreen() {
  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerStyle={{ padding: 16 }}
    >
      <View className="items-center">
        <AppText className="text-lg font-semibold">Home</AppText>
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
