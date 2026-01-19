import { Link } from 'expo-router';
import { Text, View, FlatList } from 'react-native';
import { Button } from '@/components/Button';
import { placesMock } from '@/mock/places.mock';

export default function CommunityGemsScreen() {
  return (
    <View className="flex-1 bg-background px-6 pt-10">
      <Text className="mb-6 text-center text-lg font-semibold">
        Community-vetted Gems
      </Text>

      <FlatList
        data={placesMock}
        keyExtractor={item => item.placeId}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <Link href={`/places/${item.placeId}`} asChild>
            <Button title={item.placeName} />
          </Link>
        )}
      />
    </View>
  );
}
