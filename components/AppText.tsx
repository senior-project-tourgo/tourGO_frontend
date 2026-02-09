// components/AppText.tsx
import { Text, TextProps } from 'react-native';

type TextVariant = 'body' | 'title' | 'subtitle' | 'caption' | 'muted';

type AppTextProps = TextProps & {
  variant?: TextVariant;
};

const variantClasses: Record<TextVariant, string> = {
  body: 'text-base font-inter',
  title: 'text-3xl font-inter-semibold',
  subtitle: 'text-lg font-inter-medium',
  caption: 'text-xs font-inter',
  muted: 'text-sm font-inter'
};

export function AppText({
  variant = 'body',
  className = '',
  ...props
}: AppTextProps) {
  return (
    <Text
      className={`text-colors-text ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
