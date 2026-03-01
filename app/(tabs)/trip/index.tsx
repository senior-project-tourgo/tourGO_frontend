import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Link } from 'expo-router';

export default function TripScreen() {
  return (
    <Screen>
      <AppText className="text-lg font-semibold">Trip</AppText>
      <Link href="/(tabs)/trip-generator" asChild>
        <Button title="Trip Generator" />
      </Link>
    </Screen>
  );
}
