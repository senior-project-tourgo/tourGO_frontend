import { View } from 'react-native';
import { Map, MapRegion } from '@/components/Map';
import { HeaderWithBack } from '@/components/PageHeader';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function ReviewTrip() {
  const [region, setRegion] = useState<MapRegion | null>(null);

  useEffect(() => {
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });
    }

    getLocation();
  }, []);

  if (!region) return null;
  return (
    <View
      className="flex-1 bg-colors-surface-background"
      style={{
        paddingTop: 64
      }}
    >
      <HeaderWithBack title="Review Your Trip" className="pl-6" />

      <Map region={region} />
    </View>
  );
}
