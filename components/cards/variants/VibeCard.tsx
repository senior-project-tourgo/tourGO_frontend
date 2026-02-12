import { TouchableOpacity, View, Image } from 'react-native';
import { AppText } from '@/components/AppText';

interface VibeCardProps {
  title: string;
  image: string;
  selected: boolean;
  onPress: () => void;
}

export function VibeCard({ title, image, selected, onPress }: VibeCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`flex-1 overflow-hidden rounded-2xl border 
        ${selected ? 'border-colors-brand-primary bg-colors-brand-primary/20' : 'border-gray-200 bg-colors-surface-background'}
      `}
    >
      <Image
        source={{ uri: image }}
        className="h-32 w-full"
        resizeMode="cover"
      />

      <View className="p-3">
        <AppText
          className={`text-center text-sm ${
            selected ? 'text-primary font-semibold' : ''
          }`}
        >
          {title}
        </AppText>
      </View>
    </TouchableOpacity>
  );
}
