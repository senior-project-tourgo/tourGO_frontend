import { Pressable, View } from 'react-native';
import { AppText } from '@/components/AppText';

export function NoPlaceCard({
  title,
  subtitle,
  onPress
}: {
  title: string;
  subtitle?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="h-60 w-96 items-center justify-center rounded-2xl bg-white shadow-sm"
    >
      <View className="items-center gap-2">
        <AppText className="text-lg font-semibold">{title}</AppText>

        {subtitle && <AppText variant="muted">{subtitle}</AppText>}
      </View>
    </Pressable>
  );
}
