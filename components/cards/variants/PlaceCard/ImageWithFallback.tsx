import React, { useEffect, useState } from 'react';
import {
  Image,
  View,
  ImageSourcePropType,
  ImageResizeMode,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImageWithFallbackProps {
  primaryImageUrl?: string;
  fallbackImage?: ImageSourcePropType; // optional static fallback
  vibeImageUrl?: string; // 👈 NEW (preferred fallback)
  resizeMode?: ImageResizeMode;
  className?: string;
}

export function ImageWithFallback({
  primaryImageUrl,
  fallbackImage,
  vibeImageUrl,
  resizeMode = 'cover',
  className
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [primaryImageUrl]);

  const isValidUrl =
    !!primaryImageUrl &&
    (primaryImageUrl.startsWith('http://') ||
      primaryImageUrl.startsWith('https://'));
  const hasPrimary = isValidUrl && !imageError;

  return (
    <View className={`overflow-hidden ${className ?? ''}`}>
      {hasPrimary ? (
        <Image
          source={{ uri: primaryImageUrl }}
          className="h-full w-full"
          resizeMode={resizeMode}
          onError={() => setImageError(true)}
        />
      ) : vibeImageUrl ? (
        <>
          {/* blurred vibe fallback */}
          <Image
            source={{ uri: vibeImageUrl }}
            className="h-full w-full"
            resizeMode="cover"
            blurRadius={12}
          />

          {/* overlay */}
          <View className="absolute inset-0 items-center justify-center bg-black/40">
            <Ionicons name="image-outline" size={24} color="white" />

            <View className="mt-2 rounded bg-black/60 px-2 py-1">
              <Text className="text-xs text-white">No photo</Text>
            </View>
          </View>
        </>
      ) : fallbackImage ? (
        <Image
          source={fallbackImage}
          className="h-full w-full"
          resizeMode={resizeMode}
        />
      ) : (
        // last fallback (no asset needed)
        <View className="h-full w-full items-center justify-center bg-gray-200">
          <Ionicons name="image-outline" size={24} color="#999" />
        </View>
      )}
    </View>
  );
}
