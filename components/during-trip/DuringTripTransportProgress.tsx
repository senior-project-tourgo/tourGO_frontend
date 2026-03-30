import { AppText } from '@/components/AppText';
import type { TransportMode } from '@/services/directions.service';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';

const MODE_OPTIONS: {
  mode: TransportMode;
  icon: 'car-outline' | 'walk-outline';
}[] = [
  { mode: 'driving', icon: 'car-outline' },
  { mode: 'walking', icon: 'walk-outline' }
];

interface DuringTripTransportProgressProps {
  transportMode: TransportMode;
  onTransportModeChange: (mode: TransportMode) => void;
  tripXp: number;
  visitedCount: number;
  totalCount: number;
  progress: number;
}

export function DuringTripTransportProgress({
  transportMode,
  onTransportModeChange,
  tripXp,
  visitedCount,
  totalCount,
  progress
}: DuringTripTransportProgressProps) {
  return (
    <View className="absolute left-4 right-4 z-10" style={{ top: 108 }}>
      <View className="mb-2 flex-row gap-0.5 self-center rounded-full bg-white p-1 shadow-sm">
        {MODE_OPTIONS.map(({ mode, icon }) => (
          <TouchableOpacity
            key={mode}
            onPress={() => onTransportModeChange(mode)}
            className={`rounded-full px-[14px] py-[7px] ${
              transportMode === mode ? 'bg-colors-brand-primary' : ''
            }`}
          >
            <Ionicons
              name={icon}
              size={18}
              color={transportMode === mode ? '#fff' : '#94a3b8'}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View className="rounded-xl bg-colors-surface-background px-4 pb-3 pt-[10px] shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Ionicons name="star" size={14} color={colors.brand.primary} />
            <AppText
              variant="caption"
              className="font-semibold"
              style={{ color: colors.brand.primary }}
            >
              {tripXp} XP earned
            </AppText>
          </View>
          <AppText variant="caption" className="font-semibold">
            {visitedCount}/{totalCount} stops
          </AppText>
        </View>

        <View className="mt-2 h-1 overflow-hidden rounded bg-colors-brand-neutrals">
          <View
            style={{
              height: 4,
              width: `${Math.round(progress * 100)}%`,
              backgroundColor: colors.brand.primary,
              borderRadius: 2
            }}
          />
        </View>
      </View>
    </View>
  );
}
