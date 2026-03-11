import { AppText } from '@/components/AppText';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';

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
      <Pressable className="mt-3 rounded-xl border p-4">
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
