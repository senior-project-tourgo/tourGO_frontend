import { View } from 'react-native';
import { ReactNode } from 'react';

export type BaseCardProps = {
  children?: ReactNode;
  className?: string;
};

export function BaseCard({ children, className }: BaseCardProps) {
  return (
    <View
      className={`rounded-xl bg-white p-4 shadow-sm${className ? ` ${className}` : ''}`}
    >
      {children}
    </View>
  );
}
