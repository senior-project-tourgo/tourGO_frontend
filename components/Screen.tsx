import { ScrollView, View } from 'react-native';

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
  const paddingStyles = padded
    ? {
        paddingTop: 64,
        paddingHorizontal: 24,
        paddingBottom: 120
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
