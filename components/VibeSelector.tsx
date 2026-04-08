import { ScrollView, Pressable, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { VIBES } from '@/constants/vibes/vibes';
import { VIBE_ICONS } from '@/constants/vibes/vibesIcon';
import colors from '@/theme/colors';
import { Badge } from '@/components/Badge';
import { useMemo } from 'react';

interface Props {
  selectedVibe: string;
  setSelectedVibe: (vibe: string) => void;
  topVibes: string[];
}

export function VibeSelector({
  selectedVibe,
  setSelectedVibe,
  topVibes
}: Props) {
  // ✅ Dedup + stable ordering
  const vibeChips = useMemo(() => {
    const map = new Map<string, { id: string; title: string }>();

    map.set('all', { id: 'all', title: 'All' });

    // Top vibes first
    topVibes.forEach(id => {
      const vibe = VIBES.find(v => v.id === id);
      if (vibe) map.set(vibe.id, vibe);
    });

    // Then the rest
    VIBES.forEach(vibe => {
      if (!map.has(vibe.id)) {
        map.set(vibe.id, vibe);
      }
    });

    return Array.from(map.values());
  }, [topVibes]);

  return (
    <View className="pb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-2.5"
      >
        {vibeChips.map(chip => {
          const isSelected = selectedVibe === chip.id;
          const isTopVibe = topVibes.includes(chip.id);

          return (
            <Pressable
              key={chip.id}
              onPress={() => setSelectedVibe(chip.id)}
              android_ripple={{ color: 'rgba(0,0,0,0.05)', borderless: true }}
              className="flex-row items-center gap-2 rounded-full border-[1.5px] px-3.5 py-2"
              style={{
                backgroundColor: isSelected
                  ? colors.brand.primary
                  : colors.brand.neutrals,
                borderColor: isSelected
                  ? colors.brand.primary
                  : colors.brand.neutrals
              }}
            >
              {/* Icon */}
              <Ionicons
                name={
                  chip.id === 'all'
                    ? 'apps-outline'
                    : (VIBE_ICONS[chip.id] ?? 'sparkles-outline')
                }
                size={16}
                color={isSelected ? 'white' : colors.brand.secondary}
              />

              {/* Label */}
              <AppText
                className="text-[13px] font-semibold"
                style={{
                  color: isSelected ? 'white' : colors.brand.secondary
                }}
              >
                {chip.title}
              </AppText>

              {/* 🔥 Top vibe badge */}
              {!isSelected && chip.id !== 'all' && isTopVibe && (
                <View className="ml-1">
                  <Badge
                    iconName="flame"
                    bgColor={colors.brand.primary}
                    textColor="white"
                  />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
