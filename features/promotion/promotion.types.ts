export type Promotion = {
  promotionId: string;
  placeId: string;
  promotionName: string;
  promotionDescription: string;
  expirationDate: string; // ISO date string
  rewardIds: string[];
};
