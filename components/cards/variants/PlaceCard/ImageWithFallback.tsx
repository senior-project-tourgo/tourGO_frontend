import React, { useEffect, useState } from 'react';
import {
  Image,
  View,
  ImageSourcePropType,
  ImageResizeMode
} from 'react-native';

interface ImageWithFallbackProps {
  primaryImageUrl?: string;
  fallbackImage?: ImageSourcePropType;
  resizeMode?: ImageResizeMode;
  className?: string;
}

export function ImageWithFallback({
  primaryImageUrl,
  fallbackImage = require('@/assets/images/no_image.png'),
  resizeMode = 'cover',
  className
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [primaryImageUrl]);

  const imageSource: ImageSourcePropType =
    !primaryImageUrl || imageError ? fallbackImage : { uri: primaryImageUrl };

  return (
    <View>
      <Image
        source={imageSource}
        className={`h-40 w-full ${className ?? ''}`}
        resizeMode={resizeMode}
        onError={() => {
          if (!imageError) setImageError(true);
        }}
      />
    </View>
  );
}
