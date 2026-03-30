// components/PlaceRow.tsx
import { View, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import type { Place } from '@/features/place/place.types';

export default function PlaceRow({
  place,
  distanceKm,
  added,
  onAdd
}: {
  place: Place;
  distanceKm: number | null;
  added: boolean;
  onAdd: () => void;
}) {
  return (
    <Pressable
      onPress={added ? undefined : onAdd}
      className={`flex-row items-center gap-3 px-5 py-3 ${added ? 'bg-blue-50' : 'bg-white'}`}
    >
      <Image
        source={{ uri: place.image }}
        className="h-14 w-14 rounded-xl bg-slate-100"
        resizeMode="cover"
      />

      <View className="flex-1 gap-[2px]">
        <AppText variant="subtitle" className="text-sm">
          {place.placeName}
        </AppText>

        <View className="flex-row items-center gap-1.5">
          <Ionicons name="location-outline" size={12} color="#94a3b8" />
          <AppText variant="muted" className="text-xs">
            {place.location.area}
          </AppText>

          {distanceKm !== null && (
            <>
              <AppText variant="muted" className="text-xs">
                ·
              </AppText>
              <AppText variant="muted" className="text-xs">
                {distanceKm < 1
                  ? `${Math.round(distanceKm * 1000)} m away`
                  : `${distanceKm.toFixed(1)} km away`}
              </AppText>
            </>
          )}
        </View>

        <View className="flex-row items-center gap-1">
          <Ionicons name="star" size={11} color={colors.brand.primary} />
          <AppText variant="muted" className="text-xs">
            {place.averageRating} · {place.priceRange}
          </AppText>
        </View>
      </View>

      <Pressable
        onPress={added ? undefined : onAdd}
        className={`h-[34px] w-[34px] items-center justify-center rounded-full ${added ? 'bg-green-100' : ''}`}
        style={!added ? { backgroundColor: colors.brand.primary } : undefined}
        hitSlop={8}
      >
        <Ionicons
          name={added ? 'checkmark' : 'add'}
          size={18}
          color={added ? '#16a34a' : '#fff'}
        />
      </Pressable>
    </Pressable>
  );
}
