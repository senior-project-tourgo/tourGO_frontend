import { View, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/theme/colors';

export type SocialLink = {
  platform: string;
  icon: keyof typeof Ionicons.glyphMap;
  url?: string;
  onPress?: () => void;
};

type Props = {
  socialLinks: SocialLink[];
};

export default function SocialLinksGrid({ socialLinks }: Props) {
  if (!socialLinks?.length) return null;

  return (
    <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap' }}>
      {socialLinks.map(link => {
        const handlePress = async () => {
          if (link.onPress) return link.onPress();
          if (link.url) return Linking.openURL(link.url);
        };

        const isDisabled = !link.onPress && !link.url;

        return (
          <Pressable
            key={link.platform}
            onPress={isDisabled ? undefined : handlePress}
            disabled={isDisabled}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.brand.neutrals,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isDisabled ? 0.4 : 1
            }}
          >
            <Ionicons name={link.icon} size={20} color={colors.brand.primary} />
          </Pressable>
        );
      })}
    </View>
  );
}
