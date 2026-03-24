import { AppText } from '@/components/AppText';
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
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

import { PACE_OPTIONS, PaceValue } from '@/constants/paceOptions';
import { AREA_OPTIONS } from '@/constants/areaOptions';
import {
  TIME_WINDOW_OPTIONS,
  TimeWindowValue,
  TIME_WINDOW_RANGES
} from '@/constants/timeOptions';
import { Area } from '@/features/place/place.types';
import { GROUP_TYPES, type GroupType } from '@/mock/groupTypes.mock';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { buildTripPayload } from '@/utils/tripForm';

export default function TripGeneratorScreen() {
  const router = useRouter();

  const [itineraryName, setItineraryName] = useState('');
  const [area, setArea] = useState<Area | null>(null);
  const [areaError, setAreaError] = useState<string | undefined>();

  const [people, setPeople] = useState<number>(1);
  const [groupType, setGroupType] = useState<GroupType | null>(null);
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

  const handleGroupTypeSelect = (gt: GroupType) => {
    setGroupType(gt);
    setPeople(gt.defaultPeople);
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
      endTime,
      groupType: groupType?.id
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

          {/* Group Type */}
          <View className="gap-2">
            <AppText variant="caption" className="font-semibold">
              Who are you traveling with?
            </AppText>
            <View className="flex-row flex-wrap gap-2">
              {GROUP_TYPES.map(gt => {
                const selected = groupType?.id === gt.id;
                return (
                  <Pressable
                    key={gt.id}
                    onPress={() => handleGroupTypeSelect(gt)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 1.5,
                      borderColor: selected
                        ? colors.brand.primary
                        : colors.brand.neutrals,
                      backgroundColor: selected
                        ? colors.brand.primary + '18'
                        : colors.surface.background
                    }}
                  >
                    <Ionicons
                      name={gt.icon as any}
                      size={14}
                      color={
                        selected ? colors.brand.primary : colors.brand.secondary
                      }
                    />
                    <AppText
                      variant="caption"
                      className="font-semibold"
                      style={{
                        color: selected
                          ? colors.brand.primary
                          : colors.text.DEFAULT
                      }}
                    >
                      {gt.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
            {groupType && (
              <AppText
                variant="caption"
                style={{ color: colors.brand.secondary }}
              >
                {groupType.description}
              </AppText>
            )}
          </View>

          {/* Number of People */}
          <Stepper
            label="How many people?"
            value={people}
            onChange={setPeople}
            min={1}
            max={50}
          />

          {/* Continue Button */}
          <Button title="Choose Your Vibes" onPress={handleContinue} />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
