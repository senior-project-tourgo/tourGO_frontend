import { TouchableOpacity } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Tab root screens: (tabs)/home, (tabs)/trip, (tabs)/profile, (tabs)/rewards, (tabs)/trip-generator index only. */
function isTabRoot(segments: string[]): boolean {
  return segments.length <= 2;
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
      className="absolute left-4 z-50 h-11 w-11 items-center justify-center rounded-full bg-white shadow-md"
    >
      <Ionicons name="chevron-back" size={26} color="#111" />
    </TouchableOpacity>
  );
}
