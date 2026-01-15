import { Text } from 'react-native';

export function Badge({ label }: { label: string }) {
  return (
    <Text className="rounded-full bg-secondary px-3 py-1 text-xs text-white">
      {label}
    </Text>
  );
}
