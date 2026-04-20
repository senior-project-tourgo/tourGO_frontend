import { Text, TextProps } from 'react-native';

type TextVariant =
  | 'body'
  | 'title'
  | 'subtitle'
  | 'caption'
  | 'muted'
  | 'heading24'
  | 'review';

type AppTextProps = TextProps & {
  variant?: TextVariant;
};

const variantClasses: Record<TextVariant, string> = {
  body: 'text-base font-inter',
  title: 'text-3xl font-inter-semibold',
  subtitle: 'text-lg font-inter-medium',
  caption: 'text-xs font-inter',
  muted: 'text-sm font-inter',
  heading24: 'text-2xl font-inter-semibold',
  review: 'text-[40px] font-inter-medium'
};

export function AppText({
  variant = 'body',
  className = '',
  ...props
}: AppTextProps) {
  return variant === 'review' ? (
    <Text
      className={`text-colors-brand-primary ${variantClasses[variant]} ${className}`}
      {...props}
    />
  ) : (
    <Text
      className={`text-colors-text ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
