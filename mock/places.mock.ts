import type { Place } from '@/features/place/place.types';

const defaultHours = {
  monday: [{ open: '09:00', close: '18:00' }],
  tuesday: [{ open: '09:00', close: '18:00' }],
  wednesday: [{ open: '09:00', close: '18:00' }],
  thursday: [{ open: '09:00', close: '18:00' }],
  friday: [{ open: '09:00', close: '18:00' }],
  saturday: [{ open: '09:00', close: '18:00' }],
  sunday: [{ open: '09:00', close: '18:00' }]
};

export const placesMock: Place[] = [
  // ================= KATHMANDU =================

  {
    placeId: 'plc_001',
    placeName: 'Swayambhunath Stupa',
    promotions: [],
    image: 'https://example.com/swayambhu.jpg',
    location: { area: 'Kathmandu', lat: 27.7149, lng: 85.29 },
    mapsLinkKey: 'swayambhu_key',
    averageRating: 4.8,
    priceRange: '$',
    openingHours: defaultHours,
    isActive: true,
    typicalTimeSpent: '1–2 hours',
    vibe: ['Spiritual & Temples', 'Scenic Viewpoints', 'Heritage Walk'],
    specialFacilities: ['Panoramic valley view'],
    contactNumber: null,
    socialMedia: {
      instagram: { handle: '@swayambhu', likes: 12000 },
      facebook: { page: 'Swayambhu Official', likes: 25000 }
    }
  },

  {
    placeId: 'plc_002',
    placeName: 'Boudhanath Stupa',
    promotions: [],
    image: 'https://example.com/boudha.jpg',
    location: { area: 'Kathmandu', lat: 27.7215, lng: 85.362 },
    mapsLinkKey: 'boudha_key',
    averageRating: 4.9,
    priceRange: '$',
    openingHours: defaultHours,
    isActive: true,
    typicalTimeSpent: '1–2 hours',
    vibe: ['Spiritual & Temples', 'Heritage Walk'],
    specialFacilities: ['Prayer wheels'],
    contactNumber: null,
    socialMedia: {
      instagram: { handle: '@boudha', likes: 15000 }
    }
  },

  {
    placeId: 'plc_003',
    placeName: 'Kathmandu Street Food Crawl',
    promotions: [],
    image: 'https://example.com/streetfood.jpg',
    location: { area: 'Kathmandu', lat: 27.717, lng: 85.324 },
    mapsLinkKey: 'streetfood_key',
    averageRating: 4.6,
    priceRange: '$',
    openingHours: defaultHours,
    isActive: true,
    typicalTimeSpent: '2 hours',
    vibe: ['Local Food Hunt'],
    specialFacilities: ['Local guide'],
    contactNumber: null,
    socialMedia: {
      instagram: { handle: '@ktmfood', likes: 8000 }
    }
  },

  {
    placeId: 'plc_004',
    placeName: 'Champadevi Hiking Trail',
    promotions: [],
    image: 'https://example.com/champadevi.jpg',
    location: { area: 'Kathmandu', lat: 27.6588, lng: 85.277 },
    mapsLinkKey: 'champadevi_key',
    averageRating: 4.7,
    priceRange: '$$',
    openingHours: defaultHours,
    isActive: true,
    typicalTimeSpent: '3–4 hours',
    vibe: ['Trekking Trails', 'Mountain Adventure', 'Scenic Viewpoints'],
    specialFacilities: ['Forest trail'],
    contactNumber: null,
    socialMedia: {}
  },

  {
    placeId: 'plc_005',
    placeName: 'Shivapuri National Park Hike',
    promotions: [],
    image: 'https://example.com/shivapuri.jpg',
    location: { area: 'Kathmandu', lat: 27.8, lng: 85.4 },
    mapsLinkKey: 'shivapuri_key',
    averageRating: 4.8,
    priceRange: '$$',
    openingHours: defaultHours,
    isActive: true,
    typicalTimeSpent: '4–5 hours',
    vibe: ['Trekking Trails', 'Mountain Adventure'],
    specialFacilities: ['Nature reserve'],
    contactNumber: null,
    socialMedia: {}
  },

  // ================= POKHARA =================

  {
    placeId: 'plc_006',
    placeName: 'Phewa Lake Boating',
    promotions: [],
    image: 'https://example.com/phewa.jpg',
    location: { area: 'Pokhara', lat: 28.2096, lng: 83.9596 },
    mapsLinkKey: 'phewa_key',
    averageRating: 4.8,
    priceRange: '$$',
    openingHours: defaultHours,
    isActive: true,
    typicalTimeSpent: '2–3 hours',
    vibe: ['Lakeside Chill', 'Scenic Viewpoints'],
    specialFacilities: ['Boat rental'],
    contactNumber: null,
    socialMedia: {}
  },

  {
    placeId: 'plc_007',
    placeName: 'Sarangkot Paragliding',
    promotions: [],
    image: 'https://example.com/sarangkot.jpg',
    location: { area: 'Pokhara', lat: 28.242, lng: 83.949 },
    mapsLinkKey: 'sarangkot_key',
    averageRating: 4.9,
    priceRange: '$$$',
    openingHours: defaultHours,
    isActive: true,
    typicalTimeSpent: '1 hour',
    vibe: ['Mountain Adventure', 'Scenic Viewpoints'],
    specialFacilities: ['Certified pilots'],
    contactNumber: null,
    socialMedia: {}
  },

  {
    placeId: 'plc_008',
    placeName: 'World Peace Pagoda',
    promotions: [],
    image: 'https://example.com/peacepagoda.jpg',
    location: { area: 'Pokhara', lat: 28.2, lng: 83.944 },
    mapsLinkKey: 'peace_pagoda_key',
    averageRating: 4.8,
    priceRange: '$$',
    openingHours: defaultHours,
    isActive: true,
    typicalTimeSpent: '2 hours',
    vibe: ['Spiritual & Temples', 'Scenic Viewpoints'],
    specialFacilities: ['Hilltop view'],
    contactNumber: null,
    socialMedia: {}
  },

  {
    placeId: 'plc_009',
    placeName: 'Begnas Lake Retreat',
    promotions: [],
    image: 'https://example.com/begnas.jpg',
    location: { area: 'Pokhara', lat: 28.173, lng: 84.1 },
    mapsLinkKey: 'begnas_key',
    averageRating: 4.7,
    priceRange: '$$',
    openingHours: defaultHours,
    isActive: true,
    typicalTimeSpent: '3 hours',
    vibe: ['Lakeside Chill', 'Scenic Viewpoints'],
    specialFacilities: ['Quiet lake'],
    contactNumber: null,
    socialMedia: {}
  },

  {
    placeId: 'plc_010',
    placeName: 'Mahendra Cave',
    promotions: [],
    image: 'https://example.com/mahendra.jpg',
    location: { area: 'Pokhara', lat: 28.266, lng: 83.978 },
    mapsLinkKey: 'mahendra_key',
    averageRating: 4.4,
    priceRange: '$',
    openingHours: defaultHours,
    isActive: true,
    typicalTimeSpent: '1–2 hours',
    vibe: ['Mountain Adventure'],
    specialFacilities: ['Guided cave walk'],
    contactNumber: null,
    socialMedia: {}
  },

  // ================= BHAKTAPUR =================

  {
    placeId: 'plc_011',
    placeName: 'Bhaktapur Durbar Square',
    promotions: [],
    image: 'https://example.com/bhaktapur.jpg',
    location: { area: 'Bhaktapur', lat: 27.671, lng: 85.4298 },
    mapsLinkKey: 'bhaktapur_key',
    averageRating: 4.9,
    priceRange: '$',
    openingHours: defaultHours,
    isActive: true,
    typicalTimeSpent: '2–3 hours',
    vibe: ['Heritage Walk', 'Spiritual & Temples'],
    specialFacilities: ['Ancient palace complex'],
    contactNumber: null,
    socialMedia: {}
  },

  {
    placeId: 'plc_012',
    placeName: 'Nagarkot Sunrise Viewpoint',
    promotions: [],
    image: 'https://example.com/nagarkot.jpg',
    location: { area: 'Bhaktapur', lat: 27.7154, lng: 85.5208 },
    mapsLinkKey: 'nagarkot_key',
    averageRating: 4.7,
    priceRange: '$$',
    openingHours: defaultHours,
    isActive: true,
    typicalTimeSpent: '1–2 hours',
    vibe: ['Scenic Viewpoints', 'Mountain Adventure'],
    specialFacilities: ['Sunrise panorama'],
    contactNumber: null,
    socialMedia: {}
  },

  // ================= LALITPUR =================

  {
    placeId: 'plc_013',
    placeName: 'Patan Durbar Square',
    promotions: [],
    image: 'https://example.com/patan.jpg',
    location: { area: 'Lalitpur', lat: 27.673, lng: 85.325 },
    mapsLinkKey: 'patan_key',
    averageRating: 4.9,
    priceRange: '$',
    openingHours: defaultHours,
    isActive: true,
    typicalTimeSpent: '2–3 hours',
    vibe: ['Heritage Walk', 'Spiritual & Temples'],
    specialFacilities: ['Museum access'],
    contactNumber: null,
    socialMedia: {}
  },

  {
    placeId: 'plc_014',
    placeName: 'Newari Food Experience',
    promotions: [],
    image: 'https://example.com/newari.jpg',
    location: { area: 'Lalitpur', lat: 27.6735, lng: 85.3245 },
    mapsLinkKey: 'newari_key',
    averageRating: 4.7,
    priceRange: '$$',
    openingHours: defaultHours,
    isActive: true,
    typicalTimeSpent: '2 hours',
    vibe: ['Local Food Hunt'],
    specialFacilities: ['Traditional cuisine'],
    contactNumber: null,
    socialMedia: {}
  }
];
