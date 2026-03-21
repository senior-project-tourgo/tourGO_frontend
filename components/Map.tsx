import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

export type MapRegion = Region;

export type MapMarker = {
  latitude: number;
  longitude: number;
  title?: string;
  /** Optional identifier used as the React key — falls back to index */
  id?: string;
};

type Props = {
  region: MapRegion;
  markers?: MapMarker[];
};

export function Map({ region, markers }: Props) {
  const mapRef = useRef<MapView>(null);

  // Fit all markers into view whenever the set of markers changes.
  // We use a JSON-stringified key so this only fires when coordinates actually
  // change, not on every parent re-render where markers is a new array reference.
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
      // No markers — animate to the supplied region (e.g. user location)
      mapRef.current.animateToRegion(region, 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markersKey]);

  return (
    <View className="flex-1">
      {/*
        Use initialRegion (uncontrolled) instead of region (controlled).
        Controlled `region` fights with fitToCoordinates — it snaps the map
        back to place #1 on every re-render. initialRegion sets the starting
        viewport once and then leaves the map free to pan/zoom.
      */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={region}
        showsUserLocation
      >
        {markers?.map((marker, index) => (
          <Marker
            key={marker.id ?? `marker-${index}`}
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
