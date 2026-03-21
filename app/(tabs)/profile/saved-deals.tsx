import { AppText } from '@/components/AppText';
import { HeaderWithBack } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { getSavedPromotions } from '@/services/user.service';
import type { ApiPromotion } from '@/services/promotion.service';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function SavedDealsScreen() {
  const [promotions, setPromotions] = useState<ApiPromotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedPromotions()
      .then(setPromotions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const discountLabel = (promo: ApiPromotion): string => {
    if (promo.discountType === 'freebie') return 'Free';
    if (promo.discountType === 'percentage')
      return `${promo.discountValue}% Off`;
    return `Rs. ${promo.discountValue} Off`;
  };

  return (
    <Screen>
      <HeaderWithBack title="Saved Deals" />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.brand.primary}
          className="mt-6"
        />
      ) : promotions.length === 0 ? (
        <View className="items-center gap-2 pt-10">
          <Ionicons
            name="pricetag-outline"
            size={48}
            color={colors.brand.neutrals}
          />
          <AppText variant="subtitle" className="text-center">
            No saved deals yet
          </AppText>
          <AppText variant="muted" className="text-center">
            Save promotions from place detail pages
          </AppText>
        </View>
      ) : (
        <View className="gap-3">
          {promotions.map(promo => {
            const expires = new Date(promo.endDate).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            return (
              <View
                key={promo.promotionId}
                className="gap-2 rounded-2xl bg-colors-surface-background p-4 shadow-sm"
              >
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
                      {discountLabel(promo)}
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
          })}
        </View>
      )}
    </Screen>
  );
}
