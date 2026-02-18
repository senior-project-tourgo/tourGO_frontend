import { View } from 'react-native';
import MapView, { Region } from 'react-native-maps';

export type MapRegion = Region;

type Props = {
  region: MapRegion;
};

export function Map({ region }: Props) {
  return (
    <View className="flex-1">
      <MapView style={{ flex: 1 }} region={region} showsUserLocation />
    </View>
  );
}
