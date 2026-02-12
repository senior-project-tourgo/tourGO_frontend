import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Link } from 'expo-router';

export default function TripGeneratorScreen() {
  return (
    <Screen>
      <Link href="/(tabs)/trip-generator/vibe-selector" asChild>
        <Button title="Select Vibes" />
      </Link>
    </Screen>
  );
}
