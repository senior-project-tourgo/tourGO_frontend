import { TextInput, TextInputProps } from 'react-native';

interface AppTextInputProps extends TextInputProps {
  className?: string;
}

export function AppTextInput({
  className = '',
  placeholderTextColor = '#999',
  editable = true,
  ...props
}: AppTextInputProps) {
  return (
    <TextInput
      className={`mb-4 h-14 rounded-full border border-gray-300 bg-gray-50 px-4 text-base text-colors-text ${className}`}
      style={{
        paddingVertical: 0,
        lineHeight: 18
      }}
      placeholderTextColor={placeholderTextColor}
      editable={editable}
      textAlignVertical="center"
      {...props}
    />
  );
}
