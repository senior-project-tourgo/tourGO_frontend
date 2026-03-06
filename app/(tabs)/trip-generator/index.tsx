import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import DatePickerBar from '@/components/DatePickerBar';
import { Dropdown } from '@/components/Dropdown';
import { AppTextInput } from '@/components/AppTextInput';
import { OptionSelector } from '@/components/OptionSelector';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { SliderField } from '@/components/SliderField';
import { TimePickerBar } from '@/components/TimePickerBar';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

export default function TripGeneratorScreen() {
  const router = useRouter();

  const [itineraryName, setItineraryName] = useState('');
  const [area, setArea] = useState('Kathmandu');
  const [people, setPeople] = useState<number>(1);
  const [duration, setDuration] = useState<number>(4);
  const [placesCount, setPlacesCount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [tripDate, setTripDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const areaOptions = ['Kathmandu', 'Pokhara', 'Bhaktapur', 'Lalitpur'];

  const isItineraryInvalid = submitted && !itineraryName.trim();
  const isPlacesInvalid =
    submitted && (!placesCount || isNaN(Number(placesCount)));

  const handleContinue = async () => {
    setSubmitted(true);

    if (!itineraryName.trim() || !placesCount || isNaN(Number(placesCount))) {
      return;
    }

    const payload = {
      itineraryName: itineraryName.trim(),
      travelingArea: area,
      numberOfPeople: people,
      durationHours: duration,
      numberOfPlaces: Number(placesCount),
      tripDate,
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
          error={isItineraryInvalid ? 'Itinerary name is required' : undefined}
        />

        {/* Traveling Area */}
        <Dropdown
          label="Traveling Area"
          options={areaOptions}
          value={area}
          onChange={setArea}
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
                if (endTime && date > endTime) setEndTime(date);
                setStartTime(date);
              }}
            />
          </View>

          <View className="flex-1">
            <TimePickerBar
              label="End Time"
              value={endTime ?? undefined}
              onChange={date => setEndTime(date)}
            />
          </View>
        </View>

        {/* Number of People */}
        <OptionSelector
          label="Number of People"
          options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '>10']}
          value={people > 10 ? '>10' : people}
          onChange={val => {
            if (val === '>10') {
              setPeople(11);
            } else {
              setPeople(Number(val));
            }
          }}
          renderOption={(option, selected) => (
            <AppText className={selected ? 'text-white' : ''}>{option}</AppText>
          )}
        />

        {/* Duration */}
        <SliderField
          label="Duration"
          value={duration}
          onChange={setDuration}
          minimumValue={1}
          maximumValue={12}
          step={1}
          unit="hours"
        />

        {/* Number of Places */}
        <AppTextInput
          label="Number of Places"
          placeholder="e.g. 4"
          value={placesCount}
          onChangeText={setPlacesCount}
          keyboardType="numeric"
          required
          error={isPlacesInvalid ? 'Please enter a valid number' : undefined}
        />

        {/* Continue Button */}
        <Button
          title="Continue to Select Vibes"
          onPress={handleContinue}
          isLoading={isLoading}
        />
      </View>
    </Screen>
  );
}
