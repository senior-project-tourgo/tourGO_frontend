import { Stack } from 'expo-router';

export default function PreferenceLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Preference' }} />
    </Stack>
  );
}
