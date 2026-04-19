import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
}

export function Screen({
  children,
  scroll = true,
  padded = true
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const paddingStyles = padded
    ? {
        paddingTop: insets.top + 16,
        paddingHorizontal: 24,
        paddingBottom: insets.bottom + 40 // 👈 real height + spacing
      }
    : {};

  if (!scroll) {
    return (
      <View
        className="flex-1 bg-colors-surface-background"
        style={paddingStyles}
      >
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      className="bg-colors-surface-background"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={paddingStyles}
    >
      {children}
    </ScrollView>
  );
}
