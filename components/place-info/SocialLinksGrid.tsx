import { View, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/theme/colors';

type SocialLink = {
  platform: string;
  url: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Props = {
  socialLinks: SocialLink[];
};

export default function SocialLinksGrid({ socialLinks }: Props) {
  if (!socialLinks?.length) return null;

  return (
    <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap' }}>
      {socialLinks.map(link => (
        <Pressable
          key={link.platform}
          onPress={() => Linking.openURL(link.url)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.brand.neutrals,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Ionicons name={link.icon} size={20} color={colors.brand.primary} />
        </Pressable>
      ))}
    </View>
  );
}
