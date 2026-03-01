import { Text, TextProps } from 'react-native';

type TextVariant =
  | 'body'
  | 'title'
  | 'subtitle'
  | 'caption'
  | 'muted'
  | 'heading24';

type AppTextProps = TextProps & {
  variant?: TextVariant;
};

const variantClasses: Record<TextVariant, string> = {
  body: 'text-base font-inter',
  title: 'text-3xl font-inter-semibold',
  subtitle: 'text-lg font-inter-medium',
  caption: 'text-xs font-inter',
  muted: 'text-sm font-inter',
  heading24: 'text-2xl font-inter-semibold'
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
