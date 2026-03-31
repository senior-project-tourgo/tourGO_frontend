import { ScrollView, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import type { StampEntry } from '@/services/user.service';

export function StampCardSection({ stamps }: { stamps: StampEntry[] }) {
  if (stamps.length === 0) {
    return (
      <View className="gap-3">
        <AppText variant="body" className="font-semibold">
          Stamp Card
        </AppText>

        <View
          className="items-center rounded-2xl p-6"
          style={{ backgroundColor: colors.surface.background }}
        >
          <Ionicons
            name="map-outline"
            size={32}
            color={colors.brand.secondary}
          />
          <AppText variant="muted" className="mt-2 text-center">
            No stamps yet. Start a trip to collect stamps!
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View className="gap-3">
      <AppText variant="body" className="font-semibold">
        Stamp Card
      </AppText>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stamps.map(stamp => (
          <View
            key={stamp.placeId}
            className="mx-1.5"
            style={{
              shadowColor: '#000',

              // 👇 softer + more natural
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.06,
              shadowRadius: 12,

              // Android (lower = softer)
              elevation: 2
            }}
          >
            <View
              className="w-28 overflow-hidden rounded-2xl"
              style={{ backgroundColor: colors.surface.background }}
            >
              {stamp.image ? (
                <Image
                  source={{ uri: stamp.image }}
                  style={{ width: '100%', height: 80 }}
                />
              ) : (
                <View
                  className="items-center justify-center"
                  style={{
                    width: '100%',
                    height: 80,
                    backgroundColor: colors.brand.neutrals
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={28}
                    color={colors.brand.secondary}
                  />
                </View>
              )}

              <View className="gap-0.5 p-2">
                <AppText variant="caption" numberOfLines={2}>
                  {stamp.placeName}
                </AppText>

                <View className="flex-row items-center gap-1">
                  <Ionicons
                    name="checkmark-circle"
                    size={12}
                    color={colors.brand.primary}
                  />
                  <AppText variant="caption">{stamp.visitCount}×</AppText>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
