import { View } from 'react-native';
import { Accordion } from '@/components/Accordion';
import { AppText } from '@/components/AppText';
import { IconTile } from '@/components/IconTile';
import { PACE_OPTIONS, type PaceValue } from '@/constants/paceOptions';
import {
  TRANSPORT_OPTIONS,
  type TransportMode
} from '@/constants/transportOptions';
import { type PriceRange } from '@/features/place/place.types';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { BUDGET_TIERS } from '@/constants/budgetOptions';

type TripStyleSectionProps = {
  pace: PaceValue;
  setPace: (value: PaceValue) => void;
  transportMode: TransportMode | null;
  setTransportMode: (mode: TransportMode) => void;
  budgetTier: PriceRange | null;
  setBudgetTier: (value: PriceRange | null) => void;
};

export default function TripStyleSection({
  pace,
  setPace,
  transportMode,
  setTransportMode,
  budgetTier,
  setBudgetTier
}: TripStyleSectionProps) {
  const styleSummary =
    [
      pace === 'relaxed'
        ? 'Relaxed'
        : pace === 'packed'
          ? 'Packed'
          : 'Balanced',
      transportMode
        ? TRANSPORT_OPTIONS.find(o => o.value === transportMode)?.label
        : null,
      budgetTier ?? null
    ]
      .filter(Boolean)
      .join(' · ') || undefined;

  const renderDollarDots = (value: PriceRange) => {
    return '$'.repeat(value.length);
  };

  return (
    <Accordion
      icon="speedometer-outline"
      title="How packed should your trip be?"
      summary={styleSummary}
      completed={!!transportMode}
    >
      <View className="space-y-1.5">
        <AppText className="font-medium">Pace</AppText>
        <View className="flex-row gap-2.5">
          {PACE_OPTIONS.map(option => (
            <IconTile
              key={option.value}
              icon={option.icon as keyof typeof Ionicons.glyphMap}
              label={option.label}
              description={option.description}
              selected={pace === option.value}
              onPress={() => setPace(option.value)}
              width="31%"
            />
          ))}
        </View>
      </View>

      <View className="space-y-1.5">
        <AppText className="font-medium">Transport</AppText>
        <View className="flex-row flex-wrap gap-2.5">
          {TRANSPORT_OPTIONS.map(option => (
            <IconTile
              key={option.value}
              icon={option.icon as any}
              label={option.label}
              selected={transportMode === option.value}
              onPress={() => setTransportMode(option.value as TransportMode)}
              width="47%"
            />
          ))}
        </View>
      </View>

      <View className="space-y-1.5">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons
            name="wallet-outline"
            size={14}
            color={colors.brand.secondary}
          />
          <AppText className="font-medium">Budget (optional)</AppText>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {BUDGET_TIERS.map(tier => (
            <IconTile
              key={tier.value}
              icon="cash-outline"
              label={renderDollarDots(tier.value)}
              description={`${tier.npr}\n${tier.desc}`}
              selected={budgetTier === tier.value}
              onPress={() =>
                setBudgetTier(budgetTier === tier.value ? null : tier.value)
              }
              width="24%"
            />
          ))}
        </View>
      </View>
    </Accordion>
  );
}
