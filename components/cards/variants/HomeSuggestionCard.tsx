import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Place } from '@/features/place/place.types';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { ImageWithFallback } from './PlaceCard/ImageWithFallback';

type Props = {
  reason: string;
  places: Place[];
  onPress: () => void;
};

/**
 * A home-feed card showing a "Because you visited X…" trip suggestion.
 * Displays a collage of up to 4 place images with the reason tagline.
 */
export function HomeSuggestionCard({ reason, places, onPress }: Props) {
  const images = places
    .slice(0, 4)
    .map(p => p.image)
    .filter(Boolean);
  const placeNames = places.map(p => p.placeName);

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.surface.background,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        marginHorizontal: 16
      }}
    >
      {/* Image collage */}
      <View style={{ height: 160, flexDirection: 'row', gap: 2 }}>
        {images.length === 0 ? (
          <View
            style={{
              flex: 1,
              backgroundColor: colors.brand.neutrals,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Ionicons
              name="map-outline"
              size={40}
              color={colors.brand.secondary}
            />
          </View>
        ) : images.length === 1 ? (
          <ImageWithFallback
            primaryImageUrl={images[0]}
            className="w-full"
            resizeMode="stretch"
          />
        ) : images.length === 2 ? (
          <>
            <ImageWithFallback
              primaryImageUrl={images[0]}
              className="w-full"
              resizeMode="stretch"
            />
            <ImageWithFallback
              primaryImageUrl={images[1]}
              className="w-full"
              resizeMode="stretch"
            />
          </>
        ) : images.length === 3 ? (
          <>
            <ImageWithFallback
              primaryImageUrl={images[0]}
              className="w-full"
              resizeMode="stretch"
            />
            <ImageWithFallback
              primaryImageUrl={images[1]}
              className="w-full"
              resizeMode="stretch"
            />
            <ImageWithFallback
              primaryImageUrl={images[2]}
              className="w-full"
              resizeMode="stretch"
            />
          </>
        ) : (
          <>
            <ImageWithFallback
              primaryImageUrl={images[0]}
              className="w-full"
              resizeMode="stretch"
            />
            <ImageWithFallback
              primaryImageUrl={images[1]}
              className="w-full"
              resizeMode="stretch"
            />
            <ImageWithFallback
              primaryImageUrl={images[2]}
              className="w-full"
              resizeMode="stretch"
            />
            <ImageWithFallback
              primaryImageUrl={images[3]}
              className="w-full"
              resizeMode="stretch"
            />
          </>
        )}

        {/* Reason overlay banner */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            paddingHorizontal: 14,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Ionicons name="sparkles" size={13} color={colors.brand.primary} />
          <AppText
            style={{ color: 'white', fontSize: 12, fontWeight: '600', flex: 1 }}
            numberOfLines={1}
          >
            {reason}
          </AppText>
        </View>
      </View>

      {/* Bottom content */}
      <View style={{ padding: 14, gap: 10 }}>
        {/* Place pills */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {placeNames.slice(0, 4).map((name, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: colors.brand.neutrals,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20
              }}
            >
              <Ionicons
                name="location-outline"
                size={11}
                color={colors.brand.secondary}
              />
              <AppText
                style={{
                  fontSize: 11,
                  color: colors.brand.secondary,
                  fontWeight: '600'
                }}
                numberOfLines={1}
              >
                {name}
              </AppText>
            </View>
          ))}
          {places.length > 4 && (
            <View
              style={{
                backgroundColor: colors.brand.primary + '20',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20
              }}
            >
              <AppText
                style={{
                  fontSize: 11,
                  color: colors.brand.primary,
                  fontWeight: '600'
                }}
              >
                +{places.length - 4} more
              </AppText>
            </View>
          )}
        </View>

        <Button title="Start This Trip" onPress={onPress} />
      </View>
    </Pressable>
  );
}
