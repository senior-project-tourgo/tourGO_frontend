import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
}

export function Screen({ children, scroll = true }: ScreenProps) {
  if (!scroll) {
    return (
      <View
        className="flex-1 bg-colors-surface-background"
        style={{
          paddingTop: 64,
          paddingHorizontal: 24,
          paddingBottom: 120
        }}
      >
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
        paddingBottom: 120
      }}
    >
      {children}
    </ScrollView>
  );
}
