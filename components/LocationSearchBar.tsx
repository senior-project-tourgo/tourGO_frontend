import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { AppText } from './AppText';
import { AppTextInput } from './AppTextInput';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/theme/colors';
import api from '@/config/api';
import { Area } from '@/features/place/place.types';
import SelectableChips from './SelectableChips';
import { QUICK_PICKS, QuickPick } from '@/constants/quickPicks';
import { useUserLocation } from '@/hooks/review-trip/add-place/useUserLocation';

type Prediction = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
};

export type PlaceDetails = {
  lat: number;
  lng: number;
  area: Area | null;
  formattedAddress: string;
};

type LocationSearchBarProps = {
  label?: string;
  required?: boolean;
  error?: string;
  onSelect: (details: PlaceDetails) => void;
  onClear: () => void;
  selectedLabel?: string | null;
};

export function LocationSearchBar({
  label = 'Starting point',
  required,
  error,
  onSelect,
  onClear,
  selectedLabel
}: LocationSearchBarProps) {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const inputRef = useRef<any>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { requestLocation } = useUserLocation({ autoRequest: false });

  // ── API ──
  const fetchPredictions = useCallback(async (text: string) => {
    if (text.trim().length < 2) {
      setPredictions([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get<{ predictions: Prediction[] }>(
        '/geocode/autocomplete',
        { params: { input: text.trim() } }
      );
      setPredictions(res.data.predictions ?? []);
    } catch {
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPlaceDetails = async (prediction: Prediction) => {
    setDetailsLoading(true);
    try {
      const res = await api.get<PlaceDetails>('/geocode/details', {
        params: { placeId: prediction.placeId }
      });
      onSelect(res.data);
    } catch {
    } finally {
      setDetailsLoading(false);
    }
  };

  // ── Handlers ──
  const handleChangeText = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(text), 300);
  };

  const handleSelectPrediction = (prediction: Prediction) => {
    setQuery(prediction.mainText);
    setPredictions([]);
    fetchPlaceDetails(prediction);
  };

  const handleQuickPick = (pick: QuickPick) => {
    if (!pick.query) return;
    setQuery(pick.query);
    fetchPredictions(pick.query);
    inputRef.current?.focus();
  };

  const handleUseMyLocation = async () => {
    setGpsLoading(true);
    try {
      const loc = await requestLocation();
      if (!loc) return;
      onSelect({
        lat: loc.lat,
        lng: loc.lng,
        area: null,
        formattedAddress: `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`
      });
    } finally {
      setGpsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setPredictions([]);
    onClear();
  };

  // ── Render label + required ──
  const renderLabel = () =>
    label ? (
      <AppText className="font-semibold">
        {label}{' '}
        {required && (
          <AppText variant="caption" style={{ color: colors.status.error }}>
            *
          </AppText>
        )}
      </AppText>
    ) : null;

  const showQuickPicks = query.length === 0 && predictions.length === 0;

  return (
    <View className="gap-2">
      {renderLabel()}

      {/* Input / Selected state using AppTextInput */}
      <AppTextInput
        ref={inputRef}
        value={selectedLabel ?? query}
        onChangeText={handleChangeText}
        placeholder="Search a place..."
        error={error}
        label={undefined}
        required={required}
        editable={!selectedLabel} // read-only if a selection exists
        rightIcon={
          loading || detailsLoading ? (
            <ActivityIndicator size="small" color={colors.brand.primary} />
          ) : query.length > 0 || selectedLabel ? (
            <Pressable onPress={handleClear} className="p-2">
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.brand.secondary}
              />
            </Pressable>
          ) : (
            <Ionicons name="search" size={18} color={colors.brand.primary} />
          )
        }
      />

      {/* Quick picks */}
      {showQuickPicks && (
        <View className="gap-2.5">
          <Pressable
            onPress={handleUseMyLocation}
            disabled={gpsLoading}
            className="flex-row items-center gap-2.5 rounded-lg bg-colors-brand-primary/10 px-3 py-2.5"
          >
            <View className="h-7 w-7 items-center justify-center rounded-full bg-colors-brand-primary/20">
              {gpsLoading ? (
                <ActivityIndicator size="small" color={colors.brand.primary} />
              ) : (
                <Ionicons
                  name="navigate"
                  size={14}
                  color={colors.brand.primary}
                />
              )}
            </View>
            <AppText
              variant="caption"
              className="font-semibold text-colors-text"
            >
              {gpsLoading ? 'Getting location...' : 'Use my current location'}
            </AppText>
          </Pressable>

          <SelectableChips
            title="Popular places"
            options={QUICK_PICKS.map((pick, idx) => ({
              id: idx,
              label: pick.label,
              icon: pick.icon,
              description: pick.query
            }))}
            selectedOption={null}
            onSelect={opt =>
              opt.description &&
              handleQuickPick({
                label: opt.label,
                icon: opt.icon,
                query: opt.description
              })
            }
            showDescription={false}
          />
        </View>
      )}

      {/* Predictions */}
      {predictions.length > 0 && (
        <View
          style={{
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.brand.neutrals,
            backgroundColor: '#fff',
            maxHeight: 220,
            overflow: 'hidden'
          }}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            {predictions.map(item => (
              <Pressable
                key={item.placeId}
                onPress={() => handleSelectPrediction(item)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.brand.neutrals
                }}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: colors.brand.primary + '12',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={colors.brand.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText
                    variant="caption"
                    className="font-semibold"
                    numberOfLines={1}
                  >
                    {item.mainText}
                  </AppText>
                  {item.secondaryText ? (
                    <AppText
                      variant="caption"
                      style={{ color: colors.brand.secondary, fontSize: 11 }}
                      numberOfLines={1}
                    >
                      {item.secondaryText}
                    </AppText>
                  ) : null}
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
