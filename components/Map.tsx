import { useEffect, useRef } from 'react';
import { Image, Text, View } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import colors from '@/theme/colors';

export type MapRegion = Region;

export type MapMarker = {
  latitude: number;
  longitude: number;
  title?: string;
  /** Optional identifier used as the React key — falls back to index */
  id?: string;
  /** Pin colour — defaults to the platform default (red). Pass a hex string or named colour. */
  pinColor?: string;
};

export type MapRoute = {
  coords: { latitude: number; longitude: number }[];
  /** true = solid primary colour, false/undefined = dashed muted colour */
  solid?: boolean;
};

export type UserAvatarMarker = {
  latitude: number;
  longitude: number;
  /** Remote image URL for the avatar. Falls back to initials. */
  imageUrl?: string | null;
  /** Shown as initials fallback text */
  initials?: string;
};

type Props = {
  region: MapRegion;
  markers?: MapMarker[];
  focusCoordinate?: { latitude: number; longitude: number };
  routes?: MapRoute[];
  /** If provided, renders a circular avatar pin at the user's location */
  userAvatarMarker?: UserAvatarMarker;
};

export function Map({
  region,
  markers,
  focusCoordinate,
  routes,
  userAvatarMarker
}: Props) {
  const mapRef = useRef<MapView>(null);

  const markersKey = JSON.stringify(
    markers?.map(m => ({ lat: m.latitude, lng: m.longitude }))
  );
  useEffect(() => {
    if (!mapRef.current) return;
    if (markers && markers.length > 0) {
      mapRef.current.fitToCoordinates(markers, {
        edgePadding: { top: 80, right: 40, bottom: 220, left: 40 },
        animated: true
      });
    } else {
      mapRef.current.animateToRegion(region, 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markersKey]);

  useEffect(() => {
    if (!mapRef.current || !focusCoordinate) return;
    mapRef.current.animateToRegion(
      {
        latitude: focusCoordinate.latitude,
        longitude: focusCoordinate.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015
      },
      400
    );
  }, [focusCoordinate]);

  return (
    <View className="flex-1">
      <MapView ref={mapRef} style={{ flex: 1 }} initialRegion={region}>
        {routes?.map((route, index) => (
          <Polyline
            key={`route-${index}`}
            coordinates={route.coords}
            strokeColor={route.solid ? '#f97316' : '#94a3b8'}
            strokeWidth={route.solid ? 4 : 2}
            lineDashPattern={route.solid ? undefined : [6, 8]}
          />
        ))}
        {markers?.map((marker, index) => (
          <Marker
            key={marker.id ?? `marker-${index}`}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude
            }}
            title={marker.title}
            pinColor={marker.pinColor}
          />
        ))}
        {userAvatarMarker && (
          <Marker
            key="user-avatar"
            coordinate={{
              latitude: userAvatarMarker.latitude,
              longitude: userAvatarMarker.longitude
            }}
            title="You are here"
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={!!userAvatarMarker.imageUrl}
          >
            <UserAvatarPin
              imageUrl={userAvatarMarker.imageUrl}
              initials={userAvatarMarker.initials}
            />
          </Marker>
        )}
      </MapView>
    </View>
  );
}

export function UserAvatarPin({
  imageUrl,
  initials
}: {
  imageUrl?: string | null;
  initials?: string;
}) {
  return (
    <View
      style={{
        alignItems: 'center'
      }}
    >
      {/* Outer ring */}
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          backgroundColor: colors.brand.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 6
        }}
      >
        {/* Avatar circle */}
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: colors.brand.neutrals,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: 'white'
          }}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: 38, height: 38, borderRadius: 19 }}
            />
          ) : (
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: colors.brand.secondary
              }}
            >
              {initials ?? '?'}
            </Text>
          )}
        </View>
      </View>
      {/* Pointer triangle */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 6,
          borderRightWidth: 6,
          borderTopWidth: 8,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: colors.brand.primary,
          marginTop: -1
        }}
      />
    </View>
  );
}
