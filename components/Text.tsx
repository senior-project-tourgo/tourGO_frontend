// components/AppText.tsx
import { Text, TextProps } from 'react-native';

export function AppText({ className = '', ...props }: TextProps) {
  return (
    <Text className={`font-inter text-colors-text ${className}`} {...props} />
  );
}
