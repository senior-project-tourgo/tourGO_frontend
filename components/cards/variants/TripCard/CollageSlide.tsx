import { View, Image } from 'react-native';
import { CARD_WIDTH, CAROUSEL_HEIGHT } from '@/constants/place-card/carousel';

export function CollageSlide({ imgs }: { imgs: string[] }) {
  if (imgs.length === 2) {
    return (
      <View
        style={{ width: CARD_WIDTH, height: CAROUSEL_HEIGHT }}
        className="flex-row"
      >
        {imgs.map((url, i) => (
          <Image
            key={i}
            source={{ uri: url }}
            style={{ height: CAROUSEL_HEIGHT }}
            className={`flex-1 ${i > 0 ? 'ml-[1px]' : ''}`}
            resizeMode="cover"
          />
        ))}
      </View>
    );
  }

  return (
    <View
      style={{ width: CARD_WIDTH, height: CAROUSEL_HEIGHT }}
      className="flex-row"
    >
      <Image
        source={{ uri: imgs[0] }}
        style={{ height: CAROUSEL_HEIGHT }}
        className="flex-[2]"
        resizeMode="cover"
      />

      <View className="ml-[1px] flex-1 gap-[1px]">
        <Image
          source={{ uri: imgs[1] }}
          className="flex-1"
          resizeMode="cover"
        />
        <Image
          source={{ uri: imgs[2] }}
          className="flex-1"
          resizeMode="cover"
        />
      </View>
    </View>
  );
}
