import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { promotionsMock } from '@/mock/promotions.mock';
import { rewardsMock } from '@/mock/rewards.mock';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { HeaderWithBack } from '@/components/PageHeader';

export default function PromotionsDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const promotion = promotionsMock.find(promo => promo.promotionId === id);

  if (!promotion) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <AppText className="text-lg font-semibold">
          Promotion not found 😢
        </AppText>
      </View>
    );
  }

  const promotionRewards = rewardsMock.filter(reward =>
    promotion.rewardIds.includes(reward.rewardId)
  );
  return (
    <Screen>
      <HeaderWithBack title={promotion.promotionName} />
      {promotionRewards.map(reward => (
        <View key={reward.rewardId} className="mt-3 rounded-xl border p-4">
          <AppText className="font-semibold">{reward.rewardName}</AppText>
          <AppText className="text-muted-foreground mt-1 text-sm">
            {reward.rewardDescription}
          </AppText>
        </View>
      ))}
    </Screen>
  );
}
