import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/theme/colors';

export function StatCard({
  icon,
  value,
  label,
  color
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <View
      className="flex-1 items-center gap-1 rounded-2xl p-4 shadow-sm"
      style={{ backgroundColor: colors.surface.background }}
    >
      <Ionicons name={icon} size={24} color={color ?? colors.brand.primary} />

      <AppText variant="subtitle" className="font-semibold">
        {value}
      </AppText>

      <AppText variant="caption" className="text-center">
        {label}
      </AppText>
    </View>
  );
}
