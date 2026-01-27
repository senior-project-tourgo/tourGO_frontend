import { Link } from 'expo-router';
import { View, FlatList } from 'react-native';
import { AppText } from '@/components/Text';
import { Button } from '@/components/Button';
import { placesMock } from '@/mock/places.mock';

export default function CommunityGemsScreen() {
  return (
    <View className="bg-background flex-1 px-6 pt-10">
      <AppText className="mb-6 text-center text-lg font-semibold">
        Community-vetted Gems
      </AppText>

      <FlatList
        data={placesMock.filter(place => place.isActive)}
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
