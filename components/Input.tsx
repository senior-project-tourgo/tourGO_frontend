import { View, Text, TextInput } from 'react-native';

type InputProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function Input({ label, value, onChangeText, placeholder }: InputProps) {
  return (
    <View className="w-full">
      {label && <Text className="mb-1 text-sm text-gray-500">{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base"
      />
    </View>
  );
}
