import React from 'react';
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
      className={`mb-4 rounded-full border border-gray-300 bg-gray-50 px-4 py-3 text-base text-colors-text ${className}`}
      placeholderTextColor={placeholderTextColor}
      editable={editable}
      {...props}
    />
  );
}
