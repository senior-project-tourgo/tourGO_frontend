import { TouchableOpacity, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';

interface HeaderWithBackProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  showBack?: boolean; // Allows callers to disable rendering the back button when it would normally be shown.
}

/** Only hide back on actual tab roots: (tabs)/home, (tabs)/trip, etc. */
function isTabRoot(segments: string[]): boolean {
  return segments[0] === '(tabs)' && segments.length === 2;
}

export function HeaderWithBack({
  title,
  subtitle,
  center = false,
  showBack = true
}: HeaderWithBackProps) {
  const router = useRouter();
  const segments = useSegments();

  const shouldShowBack = showBack && !isTabRoot(segments) && router.canGoBack();

  return (
    <View
      className={`mb-4 ${shouldShowBack ? 'flex-row items-center gap-3' : ''}`}
    >
      {shouldShowBack && (
        <TouchableOpacity
          onPress={router.back}
          activeOpacity={0.7}
          className="h-10 w-10 items-center justify-center rounded-full bg-colors-surface-background"
        >
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>
      )}

      <View className={shouldShowBack ? 'flex-1' : ''}>
        <AppText
          variant="heading24"
          className={`font-semibold ${center ? 'text-center' : ''}`}
        >
          {title}
        </AppText>

        {subtitle && (
          <AppText
            className={`text-muted-foreground mt-1 ${
              center ? 'text-center' : ''
            }`}
          >
            {subtitle}
          </AppText>
        )}
      </View>
    </View>
  );
}
