import { View } from 'react-native';
import { ReactNode } from 'react';

export type BaseCardProps = {
  children?: ReactNode;
  className?: string;
};

export function BaseCard({ children }: { children: React.ReactNode }) {
  return <View className="rounded-xl bg-white p-4 shadow-sm">{children}</View>;
}
