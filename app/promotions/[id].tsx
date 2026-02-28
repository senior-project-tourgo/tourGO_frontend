import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { promotionsMock } from '@/mock/promotions.mock';
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

  return (
    <Screen>
      <HeaderWithBack title={promotion.name} />

      <AppText className="text-muted-foreground mt-2 text-sm">
        {promotion.description}
      </AppText>

      <View className="mt-4 rounded-xl border p-4">
        <AppText className="font-semibold">Discount</AppText>
        <AppText className="text-muted-foreground mt-1 text-sm">
          {promotion.discountType === 'PERCENTAGE' &&
            `${promotion.discountValue}% off`}
          {promotion.discountType === 'FIXED' &&
            `${promotion.discountValue}฿ off`}
          {promotion.discountType === 'FREE_ITEM' && 'Free item promotion'}
        </AppText>
      </View>

      <View className="mt-3 rounded-xl border p-4">
        <AppText className="font-semibold">Validity</AppText>
        <AppText className="text-muted-foreground mt-1 text-sm">
          {promotion.startDate} - {promotion.endDate}
        </AppText>
      </View>

      <View className="mt-3 rounded-xl border p-4">
        <AppText className="font-semibold">Points Required</AppText>
        <AppText className="text-muted-foreground mt-1 text-sm">
          {promotion.pointsRequired} pts
        </AppText>
      </View>

      <View className="mt-3 rounded-xl border p-4">
        <AppText className="font-semibold">Usage Limit</AppText>
        <AppText className="text-muted-foreground mt-1 text-sm">
          {promotion.usageLimit} redemptions
        </AppText>
      </View>
    </Screen>
  );
}
