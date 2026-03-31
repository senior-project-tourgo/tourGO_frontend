import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

import { Screen } from '@/components/Screen';
import { HeaderWithBack } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { PromotionCard } from '@/components/cards/variants/PromotionCard';
import {
  getAllPromotions,
  type ApiPromotion
} from '@/services/promotion.service';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';

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

  const renderEmptyState = () => (
    <View className="items-center gap-2 pt-10">
      <Ionicons name="gift-outline" size={48} color={colors.brand.neutrals} />
      <AppText variant="subtitle" className="text-center">
        No active promotions
      </AppText>
      <AppText variant="muted" className="text-center">
        Check back soon for deals at your favourite places
      </AppText>
    </View>
  );

  const renderErrorState = () => (
    <View className="items-center gap-2 pt-6">
      <AppText variant="muted" className="text-center">
        Could not load promotions
      </AppText>
    </View>
  );

  if (loading) {
    return (
      <Screen>
        <HeaderWithBack title="Rewards & Deals" showBack={false} />
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <HeaderWithBack title="Rewards & Deals" showBack={false} />
        {renderErrorState()}
      </Screen>
    );
  }

  return (
    <Screen>
      <HeaderWithBack title="Rewards & Deals" showBack={false} />

      <Button
        title="Leaderboard"
        className="mb-6 bg-colors-brand-secondary"
        onPress={() => router.push('/leaderboard')}
      />

      {promotions.length === 0 ? (
        renderEmptyState()
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
