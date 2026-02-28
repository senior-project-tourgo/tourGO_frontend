export const promotionsMock = [
  {
    promotionId: 'promo_001',
    placeId: 'plc_001',
    name: 'Early Bird 10% Off',
    description: 'Enjoy 10% off your total bill when you visit before 5PM.',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    startDate: '2025-03-01T00:00:00.000Z',
    endDate: '2025-04-01T23:59:59.000Z',
    usageLimit: 100,
    pointsRequired: 100,
    createdAt: '2025-02-20T10:00:00.000Z'
  },
  {
    promotionId: 'promo_002',
    placeId: 'plc_001',
    name: 'Free Signature Drink',
    description: 'Redeem a free signature drink with any main course purchase.',
    discountType: 'FREE_ITEM',
    discountValue: 1,
    startDate: '2025-03-05T00:00:00.000Z',
    endDate: '2025-03-25T23:59:59.000Z',
    usageLimit: 50,
    pointsRequired: 250,
    createdAt: '2025-02-21T09:00:00.000Z'
  },

  {
    promotionId: 'promo_003',
    placeId: 'plc_002',
    name: '80฿ Off Special',
    description: 'Get 80฿ off when spending at least 500฿.',
    discountType: 'FIXED',
    discountValue: 80,
    startDate: '2025-03-01T00:00:00.000Z',
    endDate: '2025-03-30T23:59:59.000Z',
    usageLimit: 70,
    pointsRequired: 200,
    createdAt: '2025-02-19T14:00:00.000Z'
  },

  {
    promotionId: 'promo_004',
    placeId: 'plc_004',
    name: '15% Weekend Deal',
    description: 'Enjoy 15% off your total bill every weekend.',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    startDate: '2025-03-01T00:00:00.000Z',
    endDate: '2025-05-01T23:59:59.000Z',
    usageLimit: 150,
    pointsRequired: 300,
    createdAt: '2025-02-18T10:00:00.000Z'
  },
  {
    promotionId: 'promo_005',
    placeId: 'plc_004',
    name: '120฿ Cash Discount',
    description: 'Flat 120฿ off when your bill exceeds 800฿.',
    discountType: 'FIXED',
    discountValue: 120,
    startDate: '2025-03-10T00:00:00.000Z',
    endDate: '2025-04-10T23:59:59.000Z',
    usageLimit: 60,
    pointsRequired: 350,
    createdAt: '2025-02-22T11:00:00.000Z'
  },
  {
    promotionId: 'promo_006',
    placeId: 'plc_004',
    name: 'Free Dessert Treat',
    description: 'Redeem a complimentary dessert with any dine-in order.',
    discountType: 'FREE_ITEM',
    discountValue: 1,
    startDate: '2025-03-15T00:00:00.000Z',
    endDate: '2025-04-15T23:59:59.000Z',
    usageLimit: 40,
    pointsRequired: 400,
    createdAt: '2025-02-23T08:00:00.000Z'
  },

  {
    promotionId: 'promo_007',
    placeId: 'plc_005',
    name: 'Loyalty 8% Off',
    description: 'Members get 8% off all menu items for a limited time.',
    discountType: 'PERCENTAGE',
    discountValue: 8,
    startDate: '2025-03-01T00:00:00.000Z',
    endDate: '2025-06-01T23:59:59.000Z',
    usageLimit: 200,
    pointsRequired: 120,
    createdAt: '2025-02-15T12:00:00.000Z'
  },

  {
    promotionId: 'promo_008',
    placeId: 'plc_007',
    name: '90฿ Off Deal',
    description: 'Save 90฿ on your next visit when spending 600฿ or more.',
    discountType: 'FIXED',
    discountValue: 90,
    startDate: '2025-03-05T00:00:00.000Z',
    endDate: '2025-04-05T23:59:59.000Z',
    usageLimit: 100,
    pointsRequired: 220,
    createdAt: '2025-02-24T10:00:00.000Z'
  },
  {
    promotionId: 'promo_009',
    placeId: 'plc_007',
    name: '12% Limited Offer',
    description: 'Enjoy 12% off your total bill for a limited time only.',
    discountType: 'PERCENTAGE',
    discountValue: 12,
    startDate: '2025-03-10T00:00:00.000Z',
    endDate: '2025-05-10T23:59:59.000Z',
    usageLimit: 80,
    pointsRequired: 260,
    createdAt: '2025-02-24T11:00:00.000Z'
  },

  {
    promotionId: 'promo_010',
    placeId: 'plc_008',
    name: 'Free Side Dish',
    description: 'Redeem a free side dish with any main order.',
    discountType: 'FREE_ITEM',
    discountValue: 1,
    startDate: '2025-03-01T00:00:00.000Z',
    endDate: '2025-03-20T23:59:59.000Z',
    usageLimit: 30,
    pointsRequired: 300,
    createdAt: '2025-02-16T09:00:00.000Z'
  },

  {
    promotionId: 'promo_011',
    placeId: 'plc_010',
    name: '20% Premium Discount',
    description: 'Exclusive 20% off for premium point holders.',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    startDate: '2025-03-01T00:00:00.000Z',
    endDate: '2025-04-01T23:59:59.000Z',
    usageLimit: 90,
    pointsRequired: 500,
    createdAt: '2025-02-18T13:00:00.000Z'
  },
  {
    promotionId: 'promo_012',
    placeId: 'plc_010',
    name: '150฿ Super Saver',
    description: 'Flat 150฿ discount on bills over 1000฿.',
    discountType: 'FIXED',
    discountValue: 150,
    startDate: '2025-03-15T00:00:00.000Z',
    endDate: '2025-05-15T23:59:59.000Z',
    usageLimit: 60,
    pointsRequired: 450,
    createdAt: '2025-02-20T15:00:00.000Z'
  },

  {
    promotionId: 'promo_013',
    placeId: 'plc_011',
    name: '5% Everyday Reward',
    description: 'Get 5% off any day of the week as a loyalty reward.',
    discountType: 'PERCENTAGE',
    discountValue: 5,
    startDate: '2025-03-01T00:00:00.000Z',
    endDate: '2025-12-31T23:59:59.000Z',
    usageLimit: 300,
    pointsRequired: 80,
    createdAt: '2025-02-14T10:00:00.000Z'
  },

  {
    promotionId: 'promo_014',
    placeId: 'plc_013',
    name: '100฿ Member Voucher',
    description: 'Redeem 100฿ off with your reward points.',
    discountType: 'FIXED',
    discountValue: 100,
    startDate: '2025-03-01T00:00:00.000Z',
    endDate: '2025-04-01T23:59:59.000Z',
    usageLimit: 75,
    pointsRequired: 240,
    createdAt: '2025-02-18T10:30:00.000Z'
  },

  {
    promotionId: 'promo_015',
    placeId: 'plc_014',
    name: '18% Hot Deal',
    description: 'Limited-time 18% discount on selected menu items.',
    discountType: 'PERCENTAGE',
    discountValue: 18,
    startDate: '2025-03-01T00:00:00.000Z',
    endDate: '2025-05-01T23:59:59.000Z',
    usageLimit: 110,
    pointsRequired: 320,
    createdAt: '2025-02-21T10:00:00.000Z'
  },
  {
    promotionId: 'promo_016',
    placeId: 'plc_014',
    name: 'Free Dessert Unlock',
    description: 'Use your points to unlock a complimentary dessert.',
    discountType: 'FREE_ITEM',
    discountValue: 1,
    startDate: '2025-03-20T00:00:00.000Z',
    endDate: '2025-04-20T23:59:59.000Z',
    usageLimit: 45,
    pointsRequired: 380,
    createdAt: '2025-02-22T16:00:00.000Z'
  }
];
