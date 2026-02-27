import { useRef, useEffect } from 'react';
import { View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

export type MapRegion = Region;

export type MapMarker = {
  latitude: number;
  longitude: number;
  title?: string;
};

type Props = {
  region: MapRegion;
  markers?: MapMarker[];
};

export function Map({ region, markers }: Props) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (markers && markers.length > 1 && mapRef.current) {
      mapRef.current.fitToCoordinates(markers, {
        edgePadding: { top: 80, right: 40, bottom: 220, left: 40 },
        animated: true
      });
    }
  }, [markers]);

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={region}
        showsUserLocation
      >
        {markers?.map(marker => (
          <Marker
            key={`${marker.latitude}-${marker.longitude}`}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude
            }}
            title={marker.title}
          />
        ))}
      </MapView>
    </View>
  );
}
