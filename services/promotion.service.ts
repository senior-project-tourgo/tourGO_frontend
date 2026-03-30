import api from '@/config/api';

export type ApiPromotion = {
  promotionId: string;
  promotionName: string;
  placeId: string;
  discountType: 'percentage' | 'fixed' | 'freebie';
  discountValue: number;
  description: string;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  isActive: boolean;
};

export async function getAllPromotions(): Promise<ApiPromotion[]> {
  try {
    const response = await api.get<ApiPromotion[]>('/promotions');
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch promotions'
    );
  }
}

export async function getPromotionsByPlace(
  placeId: string
): Promise<ApiPromotion[]> {
  try {
    const response = await api.get<ApiPromotion[]>(
      `/promotions/by-place/${placeId}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch place promotions'
    );
  }
}

export async function getPromotionById(
  promotionId: string
): Promise<ApiPromotion> {
  try {
    const response = await api.get<ApiPromotion>(`/promotions/${promotionId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch promotion'
    );
  }
}
