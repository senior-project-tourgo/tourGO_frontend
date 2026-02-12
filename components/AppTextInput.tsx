import { View, TextInput, TextInputProps } from 'react-native';
import { AppText } from './AppText';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export function AppTextInput({
  label,
  error,
  required = false,
  className = '',
  placeholderTextColor = '#999',
  editable = true,
  ...props
}: AppTextInputProps) {
  const hasError = !!error;

  return (
    <View className="w-full">
      {/* Label */}
      {label && (
        <AppText>
          {label}
          {required && <AppText className="text-red-500"> *</AppText>}
        </AppText>
      )}

      {/* Input */}
      <TextInput
        className={`h-14 rounded-full border bg-gray-50 px-4 text-base text-colors-text ${
          hasError ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        style={{
          paddingVertical: 0,
          lineHeight: 18
        }}
        placeholderTextColor={placeholderTextColor}
        editable={editable}
        textAlignVertical="center"
        {...props}
      />

      {/* Error Message */}
      {hasError && (
        <AppText className="mt-1 text-sm text-red-500">{error}</AppText>
      )}
    </View>
  );
}
