import { Stack } from 'expo-router';

export default function ItineraryGeneratorLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Itinerary Generator Q1/2' }}
      />
      <Stack.Screen
        name="vibe-selector"
        options={{ title: 'Itinerary Generator Q2/2' }}
      />
    </Stack>
  );
}
