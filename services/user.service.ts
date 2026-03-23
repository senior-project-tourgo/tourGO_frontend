import api from '@/config/api';
import type { Place } from '@/features/place/place.types';
import type { ApiPromotion } from '@/services/promotion.service';

export type UserProfile = {
  _id: string;
  name: string;
  username: string;
  email?: string;
  phoneNumber?: string;
  profilePicture: string | null;
  savedPlaces: string[];
  savedPromotions: string[];
  redeemedRewards: string[];
  xp: number;
  badge: 'Newcomer' | 'Explorer' | 'Adventurer' | 'Legend';
};

export async function getUserProfile(): Promise<UserProfile> {
  try {
    const response = await api.get<UserProfile>('/user/me');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
}

export async function toggleSavePlace(
  placeId: string
): Promise<{ saved: boolean; savedPlaces: string[] }> {
  try {
    const response = await api.post(`/user/save-place/${placeId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to save place');
  }
}

export async function toggleSavePromotion(
  promotionId: string
): Promise<{ saved: boolean; savedPromotions: string[] }> {
  try {
    const response = await api.post(`/user/save-promotion/${promotionId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to save promotion'
    );
  }
}

export async function getSavedPlaces(): Promise<Place[]> {
  try {
    const response = await api.get<Place[]>('/user/saved-places');
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch saved places'
    );
  }
}

export async function getSavedPromotions(): Promise<ApiPromotion[]> {
  try {
    const response = await api.get<ApiPromotion[]>('/user/saved-promotions');
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch saved promotions'
    );
  }
}
