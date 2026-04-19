import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

import { Button } from '@/components/Button';
import { AppText } from '@/components/AppText';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';

import GroupSection from './sections/GroupSection';
import LocationSection from './sections/LocationSection';
import TripNameSection from './sections/TripNameSection';
import TripStyleSection from './sections/TripStyleSection';
import TripTimeSection from './sections/TripTimeSection';

import { type GroupType } from '@/constants/groupType';
import { type PaceValue } from '@/constants/paceOptions';
import { type TimeWindowValue } from '@/constants/timeOptions';
import { type TransportMode } from '@/constants/transportOptions';
import type { Area, PriceRange } from '@/features/place/place.types';
import { buildTripPayload } from '@/utils/tripForm';

export default function TripGeneratorScreen() {
  const router = useRouter();

  const handleSurpriseMe = () => {
    router.push({ pathname: '/curating-trip', params: { mode: 'surprise' } });
  };

  // --- Trip Name ---
  const [itineraryName, setItineraryName] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  // --- Location ---
  const [area, setArea] = useState<Area | null>(null);
  const [startCoords, setStartCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | undefined>();

  // --- Trip Time ---
  const [tripDate, setTripDate] = useState<Date | null>(null);
  const [tripDateError, setTripDateError] = useState<string | undefined>();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [timeWindow, setTimeWindow] = useState<TimeWindowValue | null>(null);
  const [timeWindowError, setTimeWindowError] = useState<string | undefined>();

  // --- Trip Style ---
  const [pace, setPace] = useState<PaceValue>('balanced');
  const [transportMode, setTransportMode] = useState<TransportMode | null>(
    null
  );
  const [budgetTier, setBudgetTier] = useState<PriceRange | null>(null);
  const [groupType, setGroupType] = useState<GroupType | null>(null);
  const [people, setPeople] = useState<number>(1);

  const handleContinue = async () => {
    setSubmitted(true);
    let hasError = false;

    if (!itineraryName.trim()) hasError = true;
    if (!startCoords) {
      setLocationError('Please search and select a starting location');
      hasError = true;
    }
    if (!tripDate) {
      setTripDateError('Please select a trip date');
      hasError = true;
    }
    if (!timeWindow && (!startTime || !endTime)) {
      setTimeWindowError('Please select a time window');
      hasError = true;
    }
    if (hasError) return;

    const payload = buildTripPayload({
      itineraryName,
      area,
      people,
      pace,
      tripDate,
      startTime,
      endTime,
      groupType: groupType?.id,
      transportMode: transportMode ?? undefined,
      budgetTier: budgetTier ?? undefined,
      startLat: startCoords?.lat,
      startLng: startCoords?.lng,
      startLabel: locationLabel ?? undefined
    });

    router.push({
      pathname: '/(tabs)/trip-generator/vibe-selector',
      params: payload
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Screen>
        <HeaderWithBack title="Plan Your Trip" />
        <View className="gap-4">
          <TripNameSection
            itineraryName={itineraryName}
            setItineraryName={setItineraryName}
            submitted={submitted}
          />

          <LocationSection
            area={area}
            setArea={setArea}
            startCoords={startCoords}
            setStartCoords={setStartCoords}
            locationLabel={locationLabel}
            setLocationLabel={setLocationLabel}
            locationError={locationError}
            setLocationError={setLocationError}
          />

          <TripTimeSection
            tripDate={tripDate}
            setTripDate={setTripDate}
            tripDateError={tripDateError}
            setTripDateError={setTripDateError}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            timeWindow={timeWindow}
            setTimeWindow={setTimeWindow}
            timeWindowError={timeWindowError}
            setTimeWindowError={setTimeWindowError}
          />

          <TripStyleSection
            pace={pace}
            setPace={setPace}
            transportMode={transportMode}
            setTransportMode={setTransportMode}
            budgetTier={budgetTier}
            setBudgetTier={setBudgetTier}
          />

          <GroupSection
            groupType={groupType}
            setGroupType={setGroupType}
            people={people}
            setPeople={setPeople}
          />

          <View className="mt-4" style={{ gap: 10 }}>
            <Button title="Choose Your Vibes" onPress={handleContinue} />

            <Pressable
              onPress={handleSurpriseMe}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 14,
                borderRadius: 14,
                borderWidth: 2,
                borderColor: colors.brand.primary
              }}
            >
              <Ionicons
                name="shuffle-outline"
                size={18}
                color={colors.brand.primary}
              />
              <AppText
                style={{
                  color: colors.brand.primary,
                  fontWeight: '700',
                  fontSize: 15
                }}
              >
                Surprise Me
              </AppText>
            </Pressable>
          </View>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
