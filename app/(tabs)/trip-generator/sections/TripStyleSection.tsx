import { View } from 'react-native';
import { Accordion } from '@/components/Accordion';
import { AppText } from '@/components/AppText';
import { IconTile } from '@/components/IconTile';
import SelectableChips from '@/components/SelectableChips';
import { PACE_OPTIONS, type PaceValue } from '@/constants/paceOptions';
import {
  TRANSPORT_OPTIONS,
  type TransportMode
} from '@/constants/transportOptions';
import { GROUP_TYPES, type GroupType } from '@/mock/groupTypes.mock';
import { Ionicons } from '@expo/vector-icons';

type TripStyleSectionProps = {
  pace: PaceValue;
  setPace: (value: PaceValue) => void;
  transportMode: TransportMode | null;
  setTransportMode: (mode: TransportMode) => void;
  groupType: GroupType | null;
  setGroupType: (gt: GroupType) => void;
  people: number;
  setPeople: (num: number) => void;
};

export default function TripStyleSection({
  pace,
  setPace,
  transportMode,
  setTransportMode,
  groupType,
  setGroupType,
  people,
  setPeople
}: TripStyleSectionProps) {
  const handleGroupTypeSelect = (gt: GroupType) => {
    setGroupType(gt);
    setPeople(gt.defaultPeople);
  };

  const styleSummary =
    [
      pace === 'relaxed'
        ? 'Relaxed'
        : pace === 'packed'
          ? 'Packed'
          : 'Balanced',
      transportMode
        ? TRANSPORT_OPTIONS.find(o => o.value === transportMode)?.label
        : null
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

      <SelectableChips
        title="Who are you traveling with?"
        options={GROUP_TYPES}
        selectedOption={groupType}
        onSelect={handleGroupTypeSelect}
      />

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
    </Accordion>
  );
}
