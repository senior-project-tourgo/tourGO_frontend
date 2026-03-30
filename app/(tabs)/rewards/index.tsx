import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { HeaderWithBack } from '@/components/PageHeader';
import {
  getAllPromotions,
  type ApiPromotion
} from '@/services/promotion.service';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

function PromotionCard({ promo }: { promo: ApiPromotion }) {
  const expires = new Date(promo.endDate).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const discountLabel = (): string => {
    if (promo.discountType === 'freebie') return 'Free';
    if (promo.discountType === 'percentage')
      return `${promo.discountValue}% Off`;
    return `Rs. ${promo.discountValue} Off`;
  };

  return (
    <View className="gap-2 rounded-2xl bg-colors-surface-background p-4 shadow-sm">
      <View className="flex-row items-start justify-between gap-2">
        <AppText variant="subtitle" className="flex-1">
          {promo.promotionName}
        </AppText>
        <View
          className="rounded-full px-2 py-0.5"
          style={{ backgroundColor: colors.brand.neutrals }}
        >
          <AppText
            variant="caption"
            className="font-semibold"
            style={{ color: colors.brand.secondary }}
          >
            {discountLabel()}
          </AppText>
        </View>
      </View>

      <AppText variant="muted">{promo.description}</AppText>

      <View className="flex-row items-center gap-1">
        <Ionicons
          name="calendar-outline"
          size={12}
          color={colors.text.DEFAULT}
        />
        <AppText variant="caption">Expires {expires}</AppText>
      </View>
    </View>
  );
}

export default function RewardsScreen() {
  const [promotions, setPromotions] = useState<ApiPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAllPromotions()
      .then(setPromotions)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Screen>
      <HeaderWithBack title="Rewards & Deals" showBack={false} />

      <Button
        title="Leaderboard"
        className="mb-6 bg-colors-brand-secondary"
        onPress={() => router.push('/leaderboard')}
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.brand.primary} />
      ) : error ? (
        <View className="items-center gap-2 pt-6">
          <AppText variant="muted" className="text-center">
            Could not load promotions
          </AppText>
        </View>
      ) : promotions.length === 0 ? (
        <View className="items-center gap-2 pt-10">
          <Ionicons
            name="gift-outline"
            size={48}
            color={colors.brand.neutrals}
          />
          <AppText variant="subtitle" className="text-center">
            No active promotions
          </AppText>
          <AppText variant="muted" className="text-center">
            Check back soon for deals at your favourite places
          </AppText>
        </View>
      ) : (
        <View className="gap-3">
          <AppText variant="subtitle" className="font-semibold">
            Available Promotions
          </AppText>
          {promotions.map(promo => (
            <PromotionCard key={promo.promotionId} promo={promo} />
          ))}
        </View>
      )}
    </Screen>
  );
}
