import { AppText } from '@/components/AppText';
import { ActivityIndicator, Pressable } from 'react-native';

export function Button({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  className = ''
}: {
  title: string;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`rounded-full px-4 py-3 ${
        isDisabled ? 'bg-colors-surface-muted' : 'bg-colors-brand-primary'
      } ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <AppText className="text-center font-semibold text-colors-text-inverse">
          {title}
        </AppText>
      )}
    </Pressable>
  );
}
