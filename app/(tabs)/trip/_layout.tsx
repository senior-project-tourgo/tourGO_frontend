import { Stack } from 'expo-router';

export default function TripLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Trips' }} />
    </Stack>
  );
}
