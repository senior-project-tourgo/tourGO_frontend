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

type QuickPick = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  query: string;
};

const QUICK_PICKS: QuickPick[] = [
  { label: 'Thamel', icon: 'storefront-outline', query: 'Thamel, Kathmandu' },
  { label: 'Lakeside', icon: 'water-outline', query: 'Lakeside, Pokhara' },
  {
    label: 'Bhaktapur',
    icon: 'library-outline',
    query: 'Bhaktapur Durbar Square'
  },
  {
    label: 'Patan',
    icon: 'color-palette-outline',
    query: 'Patan Durbar Square, Lalitpur'
  },
  { label: 'Boudha', icon: 'globe-outline', query: 'Boudhanath, Kathmandu' },
  { label: 'Ason', icon: 'basket-outline', query: 'Ason, Kathmandu' }
];

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
      // keep the text but no coords
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

      // Directly use coords; area will be determined by proximity to known areas
      onSelect({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        area: null, // backend will infer from proximity to places
        formattedAddress: `${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`
      });
    } catch {
      // silently fail
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
      <View style={{ gap: 6 }}>
        {label && (
          <AppText variant="caption" className="font-semibold">
            {label}{' '}
            {required && (
              <AppText variant="caption" style={{ color: '#ef4444' }}>
                *
              </AppText>
            )}
          </AppText>
        )}
        <Pressable
          onPress={handleClear}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: colors.brand.primary,
            backgroundColor: colors.brand.primary + '12'
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.brand.primary + '20',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Ionicons name="location" size={16} color={colors.brand.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText
              variant="caption"
              className="font-semibold"
              style={{ color: colors.brand.primary }}
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

  // ── Search state ──
  const showQuickPicks = query.length === 0 && predictions.length === 0;

  return (
    <View style={{ gap: 8 }}>
      {label && (
        <AppText variant="caption" className="font-semibold">
          {label}{' '}
          {required && (
            <AppText variant="caption" style={{ color: '#ef4444' }}>
              *
            </AppText>
          )}
        </AppText>
      )}

      {/* Search input */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: error ? '#ef4444' : colors.brand.neutrals,
          backgroundColor: colors.surface.background
        }}
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
          style={{ flex: 1, fontSize: 14, paddingVertical: 0 }}
        />
        {(loading || detailsLoading) && (
          <ActivityIndicator size="small" color={colors.brand.primary} />
        )}
        {query.length > 0 && !loading && (
          <Pressable onPress={handleClear} hitSlop={8}>
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.brand.secondary}
            />
          </Pressable>
        )}
      </View>

      {error && (
        <AppText variant="caption" style={{ color: '#ef4444' }}>
          {error}
        </AppText>
      )}

      {/* Quick-pick chips + GPS button */}
      {showQuickPicks && (
        <View style={{ gap: 10 }}>
          {/* Use my location row */}
          <Pressable
            onPress={handleUseMyLocation}
            disabled={gpsLoading}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: colors.brand.primary + '10'
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: colors.brand.primary + '20',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
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
              className="font-semibold"
              style={{ color: colors.brand.primary }}
            >
              {gpsLoading ? 'Getting location...' : 'Use my current location'}
            </AppText>
          </Pressable>

          {/* Popular places */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {QUICK_PICKS.map(pick => (
              <Pressable
                key={pick.label}
                onPress={() => handleQuickPick(pick)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: colors.brand.neutrals,
                  backgroundColor: colors.surface.background
                }}
              >
                <Ionicons
                  name={pick.icon}
                  size={14}
                  color={colors.brand.primary}
                />
                <AppText variant="caption" className="font-semibold">
                  {pick.label}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Autocomplete dropdown */}
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
          <FlatList
            data={predictions}
            keyExtractor={item => item.placeId}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelect(item)}
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
            )}
          />
        </View>
      )}
    </View>
  );
}
