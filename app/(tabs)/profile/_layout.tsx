import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Profile' }} />
      <Stack.Screen name="edit" options={{ title: 'Edit Profile' }} />
      <Stack.Screen
        name="itinerary-history"
        options={{ title: 'Itinerary History' }}
      />
      <Stack.Screen name="saved-deals" options={{ title: 'Saved Deals' }} />
      <Stack.Screen name="saved-places" options={{ title: 'Saved Places' }} />
    </Stack>
  );
}
