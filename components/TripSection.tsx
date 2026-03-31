import { View, FlatList } from 'react-native';
import { AppText } from '@/components/AppText';
import { TripCard } from './cards/variants/TripCard/TripCard';
import type { Trip } from '@/features/trip/trip.types';

export function TripSection({
  title,
  trips,
  cardProps
}: {
  title: string;
  trips: Trip[];
  cardProps: (t: Trip) => Omit<React.ComponentProps<typeof TripCard>, 'trip'>;
}) {
  if (!trips.length) return null;

  return (
    <View className="mb-6">
      {/* Header */}
      <View className="mb-3 flex-row items-center gap-2">
        <AppText variant="subtitle" className="flex-1 font-semibold">
          {title}
        </AppText>

        <View className="rounded-xl bg-colors-brand-primary/10 px-2 py-[2px]">
          <AppText variant="caption" className="font-semibold text-orange-500">
            {trips.length}
          </AppText>
        </View>
      </View>

      {/* Cards */}
      <FlatList
        horizontal
        data={trips}
        keyExtractor={t => t._id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 1,
          paddingRight: 24,
          paddingBottom: 8
        }}
        ItemSeparatorComponent={() => <View className="w-3" />}
        renderItem={({ item }) => <TripCard trip={item} {...cardProps(item)} />}
      />
    </View>
  );
}
