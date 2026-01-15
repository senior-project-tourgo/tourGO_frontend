import { Ionicons } from '@expo/vector-icons';

type TabIconProps = {
  focused: boolean;
  color: string;
  size: number;
  activeName: keyof typeof Ionicons.glyphMap;
  inactiveName?: keyof typeof Ionicons.glyphMap;
};

export default function TabIcon({
  focused,
  color,
  size,
  activeName,
  inactiveName
}: TabIconProps) {
  return (
    <Ionicons
      name={focused ? activeName : (inactiveName ?? activeName)}
      size={size}
      color={color}
    />
  );
}
