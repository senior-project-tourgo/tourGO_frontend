import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="places" options={{ title: 'Place' }} />
      <Stack.Screen name="leaderboard" options={{ title: 'Leaderboard' }} />
    </Stack>
  );
}
