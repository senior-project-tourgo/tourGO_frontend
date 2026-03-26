import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { AppText } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/theme/colors';
import { TripCard } from './cards/variants/TripCard';
import type { Trip } from '@/features/trip/trip.types';

export function TripSection({
  title,
  trips,
  collapsedLimit,
  cardProps
}: {
  title: string;
  trips: Trip[];
  collapsedLimit: number;
  cardProps: (t: Trip) => Omit<React.ComponentProps<typeof TripCard>, 'trip'>;
}) {
  const [expanded, setExpanded] = useState(false);
  if (!trips.length) return null;

  const hasMore = trips.length > collapsedLimit;
  const visible = expanded ? trips : trips.slice(0, collapsedLimit);
  const hiddenCount = trips.length - collapsedLimit;

  return (
    <View className="mb-6 gap-3">
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <AppText variant="subtitle" className="flex-1 font-semibold">
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

      {/* Cards */}
      {visible.map(t => (
        <TripCard key={t._id} trip={t} {...cardProps(t)} />
      ))}

      {/* Show more / less toggle */}
      {hasMore && (
        <Pressable
          onPress={() => setExpanded(prev => !prev)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#e2e8f0',
            backgroundColor: '#f8fafc'
          }}
        >
          <AppText variant="muted" style={{ fontWeight: '500' }}>
            {expanded ? 'Show less' : `Show ${hiddenCount} more`}
          </AppText>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color="#94a3b8"
          />
        </Pressable>
      )}
    </View>
  );
}
