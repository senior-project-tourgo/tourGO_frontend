import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import type { ApiPromotion } from '@/services/promotion.service';

interface PromotionCardProps {
  promo: ApiPromotion;
}

export function PromotionCard({ promo }: PromotionCardProps) {
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
    <Link href={`/promotions/${promo.promotionId}`} asChild>
      <Pressable className="gap-2 rounded-2xl bg-colors-surface-background p-4 shadow-sm">
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
      </Pressable>
    </Link>
  );
}
