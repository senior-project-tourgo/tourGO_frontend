import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';

type BaseChipProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

export function BaseChip({ label, icon, onPress }: BaseChipProps) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: colors.brand.neutrals,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20
      }}
    >
      <Ionicons name={icon} size={12} color={colors.brand.secondary} />

      <AppText
        style={{
          fontSize: 12,
          color: colors.brand.secondary,
          fontWeight: '600'
        }}
      >
        {label}
      </AppText>
    </Container>
  );
}
