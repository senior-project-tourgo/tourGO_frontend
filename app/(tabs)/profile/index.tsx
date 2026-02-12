import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Link } from 'expo-router';

export default function ProfileScreen() {
  return (
    <Screen>
      <AppText className="text-lg font-semibold">Profile</AppText>
      <Link href="/(tabs)/profile/edit" asChild>
        <Button title="Edit Profile" />
      </Link>
      <Link href="/(tabs)/profile/trip-history" asChild>
        <Button title="Trips History" />
      </Link>
      <Link href="/(tabs)/profile/saved-deals" asChild>
        <Button title="Saved Deals" />
      </Link>
      <Link href="/(tabs)/profile/saved-places" asChild>
        <Button title="Saved Places" />
      </Link>
      <Link href="/leaderboard" asChild>
        <Button title="Leaderboard" />
      </Link>
      <Link href="/(tabs)/profile/logout" asChild>
        <Button title="Logout" />
      </Link>
    </Screen>
  );
}
