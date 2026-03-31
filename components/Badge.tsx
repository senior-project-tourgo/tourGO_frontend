import colors from '@/theme/colors';
import { AppText } from './AppText';

interface BadgeProps {
  label: string;
  bgColor?: string; // background color
  textColor?: string; // text color
}

export function Badge({
  label,
  bgColor = colors.brand.neutrals,
  textColor = colors.text.DEFAULT
}: BadgeProps) {
  // Default padding
  const padding = 'px-2 py-1';

  return (
    <AppText
      className={`rounded-full ${padding} text-xs font-bold`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {label}
    </AppText>
  );
}
