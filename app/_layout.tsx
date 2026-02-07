import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import '../global.css';

export default function RootLayout() {
  console.log("Root layout rendered");
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="places" options={{ title: 'Place' }} />
        <Stack.Screen name="leaderboard" options={{ title: 'Leaderboard' }} />
      </Stack>
    </AuthProvider>
  );
}
