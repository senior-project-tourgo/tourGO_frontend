import { Pressable, Text } from 'react-native';

export function Button({
  title,
  onPress
}: {
  title: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="rounded-xl bg-primary px-4 py-3">
      <Text className="text-center font-semibold text-white">{title}</Text>
    </Pressable>
  );
}
