import React, { useState } from 'react';
import { Image, View } from 'react-native';

interface ImageWithFallbackProps {
  primaryImageUrl: string;
  fallbackImageUrl?: string;
  className?: string;
  resizeMode?: string;
}

export function ImageWithFallback({
  primaryImageUrl,
  fallbackImageUrl = require('@/assets/images/no_image.png'),
  className
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const imageSource = imageError
    ? { uri: fallbackImageUrl }
    : { uri: primaryImageUrl };

  return (
    <View>
      <Image
        source={imageSource}
        className={`h-40 w-full ${className ?? ''}`}
        onError={() => setImageError(true)}
        resizeMode="cover"
      />
    </View>
  );
}
