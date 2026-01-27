import { AppText } from '@/components/Text';
import { Pressable } from 'react-native';

export function Button({
  title,
  onPress
}: {
  title: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="bg-primary rounded-full px-4 py-3">
      <AppText className="text-center font-semibold text-text">{title}</AppText>
    </Pressable>
  );
}
