import { AppText } from '@/components/AppText';
import { Pressable } from 'react-native';

export function Button({
  title,
  onPress
}: {
  title: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-full bg-colors-brand-primary px-4 py-3"
    >
      <AppText className="text-center font-semibold text-colors-text">
        {title}
      </AppText>
    </Pressable>
  );
}
