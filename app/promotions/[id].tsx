import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { HeaderWithBack } from '@/components/PageHeader';
import { useEffect, useState } from 'react';
import { getPromotionById, ApiPromotion } from '@/services/promotion.service';

export default function PromotionsDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [promotion, setPromotion] = useState<ApiPromotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Reset state when id changes
    setError(null);
    setPromotion(null);

    if (!id) {
      setLoading(false);
      setError('Invalid promotion ID');
      return;
    }

    setLoading(true);

    getPromotionById(id)
      .then(data => {
        if (isMounted) {
          setPromotion(data);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'Failed to load promotion');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  if (loading) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <AppText className="text-lg font-semibold">Loading…</AppText>
      </View>
    );
  }

  if (error || !promotion) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <AppText className="text-lg font-semibold">
          {error || 'Promotion not found 😢'}
        </AppText>
      </View>
    );
  }

  return (
    <Screen>
      <HeaderWithBack title={promotion.promotionName} />

      <View className="bg-background mt-4 rounded-xl border p-4">
        <AppText className="text-lg font-semibold">
          {promotion.promotionName}
        </AppText>

        <AppText className="text-muted-foreground mt-2">
          {promotion.description}
        </AppText>

        <AppText className="mt-2 text-sm">
          Discount:{' '}
          {promotion.discountType === 'percentage'
            ? `${promotion.discountValue}%`
            : promotion.discountType === 'fixed'
              ? `${promotion.discountValue} THB`
              : 'Freebie'}
        </AppText>

        <AppText className="mt-1 text-sm">
          Valid: {formatDate(promotion.startDate)} -{' '}
          {formatDate(promotion.endDate)}
        </AppText>

        {promotion.usageLimit !== null && (
          <AppText className="mt-1 text-sm">
            Usage Limit: {promotion.usageLimit}
          </AppText>
        )}

        <AppText className="mt-1 text-sm">
          Status: {promotion.isActive ? 'Active' : 'Inactive'}
        </AppText>
      </View>
    </Screen>
  );
}
