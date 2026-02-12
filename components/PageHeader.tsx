import { TouchableOpacity, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  center = false
}: PageHeaderProps) {
  return (
    <View className={`mb-4 ${center ? 'items-center' : ''}`}>
      <AppText
        variant="heading24"
        className={center ? 'text-center font-semibold' : 'font-semibold'}
      >
        {title}
      </AppText>
      {subtitle ? (
        <AppText
          className={
            center
              ? 'text-muted-foreground mt-1 text-center'
              : 'text-muted-foreground mt-1'
          }
        >
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

/** Only hide back on actual tab roots: (tabs)/home, (tabs)/trip, etc. */
function isTabRoot(segments: string[]): boolean {
  return segments[0] === '(tabs)' && segments.length === 2;
}

export function HeaderWithBack({ title, subtitle }: PageHeaderProps) {
  const router = useRouter();
  const segments = useSegments();

  const showBack = !isTabRoot(segments) && router.canGoBack();

  return (
    <View className="mb-4 flex-row items-center gap-3">
      {showBack && (
        <TouchableOpacity
          onPress={router.back}
          activeOpacity={0.7}
          className="h-10 w-10 items-center justify-center rounded-full bg-colors-surface-background"
        >
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>
      )}

      <View className="flex-1">
        <AppText variant="heading24" className="font-semibold">
          {title}
        </AppText>
        {subtitle ? (
          <AppText className="text-muted-foreground mt-1">{subtitle}</AppText>
        ) : null}
      </View>
    </View>
  );
}
