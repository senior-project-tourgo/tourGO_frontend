import { Button } from '@/components/Button';
import DatePickerBar from '@/components/DatePickerBar';
import { Dropdown } from '@/components/Dropdown';
import { AppTextInput } from '@/components/AppTextInput';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
// import { SliderField } from '@/components/SliderField';
import { TimePickerBar } from '@/components/TimePickerBar';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Stepper } from '@/components/Stepper';
import { PaceOption, PaceSelector } from '@/components/PaceSelector';
import { PACE_OPTIONS } from '@/constants/tripOptions';

export default function TripGeneratorScreen() {
  const router = useRouter();

  const [itineraryName, setItineraryName] = useState('');
  const [area, setArea] = useState('Kathmandu');
  const [people, setPeople] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [tripDate, setTripDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const [pace, setPace] = useState<PaceOption['value']>('balanced');
  const areaOptions = ['Kathmandu', 'Pokhara', 'Bhaktapur', 'Lalitpur'];

  const isItineraryInvalid = submitted && !itineraryName.trim();

  const handleContinue = async () => {
    setSubmitted(true);

    if (!itineraryName.trim()) {
      return;
    }

    const payload = {
      itineraryName: itineraryName.trim(),
      travelingArea: area,
      numberOfPeople: people,
      pace: pace,
      tripDate: tripDate ? tripDate.toISOString() : null,
      startTime: startTime ? startTime.toISOString() : null,
      endTime: endTime ? endTime.toISOString() : null
    };

    try {
      setIsLoading(true);

      router.push({
        pathname: '/(tabs)/trip-generator/vibe-selector',
        params: payload
      });
    } catch {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Screen>
        <HeaderWithBack title="Create New Itinerary" />

        <View className="gap-6">
          {/* Itinerary Name */}
          <AppTextInput
            label="Itinerary Name"
            placeholder="e.g. Weekend in Pokhara"
            value={itineraryName}
            onChangeText={setItineraryName}
            required
            error={
              isItineraryInvalid ? 'Itinerary name is required' : undefined
            }
          />

          {/* Traveling Area */}
          <Dropdown
            label="Traveling Area"
            options={areaOptions}
            value={area}
            onChange={setArea}
            required
            error={
              isItineraryInvalid ? 'Traveling area is required' : undefined
            }
          />

          {/* Trip Date */}
          <View className="gap-2">
            <DatePickerBar onChange={setTripDate} />
          </View>

          {/* Time Row */}
          <View className="flex-row gap-2">
            <View className="flex-1">
              <TimePickerBar
                label="Start Time"
                value={startTime ?? undefined}
                onChange={date => {
                  setStartTime(date);

                  // keep endTime valid if startTime moves forward
                  if (endTime && date > endTime) {
                    setEndTime(date);
                  }
                }}
              />
            </View>

            <View className="flex-1">
              <TimePickerBar
                label="End Time"
                value={endTime ?? undefined}
                onChange={setEndTime}
                minimumDate={startTime ?? undefined}
              />
            </View>
          </View>

          {/* Number of Places */}
          <PaceSelector
            label="Trip Pace"
            value={pace}
            options={PACE_OPTIONS}
            onChange={setPace}
          />

          {/* Number of People */}
          <Stepper
            label="Number of People"
            value={people}
            onChange={setPeople}
            min={1}
            max={10}
          />

          {/* Continue Button */}
          <Button
            title="Continue to Select Vibes"
            onPress={handleContinue}
            isLoading={isLoading}
          />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
