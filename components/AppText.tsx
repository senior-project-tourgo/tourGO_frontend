// components/AppText.tsx
import { Text, TextProps } from 'react-native';

type TextVariant = 'body' | 'title' | 'subtitle' | 'caption' | 'muted';

type AppTextProps = TextProps & {
  variant?: TextVariant;
};

const variantClasses: Record<TextVariant, string> = {
  body: 'text-base',
  title: 'text-lg font-semibold',
  subtitle: 'text-base font-medium',
  caption: 'text-xs',
  muted: 'text-sm text-colors-surface-muted'
};

export function AppText({
  variant = 'body',
  className = '',
  ...props
}: AppTextProps) {
  return (
    <Text
      className={`font-inter text-colors-text ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
