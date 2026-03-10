import { View } from 'react-native';
import { ReactNode } from 'react';
import { AppText } from './AppText';

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  hasValue?: boolean;
  children: ReactNode;
}

export function FormField({
  label,
  required = false,
  error,
  hasValue = false,
  children
}: FormFieldProps) {
  const hasError = !!error;

  return (
    <View className="w-full gap-1">
      {label && (
        <AppText>
          {label}
          {required && <AppText className="text-red-500"> *</AppText>}
        </AppText>
      )}

      <View
        className={`h-14 justify-center rounded-full border px-4
        ${hasValue ? 'bg-white' : 'bg-gray-100'}
        ${hasError ? 'border-red-500' : 'border-gray-300'}`}
      >
        {children}
      </View>

      {hasError && <AppText className="text-sm text-red-500">{error}</AppText>}
    </View>
  );
}
