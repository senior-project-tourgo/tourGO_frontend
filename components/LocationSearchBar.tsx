import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  TextInput,
  View
} from 'react-native';
import { AppText } from './AppText';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/theme/colors';
import api from '@/config/api';
import { Area } from '@/features/place/place.types';
import * as Location from 'expo-location';
import SelectableChips from './SelectableChips';
import { QUICK_PICKS, QuickPick } from '@/constants/quickPicks';

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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  const fetchPredictions = useCallback(async (input: string) => {
    if (input.trim().length < 2) {
      setPredictions([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get<{ predictions: Prediction[] }>(
        '/geocode/autocomplete',
        { params: { input: input.trim() } }
      );
      setPredictions(res.data.predictions ?? []);
    } catch {
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChangeText = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(text), 300);
  };

  const handleSelect = async (prediction: Prediction) => {
    setDetailsLoading(true);
    setPredictions([]);
    setQuery(prediction.mainText);
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

  const handleQuickPick = (pick: QuickPick) => {
    setQuery(pick.query);
    fetchPredictions(pick.query);
    inputRef.current?.focus();
  };

  const handleUseMyLocation = async () => {
    setGpsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      onSelect({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        area: null,
        formattedAddress: `${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`
      });
    } catch {
    } finally {
      setGpsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setPredictions([]);
    onClear();
  };

  // ── Selected state ──
  if (selectedLabel) {
    return (
      <View className="gap-1.5">
        {label && (
          <AppText className="font-semibold">
            {label}{' '}
            {required && (
              <AppText variant="caption" className="text-red-500">
                *
              </AppText>
            )}
          </AppText>
        )}
        <Pressable
          onPress={handleClear}
          className="border-primary bg-primary/10 flex-row items-center gap-2.5 rounded-xl border-2 px-3.5 py-3"
        >
          <View className="h-8 w-8 items-center justify-center rounded-full bg-colors-brand-primary/20">
            <Ionicons name="location" size={16} color={colors.brand.primary} />
          </View>
          <View className="flex-1">
            <AppText
              className="font-semibold text-colors-text"
              numberOfLines={1}
            >
              {selectedLabel}
            </AppText>
          </View>
          <Ionicons
            name="close-circle"
            size={20}
            color={colors.brand.secondary}
          />
        </Pressable>
      </View>
    );
  }

  const showQuickPicks = query.length === 0 && predictions.length === 0;

  return (
    <View className="gap-2">
      {label && (
        <AppText className="font-semibold">
          {label}{' '}
          {required && (
            <AppText variant="caption" className="text-red-500">
              *
            </AppText>
          )}
        </AppText>
      )}

      {/* Search input */}
      <View
        className={`flex-row items-center gap-2 rounded-xl border-2 px-3.5 py-2.5 ${error ? 'border-red-500' : 'border-gray-300'} bg-white`}
      >
        <Ionicons
          name="search-outline"
          size={18}
          color={colors.brand.primary}
        />
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={handleChangeText}
          placeholder="Search a place..."
          placeholderTextColor="#999"
          className="flex-1 py-0 text-sm"
        />
        {(loading || detailsLoading) && (
          <ActivityIndicator size="small" color={colors.brand.primary} />
        )}
        {query.length > 0 && !loading && (
          <Pressable onPress={handleClear} className="p-2">
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.brand.secondary}
            />
          </Pressable>
        )}
      </View>

      {error && (
        <AppText variant="caption" className="text-red-500">
          {error}
        </AppText>
      )}

      {/* Quick-pick chips + GPS */}
      {showQuickPicks && (
        <View className="gap-2.5">
          {/* Use my location */}
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

          {/* Popular places using SelectableChips */}
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
              handleQuickPick({
                label: opt.label,
                icon: opt.icon,
                query: opt.description!
              })
            }
            showDescription={false}
          />
        </View>
      )}

      {/* Autocomplete dropdown */}
      {predictions.length > 0 && (
        <View className="max-h-56 overflow-hidden rounded-xl border border-gray-300 bg-white">
          <FlatList
            data={predictions}
            keyExtractor={item => item.placeId}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelect(item)}
                className="flex-row items-center gap-2.5 border-b border-gray-300 px-3.5 py-3"
              >
                <View className="h-7 w-7 items-center justify-center rounded-full bg-colors-brand-primary/10">
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={colors.brand.primary}
                  />
                </View>
                <View className="flex-1">
                  <AppText
                    variant="caption"
                    className="font-semibold"
                    numberOfLines={1}
                  >
                    {item.mainText}
                  </AppText>
                  {item.secondaryText && (
                    <AppText
                      variant="caption"
                      className="text-xs text-gray-500"
                      numberOfLines={1}
                    >
                      {item.secondaryText}
                    </AppText>
                  )}
                </View>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}
