import { useState } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/AppText';
import { AppTextInput } from '@/components/AppTextInput';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { HeaderWithBack } from '@/components/PageHeader';
import { Dropdown } from '@/components/Dropdown';
import { SliderField } from '@/components/SliderField';
import { OptionSelector } from '@/components/OptionSelector';

export default function TripGeneratorScreen() {
  const router = useRouter();

  const [itineraryName, setItineraryName] = useState('');
  const [area, setArea] = useState('Kathmandu');
  const [people, setPeople] = useState<number>(1);
  const [budget, setBudget] = useState<number>(1);
  const [duration, setDuration] = useState<number>(4);
  const [placesCount, setPlacesCount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [submitted, setSubmitted] = useState(false);

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
      budgetLevel: budget,
      durationHours: duration,
      numberOfPlaces: Number(placesCount)
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
      <ScrollView className="flex-1 px-4">
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

          {/* Traveling Area */}
          <Dropdown
            label="Traveling Area"
            options={areaOptions}
            value={area}
            onChange={setArea}
          />

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
              <AppText className={selected ? 'text-white' : ''}>
                {option}
              </AppText>
            )}
          />

          {/* Budget */}
          <OptionSelector
            label="Budget"
            options={[1, 2, 3, 4]}
            value={budget}
            onChange={setBudget}
            renderOption={(level, selected) => (
              <AppText
                className={`text-2xl ${
                  budget >= level ? 'opacity-100' : 'opacity-30'
                }`}
              >
                {'रु '.repeat(level).trim()}
              </AppText>
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

          {/* Continue Button */}
          <Button
            title="Continue to Select Vibes"
            onPress={handleContinue}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
