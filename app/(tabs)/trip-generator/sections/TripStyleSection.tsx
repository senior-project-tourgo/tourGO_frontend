import { Pressable, View } from 'react-native';
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

const BUDGET_TIERS: {
  value: PriceRange;
  symbol: string;
  npr: string;
  desc: string;
}[] = [
  { value: '$', symbol: '$', npr: 'रु 500', desc: 'Budget' },
  { value: '$$', symbol: '$$', npr: 'रु 500–1,500', desc: 'Moderate' },
  { value: '$$$', symbol: '$$$', npr: 'रु 1,500–4k', desc: 'Upscale' },
  { value: '$$$$', symbol: '$$$$', npr: 'रु 4,000+', desc: 'Luxury' }
];

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
          {BUDGET_TIERS.map(tier => {
            const active = budgetTier === tier.value;
            return (
              <Pressable
                key={tier.value}
                onPress={() => setBudgetTier(active ? null : tier.value)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 4,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: active
                    ? colors.brand.primary
                    : colors.brand.neutrals,
                  backgroundColor: active ? colors.brand.primary : 'transparent'
                }}
              >
                <AppText
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: active ? 'white' : colors.brand.secondary
                  }}
                >
                  {tier.symbol}
                </AppText>
                <AppText
                  style={{
                    fontSize: 9,
                    color: active
                      ? 'rgba(255,255,255,0.9)'
                      : colors.brand.primary,
                    marginTop: 2,
                    fontWeight: '600'
                  }}
                >
                  {tier.npr}
                </AppText>
                <AppText
                  style={{
                    fontSize: 9,
                    color: active ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                    marginTop: 1
                  }}
                >
                  {tier.desc}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Accordion>
  );
}
