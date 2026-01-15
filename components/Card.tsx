import { View } from 'react-native';

export function Card({ children }: { children: React.ReactNode }) {
  return <View className="rounded-xl bg-white p-4 shadow-sm">{children}</View>;
}
