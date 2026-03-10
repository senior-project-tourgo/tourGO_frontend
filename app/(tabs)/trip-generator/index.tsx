import { AppTextInput } from '@/components/AppTextInput';
import { Button } from '@/components/Button';
import DatePickerBar from '@/components/DatePickerBar';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { OptionSelector } from '@/components/SelectorOptions';
import { Stepper } from '@/components/Stepper';
import { TimePickerBar } from '@/components/TimePickerBar';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { PACE_OPTIONS, PaceValue } from '@/constants/paceOptions';
import { AREA_OPTIONS } from '@/constants/areaOptions';
import {
  TIME_WINDOW_OPTIONS,
  TimeWindowValue,
  TIME_WINDOW_RANGES
} from '@/constants/timeOptions';
import { Area } from '@/features/place/place.types';
import { buildTripPayload } from '@/utils/tripForm';

export default function TripGeneratorScreen() {
  const router = useRouter();

  const [itineraryName, setItineraryName] = useState('');
  const [area, setArea] = useState<Area | null>(null);
  const [areaError, setAreaError] = useState<string | undefined>();

  const [people, setPeople] = useState<number>(1);
  const [submitted, setSubmitted] = useState(false);

  const [tripDate, setTripDate] = useState<Date | null>(null);
  const [tripDateError, setTripDateError] = useState<string | undefined>();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const [pace, setPace] = useState<PaceValue>('balanced');
  const [timeWindow, setTimeWindow] = useState<TimeWindowValue | null>(null);
  const [timeWindowError, setTimeWindowError] = useState<string | undefined>();

  const isItineraryInvalid = submitted && !itineraryName.trim();

  const handleTimeWindowChange = (value: TimeWindowValue) => {
    setTimeWindow(value);
    setTimeWindowError(undefined);

    const range = TIME_WINDOW_RANGES[value];

    const start = new Date();
    const end = new Date();

    const [startH, startM] = range.start.split(':').map(Number);
    const [endH, endM] = range.end.split(':').map(Number);

    start.setHours(startH, startM, 0, 0);
    end.setHours(endH, endM, 0, 0);

    setStartTime(start);
    setEndTime(end);
  };

  const handleContinue = async () => {
    setSubmitted(true);

    let hasError = false;

    if (!itineraryName.trim()) {
      hasError = true;
    }

    if (!area) {
      setAreaError('Please select a location');
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

    if (hasError) {
      return;
    }

    const payload = buildTripPayload({
      itineraryName,
      area,
      people,
      pace,
      tripDate,
      startTime,
      endTime
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

        <View className="gap-6">
          {/* Itinerary Name */}
          <AppTextInput
            label="Trip Name"
            placeholder="e.g. Weekend in Pokhara"
            value={itineraryName}
            onChangeText={setItineraryName}
            required
            error={
              isItineraryInvalid ? 'Itinerary name is required' : undefined
            }
          />

          {/* Traveling Area */}
          <OptionSelector
            label="Where are you going?"
            value={area ?? undefined}
            options={AREA_OPTIONS}
            onChange={v => {
              setArea(v);
              setAreaError(undefined); // clear error when user selects
            }}
            required
            error={areaError}
          />

          {/* Trip Date */}
          <DatePickerBar
            label="When is your trip?"
            value={tripDate}
            onChange={v => {
              setTripDate(v);
              setTripDateError(undefined); // clear error when user selects
            }}
            required
            error={tripDateError}
          />

          {/* Time Window Preset */}
          <OptionSelector
            label="What time of day?"
            value={timeWindow ?? undefined}
            options={TIME_WINDOW_OPTIONS}
            onChange={handleTimeWindowChange}
            required
            error={timeWindowError}
          />

          {/* Manual Time Row */}
          <View className="flex-row gap-2">
            <View className="flex-1">
              <TimePickerBar
                label="Start exploring"
                value={startTime ?? undefined}
                onChange={date => {
                  setStartTime(date);
                  setTimeWindow(null);

                  if (endTime && date > endTime) {
                    setEndTime(date);
                  }
                }}
              />
            </View>

            <View className="flex-1">
              <TimePickerBar
                label="Finish exploring"
                value={endTime ?? undefined}
                onChange={setEndTime}
                minimumDate={startTime ?? undefined}
              />
            </View>
          </View>

          {/* Trip Pace */}
          <OptionSelector
            label="How packed should your trip be?"
            value={pace}
            options={PACE_OPTIONS}
            onChange={setPace}
          />

          {/* Number of People */}
          <Stepper
            label="How many people?"
            value={people}
            onChange={setPeople}
            min={1}
            max={10}
          />

          {/* Continue Button */}
          <Button title="Choose Your Vibes" onPress={handleContinue} />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
