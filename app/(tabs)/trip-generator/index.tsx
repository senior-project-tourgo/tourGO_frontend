import { AppText } from '@/components/AppText';
import { AppTextInput } from '@/components/AppTextInput';
import { Accordion } from '@/components/Accordion';
import { Button } from '@/components/Button';
import DatePickerBar from '@/components/DatePickerBar';
import { HeaderWithBack } from '@/components/PageHeader';
import { IconTile } from '@/components/IconTile';
import { LocationSearchBar } from '@/components/LocationSearchBar';
import { Screen } from '@/components/Screen';
import { Stepper } from '@/components/Stepper';
import { TimePickerBar } from '@/components/TimePickerBar';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import {
  TIME_WINDOW_OPTIONS,
  TimeWindowValue,
  TIME_WINDOW_RANGES
} from '@/constants/timeOptions';
import { TRANSPORT_OPTIONS, TransportMode } from '@/constants/transportOptions';
import { Area } from '@/features/place/place.types';
import { GROUP_TYPES, type GroupType } from '@/mock/groupTypes.mock';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { buildTripPayload } from '@/utils/tripForm';
import SelectableChips from '@/components/SelectableChips';
import { PaceValue, PACE_OPTIONS } from '@/constants/paceOptions';

export default function TripGeneratorScreen() {
  const router = useRouter();

  const [itineraryName, setItineraryName] = useState('');
  const [area, setArea] = useState<Area | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | undefined>();

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

  const [transportMode, setTransportMode] = useState<TransportMode | null>(
    null
  );
  const [startCoords, setStartCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const isItineraryInvalid = submitted && !itineraryName.trim();

  const locationSummary = locationLabel
    ? locationLabel.length > 30
      ? locationLabel.slice(0, 30) + '...'
      : locationLabel
    : undefined;

  const timeSummary =
    [
      timeWindow
        ? TIME_WINDOW_OPTIONS.find(o => o.value === timeWindow)?.label
        : startTime && endTime
          ? `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : null,
      tripDate
        ? tripDate.toLocaleDateString([], { month: 'short', day: 'numeric' })
        : null
    ]
      .filter(Boolean)
      .join(' · ') || undefined;

  const styleSummary =
    [
      pace === 'relaxed'
        ? 'Relaxed'
        : pace === 'packed'
          ? 'Packed'
          : 'Balanced',
      transportMode
        ? TRANSPORT_OPTIONS.find(o => o.value === transportMode)?.label
        : null
    ]
      .filter(Boolean)
      .join(' · ') || undefined;

  const groupSummary =
    [groupType?.label, people > 1 ? `${people} people` : null]
      .filter(Boolean)
      .join(' · ') || undefined;

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

          <Accordion
            icon="calendar-outline"
            title="When is your trip?"
            summary={timeSummary}
            completed={
              !!tripDate && (!!timeWindow || (!!startTime && !!endTime))
            }
          >
            <DatePickerBar
              label="Trip Date"
              value={tripDate}
              onChange={v => {
                setTripDate(v);
                setTripDateError(undefined);
              }}
              required
              error={tripDateError}
            />

            <View className="space-y-1.5">
              <AppText className="font-medium text-colors-text">
                Time of Day
                <AppText className="text-red-500"> *</AppText>
              </AppText>
              <View className="flex-row flex-wrap gap-2.5">
                {TIME_WINDOW_OPTIONS.map(option => (
                  <IconTile
                    key={option.value}
                    icon={option.icon!}
                    label={option.label}
                    selected={timeWindow === option.value}
                    onPress={() =>
                      handleTimeWindowChange(option.value as TimeWindowValue)
                    }
                    width="47%"
                  />
                ))}
              </View>
              {timeWindowError && (
                <AppText variant="caption" className="text-red-500">
                  {timeWindowError}
                </AppText>
              )}
            </View>

            <View className="gap-1.5">
              <AppText className="text-secondary font-medium">
                Or set exact times
              </AppText>
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <TimePickerBar
                    label="From"
                    value={startTime ?? undefined}
                    onChange={date => {
                      setStartTime(date);
                      setTimeWindow(null);
                      if (endTime && date > endTime) setEndTime(date);
                    }}
                  />
                </View>
                <View className="flex-1">
                  <TimePickerBar
                    label="To"
                    value={endTime ?? undefined}
                    onChange={setEndTime}
                    minimumDate={startTime ?? undefined}
                  />
                </View>
              </View>
            </View>
          </Accordion>

          <Accordion
            icon="speedometer-outline"
            title="How packed should your trip be?"
            summary={styleSummary}
            completed={!!transportMode}
          >
            <View className="space-y-1.5">
              <AppText className="font-medium">Pace</AppText>
              <View className="flex-row gap-2.5">
                {PACE_OPTIONS.map(option => (
                  <IconTile
                    key={option.value}
                    icon={option.icon as keyof typeof Ionicons.glyphMap}
                    label={option.label}
                    description={option.description}
                    selected={pace === option.value}
                    onPress={() => setPace(option.value)}
                    width="31%"
                  />
                ))}
              </View>
            </View>

            <SelectableChips
              title="Who are you traveling with?"
              options={GROUP_TYPES}
              selectedOption={groupType}
              onSelect={handleGroupTypeSelect}
            />

            <View className="space-y-1.5">
              <AppText className="font-medium">Transport</AppText>
              <View className="flex-row flex-wrap gap-2.5">
                {TRANSPORT_OPTIONS.map(option => (
                  <IconTile
                    key={option.value}
                    icon={option.icon as any}
                    label={option.label}
                    selected={transportMode === option.value}
                    onPress={() =>
                      setTransportMode(option.value as TransportMode)
                    }
                    width="47%"
                  />
                ))}
              </View>
            </View>
          </Accordion>

          <Accordion
            icon="people-outline"
            title="Who are you traveling with?"
            summary={groupSummary}
            completed={!!groupType}
          >
            <Stepper
              label="How many people?"
              value={people}
              onChange={setPeople}
              min={1}
              max={50}
            />
          </Accordion>

          <View className="mt-4">
            <Button title="Choose Your Vibes" onPress={handleContinue} />
          </View>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
