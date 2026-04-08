import { ScrollView, Pressable, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { VIBES } from '@/constants/vibes/vibes';
import { VIBE_ICONS } from '@/constants/vibes/vibesIcon';
import colors from '@/theme/colors';
import { Badge } from '@/components/Badge';

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
  const vibeChips = [
    { id: 'all', title: 'All' },
    ...topVibes.map(id => VIBES.find(v => v.id === id)).filter(Boolean),
    ...VIBES.filter(v => !topVibes.includes(v.id))
  ] as { id: string; title: string }[];

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

              {/* 🔥 Badge instead of dot */}
              {!isSelected && chip.id !== 'all' && isTopVibe && (
                <Badge
                  iconName="sparkles"
                  bgColor={colors.brand.primary}
                  textColor="white"
                />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
