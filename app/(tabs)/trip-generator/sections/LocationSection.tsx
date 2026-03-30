import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Accordion } from '@/components/Accordion';
import { LocationSearchBar } from '@/components/LocationSearchBar';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import type { Area } from '@/features/place/place.types';

type LocationSectionProps = {
  area: Area | null;
  setArea: (area: Area | null) => void;
  startCoords: { lat: number; lng: number } | null;
  setStartCoords: (coords: { lat: number; lng: number } | null) => void;
  locationLabel: string | null;
  setLocationLabel: (label: string | null) => void;
  locationError?: string;
  setLocationError: (error?: string) => void;
};

export default function LocationSection({
  area,
  setArea,
  startCoords,
  setStartCoords,
  locationLabel,
  setLocationLabel,
  locationError,
  setLocationError
}: LocationSectionProps) {
  const locationSummary = locationLabel
    ? locationLabel.length > 30
      ? locationLabel.slice(0, 30) + '...'
      : locationLabel
    : undefined;

  return (
    <Accordion
      icon="location-outline"
      title="Where are you starting from?"
      summary={locationSummary}
      completed={!!startCoords}
      defaultOpen
    >
      <LocationSearchBar
        required
        error={locationError}
        selectedLabel={locationLabel}
        onSelect={details => {
          setStartCoords({ lat: details.lat, lng: details.lng });
          setArea(details.area as Area | null);
          setLocationLabel(
            details.formattedAddress ??
              `${details.lat.toFixed(4)}, ${details.lng.toFixed(4)}`
          );
          setLocationError(undefined);
        }}
        onClear={() => {
          setStartCoords(null);
          setArea(null);
          setLocationLabel(null);
        }}
      />
      {area && (
        <View className="flex-row items-center gap-1.5">
          <Ionicons
            name="navigate-outline"
            size={14}
            color={colors.brand.primary}
          />
          <AppText variant="caption" className="text-colors-text">
            Showing places in {area}
          </AppText>
        </View>
      )}
    </Accordion>
  );
}
