import { Stack } from 'expo-router';

export default function TripGeneratorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Trip Generator Q1/2' }} />
      <Stack.Screen
        name="vibe-selector"
        options={{ title: 'Trip Generator Q2/2' }}
      />
    </Stack>
  );
}
