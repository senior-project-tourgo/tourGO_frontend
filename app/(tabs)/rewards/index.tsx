import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { Button } from '@/components/Button';
import { promotionsMock } from '@/mock/promotions.mock';

export default function RewardsScreen() {
  const promotions = promotionsMock;

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-lg font-semibold">Rewards</Text>
      <Link href="/leaderboard" asChild>
        <Button title="Leaderboard"></Button>
      </Link>
      {/* Promotions */}
      {promotions.length > 0 && (
        <>
          <Text className="mt-8 text-lg font-semibold">
            Available Promotions
          </Text>

          {promotions.map(promo => (
            <Link
              key={promo.promotionId}
              href={`/promotions/${promo.promotionId}`}
              asChild
            >
              <Pressable className="mt-3 rounded-xl border p-4">
                <Text className="font-semibold">{promo.promotionName}</Text>
                <Text className="text-muted-foreground mt-1 text-sm">
                  {promo.promotionDescription}
                </Text>
                <Text className="text-muted-foreground mt-2 text-xs">
                  Expires: {promo.expirationDate}
                </Text>
              </Pressable>
            </Link>
          ))}
        </>
      )}
    </View>
  );
}
