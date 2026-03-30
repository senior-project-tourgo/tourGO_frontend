import { View, FlatList } from 'react-native';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import { TripCard } from './cards/variants/TripCard';
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
    <View style={{ marginBottom: 24 }}>
      {/* Header — Screen already provides 24px horizontal padding */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12
        }}
      >
        <AppText variant="subtitle" style={{ flex: 1, fontWeight: '600' }}>
          {title}
        </AppText>
        <View
          style={{
            backgroundColor: colors.brand.primary + '18',
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 2
          }}
        >
          <AppText
            variant="caption"
            style={{ color: colors.brand.primary, fontWeight: '600' }}
          >
            {trips.length}
          </AppText>
        </View>
      </View>

      {/* Cards start flush with the Screen's 24px left padding; right padding gives breathing room at end of scroll */}
      <FlatList
        horizontal
        data={trips}
        keyExtractor={t => t._id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 24, gap: 12 }}
        renderItem={({ item }) => <TripCard trip={item} {...cardProps(item)} />}
      />
    </View>
  );
}
