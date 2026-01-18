import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '@/components/Button';

export default function CommunityGemsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-lg font-semibold">Community-vetted Gems</Text>
      <Link href="/places/1" asChild>
        <Button title="Place 1"></Button>
      </Link>
      <Link href="/places/2" asChild>
        <Button title="Place 2"></Button>
      </Link>
      <Link href="/places/3" asChild>
        <Button title="Place 3"></Button>
      </Link>
    </View>
  );
}
