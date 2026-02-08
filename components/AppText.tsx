// components/AppText.tsx
import { Text, TextProps } from 'react-native';

type TextVariant = 'body' | 'title' | 'subtitle' | 'caption' | 'muted';

type AppTextProps = TextProps & {
  variant?: TextVariant;
};

const variantClasses: Record<TextVariant, string> = {
  body: 'text-base',
  title: 'text-3xl font-inter-semibold',
  subtitle: 'text-base font-inter-medium',
  caption: 'text-xs',
  muted: 'text-sm'
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
