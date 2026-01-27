import { Pressable, Text } from 'react-native';
import { AppText } from './Text';

type ToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  onText?: string;
  offText?: string;
};

export function Toggle({
  value,
  onChange,
  onText = 'On',
  offText = 'Off'
}: ToggleProps) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      className={`rounded-full px-4 py-2 ${
        value ? 'bg-orange-500' : 'bg-gray-300'
      }`}
    >
      <AppText
        className={`text-sm font-semibold ${
          value ? 'text-white' : 'text-gray-700'
        }`}
      >
        {value ? onText : offText}
      </AppText>
    </Pressable>
  );
}
