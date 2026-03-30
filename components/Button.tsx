import { AppText } from '@/components/AppText';
import { ActivityIndicator, Pressable } from 'react-native';

export function Button({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  className = '',
  textColor = '#fff'
}: {
  title: string;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  textColor?: string; // default white, can be changed
}) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`h-14 items-center justify-center rounded-full ${
        isDisabled ? 'bg-colors-surface-muted' : 'bg-colors-brand-primary'
      } ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <AppText
          style={{ color: textColor }}
          className={`text-center font-semibold`}
        >
          {title}
        </AppText>
      )}
    </Pressable>
  );
}
