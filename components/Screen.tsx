import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingBackButton } from './FloatingBackButton';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
}

export function Screen({ children, scroll = true }: ScreenProps) {
  const insets = useSafeAreaInsets();

  if (!scroll) {
    return (
      <View
        className="flex-1 bg-colors-surface-background"
        style={{
          padding: 16,
          paddingBottom: insets.bottom
        }}
      >
        <FloatingBackButton />
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      className="bg-colors-surface-background"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingTop: 64,
        paddingHorizontal: 24,
        paddingBottom: 32,
        gap: 16
      }}
    >
      <FloatingBackButton />
      {children}
    </ScrollView>
  );
}
