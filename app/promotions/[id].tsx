import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { promotionsMock } from '@/mock/promotions.mock';
import { rewardsMock } from '@/mock/rewards.mock';

export default function PromotionsDetails() {
  const { id } = useLocalSearchParams();
  const promotion = promotionsMock.find(promo => promo.promotionId === id);

  if (!promotion) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-lg font-semibold">Promotion not found 😢</Text>
      </View>
    );
  }

  const promotionRewards = rewardsMock.filter(reward =>
    promotion.rewardIds.includes(reward.rewardId)
  );
  return (
    <View className="flex-1 items-center justify-center bg-background">
      {promotionRewards.map(reward => (
        <View key={reward.rewardId} className="mt-3 rounded-xl border p-4">
          <Text className="font-semibold">{reward.rewardName}</Text>
          <Text className="text-muted-foreground mt-1 text-sm">
            {reward.rewardDescription}
          </Text>
        </View>
      ))}
    </View>
  );
}
