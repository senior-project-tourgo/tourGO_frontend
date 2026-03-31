import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';

interface TripMetaProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color?: string;
}

export function TripMeta({ icon, label, color }: TripMetaProps) {
  return (
    <View className="flex-row items-center gap-1">
      <Ionicons name={icon} size={13} color={color ?? '#000'} />
      <AppText variant="caption" style={color ? { color } : undefined}>
        {label}
      </AppText>
    </View>
  );
}
