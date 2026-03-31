import { View } from 'react-native';
import { AppText } from './AppText';

export function EmptyState({
  message,
  icon,
  action
}: {
  message: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <View className="items-center justify-center gap-2 py-10">
      {icon}
      <AppText className="text-center text-colors-surface-muted">
        {message}
      </AppText>
      {action}
    </View>
  );
}
