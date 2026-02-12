import { TouchableOpacity } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Only hide back button on actual tab roots: (tabs)/home, (tabs)/trip, etc. Not on /places/[id] or /promotions/[id]. */
function isTabRoot(segments: string[]): boolean {
  return segments[0] === '(tabs)' && segments.length === 2;
}

export function FloatingBackButton() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  if (isTabRoot(segments)) return null;
  if (!router.canGoBack()) return null;

  return (
    <TouchableOpacity
      onPress={router.back}
      activeOpacity={0.7}
      style={{
        top: insets.top + 8
      }}
      className="absolute left-6 z-50 h-11 w-11 items-center justify-center rounded-full bg-colors-surface-background"
    >
      <Ionicons name="chevron-back" size={26} color="#111" />
    </TouchableOpacity>
  );
}
