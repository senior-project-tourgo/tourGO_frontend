import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { promotionsMock } from '@/mock/promotions.mock';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';

export default function RewardsScreen() {
  const promotions = promotionsMock;

  return (
    <Screen>
      <Link href="/leaderboard" asChild>
        <Button title="Leaderboard" />
      </Link>
      {/* Promotions */}
      {promotions.length > 0 && (
        <>
          <AppText className="mt-8 text-lg font-semibold">
            Available Promotions
          </AppText>

          {promotions.map(promo => (
            <Link
              key={promo.promotionId}
              href={`/promotions/${promo.promotionId}`}
              asChild
            >
              <Pressable className="mt-3 rounded-xl border p-4">
                <AppText className="font-semibold">
                  {promo.promotionName}
                </AppText>
                <AppText className="text-muted-foreground mt-1 text-sm">
                  {promo.promotionDescription}
                </AppText>
                <AppText className="text-muted-foreground mt-2 text-xs">
                  Expires: {promo.expirationDate}
                </AppText>
              </Pressable>
            </Link>
          ))}
        </>
      )}
    </Screen>
  );
}
