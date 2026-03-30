import { View } from 'react-native';
import { ReactNode } from 'react';
import { AppText } from './AppText';
import colors from '@/theme/colors';

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
          {required && (
            <AppText style={{ color: colors.status.error }}> *</AppText>
          )}
        </AppText>
      )}

      <View
        className={`h-14 justify-center rounded-full border px-4
        ${hasValue ? 'bg-white' : 'bg-gray-100'}
        border-gray-300`}
        style={hasError ? { borderColor: colors.status.error } : undefined}
      >
        {children}
      </View>

      {hasError && (
        <AppText className="text-sm" style={{ color: colors.status.error }}>
          {error}
        </AppText>
      )}
    </View>
  );
}
