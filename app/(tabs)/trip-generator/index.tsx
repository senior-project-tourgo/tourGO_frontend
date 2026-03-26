import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { Screen } from '@/components/Screen';
import { HeaderWithBack } from '@/components/PageHeader';
import { Button } from '@/components/Button';

import TripNameSection from './sections/TripNameSection';
import LocationSection from './sections/LocationSection';
import TripTimeSection from './sections/TripTimeSection';
import TripStyleSection from './sections/TripStyleSection';
import GroupSection from './sections/GroupSection';

import { buildTripPayload } from '@/utils/tripForm';
import { type TimeWindowValue } from '@/constants/timeOptions';
import { type TransportMode } from '@/constants/transportOptions';
import { type PaceValue } from '@/constants/paceOptions';
import { type GroupType } from '@/mock/groupTypes.mock';
import type { Area } from '@/features/place/place.types';

export default function TripGeneratorScreen() {
  const router = useRouter();

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
  const [groupType, setGroupType] = useState<GroupType | null>(null);
  const [people, setPeople] = useState<number>(1);

  const handleContinue = async () => {
    setSubmitted(true);
    let hasError = false;

    if (!itineraryName.trim()) hasError = true;
    if (!area || !startCoords) {
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
      startLat: startCoords?.lat,
      startLng: startCoords?.lng
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
            groupType={groupType}
            setGroupType={setGroupType}
            people={people}
            setPeople={setPeople}
          />

          <GroupSection
            groupType={groupType}
            people={people}
            setPeople={setPeople}
          />

          <View className="mt-4">
            <Button title="Choose Your Vibes" onPress={handleContinue} />
          </View>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
