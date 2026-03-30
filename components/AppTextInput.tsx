import React, { forwardRef, ReactNode } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { FormField } from './FormField';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  rightIcon?: ReactNode;
}

export const AppTextInput = forwardRef<TextInput, AppTextInputProps>(
  (
    {
      label,
      error,
      required,
      value,
      placeholderTextColor = '#999',
      rightIcon,
      ...props
    },
    ref
  ) => {
    const hasValue = !!value && value.toString().length > 0;

    return (
      <FormField
        label={label}
        required={required}
        error={error}
        hasValue={hasValue}
      >
        <View className="relative w-full">
          <TextInput
            ref={ref}
            value={value}
            placeholderTextColor={placeholderTextColor}
            className={`text-base text-colors-text ${rightIcon ? 'pr-8' : 'pr-1'}`}
            style={{
              paddingTop: 0, // push text slightly down
              lineHeight: 18
            }}
            {...props}
          />
          {rightIcon && (
            <View className="absolute right-0 top-1/2 -translate-y-1/2">
              {rightIcon}
            </View>
          )}
        </View>
      </FormField>
    );
  }
);
AppTextInput.displayName = 'AppTextInput';
