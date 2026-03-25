import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  UIManager,
  View
} from 'react-native';
import { AppText } from './AppText';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/theme/colors';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AccordionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  /** Short text shown next to the title when collapsed (e.g. "Morning, Walking") */
  summary?: string;
  /** Show a completion checkmark when the section is filled */
  completed?: boolean;
  /** Start expanded */
  defaultOpen?: boolean;
  children: ReactNode;
};

export function Accordion({
  icon,
  title,
  summary,
  completed,
  defaultOpen = false,
  children
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const spin = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(spin, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start();
  }, [open, spin]);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(prev => !prev);
  };

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <View
      style={{
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: open ? colors.brand.primary + '40' : colors.brand.neutrals,
        backgroundColor: open
          ? colors.brand.primary + '06'
          : colors.surface.background,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Pressable
        onPress={toggle}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          gap: 12
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: colors.brand.primary + '15',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Ionicons name={icon} size={18} color={colors.brand.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <AppText className="font-semibold" style={{ fontSize: 15 }}>
            {title}
          </AppText>
          {!open && summary ? (
            <AppText
              variant="caption"
              style={{ color: colors.brand.secondary, marginTop: 1 }}
              numberOfLines={1}
            >
              {summary}
            </AppText>
          ) : null}
        </View>

        {completed && !open && (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={colors.brand.primary}
          />
        )}

        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons
            name="chevron-down"
            size={18}
            color={colors.brand.secondary}
          />
        </Animated.View>
      </Pressable>

      {/* Body */}
      {open && (
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            gap: 14
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
}
