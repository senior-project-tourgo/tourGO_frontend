import { Stack } from 'expo-router';

export default function ItinerariesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Itineraries' }} />
    </Stack>
  );
}
