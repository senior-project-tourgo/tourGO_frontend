import { TextInput, TextInputProps } from 'react-native';
import { FormField } from './FormField';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export function AppTextInput({
  label,
  error,
  required,
  value,
  placeholderTextColor = '#999',
  ...props
}: AppTextInputProps) {
  const hasValue = !!value && value.toString().length > 0;

  return (
    <FormField
      label={label}
      required={required}
      error={error}
      hasValue={hasValue}
    >
      <TextInput
        value={value}
        placeholderTextColor={placeholderTextColor}
        className="text-base text-colors-text"
        style={{
          paddingVertical: 0,
          lineHeight: 18
        }}
        {...props}
      />
    </FormField>
  );
}
