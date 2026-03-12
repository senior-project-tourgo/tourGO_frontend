import { AppText } from '@/components/AppText';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

type Promotion = {
  promotionId: string;
  promotionName: string;
  promotionDescription: string;
  expirationDate: string;
};

type PromotionCardProps = {
  promotion: Promotion;
};

export function PromotionCard({ promotion }: PromotionCardProps) {
  return (
    <Link href={`/promotions/${promotion.promotionId}`} asChild>
      <Pressable className="rounded-xl bg-colors-surface-background p-4 shadow-sm">
        <AppText className="font-semibold">{promotion.promotionName}</AppText>

        <AppText className="text-muted-foreground mt-1 text-sm">
          {promotion.promotionDescription}
        </AppText>

        <AppText className="text-muted-foreground mt-2 text-xs">
          Expires: {promotion.expirationDate}
        </AppText>
      </Pressable>
    </Link>
  );
}
