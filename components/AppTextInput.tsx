import React, { forwardRef, ReactNode } from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { FormField } from './FormField';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  rightIcon?: ReactNode; // NEW: icon or component on the right
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
        <View style={styles.container}>
          <TextInput
            ref={ref}
            value={value}
            placeholderTextColor={placeholderTextColor}
            style={[styles.input, rightIcon ? { paddingRight: 30 } : {}]}
            {...props}
          />
          {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
        </View>
      </FormField>
    );
  }
);

AppTextInput.displayName = 'AppTextInput';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%'
  },
  input: {
    fontSize: 16,
    lineHeight: 18,
    paddingVertical: 0,
    color: '#000'
  },
  icon: {
    position: 'absolute',
    right: 5,
    top: '50%',
    transform: [{ translateY: -8 }]
  }
});
