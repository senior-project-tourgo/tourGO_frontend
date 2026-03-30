import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import { ActivityIndicator, View } from 'react-native';

export function CenteredLoading({
  message = 'Loading…'
}: {
  message?: string;
}) {
  return (
    <View className="flex-1 items-center justify-center bg-colors-surface-background">
      <ActivityIndicator size="large" color={colors.brand.primary} />
      <AppText variant="muted" className="mt-3">
        {message}
      </AppText>
    </View>
  );
}
