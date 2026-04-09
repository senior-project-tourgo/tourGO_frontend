import { View, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';

export type SocialLink = {
  platform: string;
  icon: keyof typeof Ionicons.glyphMap;
  url: string;
  subtitle: string;
};

type SocialLinksProps = {
  links: SocialLink[];
};

export function SocialLinks({ links }: SocialLinksProps) {
  if (!links.length) return null;

  return (
    <View style={{ flexDirection: 'row', gap: 20, flexWrap: 'wrap' }}>
      {links.map(link => (
        <Pressable
          key={link.platform}
          onPress={() => Linking.openURL(link.url)}
          style={{ alignItems: 'center', gap: 6, minWidth: 56 }}
        >
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: colors.brand.neutrals,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: colors.brand.primary + '30'
            }}
          >
            <Ionicons
              name={link.icon}
              size={24}
              color={colors.brand.secondary}
            />
          </View>
          <AppText
            style={{
              fontSize: 10,
              color: '#64748b',
              textAlign: 'center',
              maxWidth: 72
            }}
            numberOfLines={1}
          >
            {link.subtitle}
          </AppText>
          <AppText
            style={{ fontSize: 9, color: '#94a3b8', textAlign: 'center' }}
          >
            {link.platform}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}
