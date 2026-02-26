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
      className={`h-14 flex-1 items-center justify-center rounded-full ${
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
