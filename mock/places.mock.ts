import type { Place } from '@/features/place/place.types';

export const placesMock: Place[] = [
  {
    placeId: 'plc_001',
    placeName: 'Hidden Yard Café',
    promotions: ['promo_101', 'promo_104'],
    image:
      'https://ignitetravelsolution.com/wp-content/uploads/2024/09/Tourist-Attractions-in-Kathmandu-Nepal-.jpg',
    location: {
      area: 'Ari',
      city: 'Bangkok',
      lat: 13.7798,
      lng: 100.5449
    },
    mapsLinkKey: 'ChIJ_hidden_yard_key',
    averageRating: 3.7,
    priceRange: '$$',
    openingHours: {
      monday: [{ open: '09:00', close: '18:00' }],
      tuesday: [{ open: '09:00', close: '18:00' }],
      wednesday: [{ open: '09:00', close: '18:00' }],
      thursday: [{ open: '09:00', close: '20:00' }],
      friday: [
        { open: '09:00', close: '14:00' },
        { open: '17:00', close: '22:00' }
      ],
      saturday: [{ open: '10:00', close: '22:00' }],
      sunday: [] // closed
    },
    isActive: true,
    typicalTimeSpent: '1–2 hours',
    vibe: ['Heritage Walk', 'quiet', 'work-friendly'],
    specialFacilities: ['Free Wi-Fi', 'Power outlets', 'Pet-friendly'],
    contactNumber: '+66 81 234 5678',
    socialMedia: {
      instagram: {
        handle: '@hiddenyard.bkk',
        likes: 12400
      },
      tiktok: {
        handle: '@hiddenyardcafe',
        likes: 45800
      },
      facebook: {
        page: 'Hidden Yard Café',
        likes: 9800
      },
      whatsapp: null
    }
  },

  {
    placeId: 'plc_002',
    placeName: 'Night Owl Rooftop Bar',
    promotions: ['promo_102', 'promo_103'],
    image:
      'https://storage.googleapis.com/stateless-www-justwravel-com/2024/09/9e074796-swayambhunath-temple-in-kathmandu-nepal.jpg',
    location: {
      area: 'Thonglor',
      city: 'Bangkok',
      lat: 13.7246,
      lng: 100.5804
    },
    mapsLinkKey: 'ChIJ_night_owl_key',
    averageRating: 4.4,
    priceRange: '$$$',
    openingHours: {
      monday: [{ open: '09:00', close: '18:00' }],
      tuesday: [{ open: '09:00', close: '18:00' }],
      wednesday: [{ open: '09:00', close: '18:00' }],
      thursday: [{ open: '09:00', close: '20:00' }],
      friday: [
        { open: '09:00', close: '14:00' },
        { open: '17:00', close: '22:00' }
      ],
      saturday: [{ open: '10:00', close: '22:00' }],
      sunday: [] // closed
    },
    isActive: true,
    typicalTimeSpent: '2–3 hours',
    vibe: ['luxury', 'romantic', 'nightlife'],
    specialFacilities: ['Rooftop seating', 'Live DJ', 'City view'],
    contactNumber: '+66 92 888 1122',
    socialMedia: {
      instagram: {
        handle: '@nightowl.bkk',
        likes: 54200
      },
      tiktok: {
        handle: '@nightowlrooftop',
        likes: 78100
      },
      facebook: {
        page: 'Night Owl Rooftop Bar',
        likes: 33400
      },
      whatsapp: null
    }
  },

  {
    placeId: 'plc_003',
    placeName: 'Local Legend Noodles',
    promotions: [],
    image:
      'https://www.himalayanglacier.com/wp-content/uploads/2021/06/Patan-Durbar-Square.jpg',
    location: {
      area: 'Chinatown',
      city: 'Bangkok',
      lat: 13.7372,
      lng: 100.5131
    },
    mapsLinkKey: 'ChIJ_local_legend_key',
    averageRating: 4.9,
    priceRange: '$',
    openingHours: {
      monday: [{ open: '09:00', close: '18:00' }],
      tuesday: [{ open: '09:00', close: '18:00' }],
      wednesday: [{ open: '09:00', close: '18:00' }],
      thursday: [{ open: '09:00', close: '20:00' }],
      friday: [
        { open: '09:00', close: '14:00' },
        { open: '17:00', close: '22:00' }
      ],
      saturday: [{ open: '10:00', close: '22:00' }],
      sunday: [] // closed
    },
    isActive: false,
    typicalTimeSpent: '30–45 minutes',
    vibe: ['local', 'casual', 'street-food'],
    specialFacilities: ['Takeaway'],
    contactNumber: '+66 89 555 4433',
    socialMedia: {
      instagram: null,
      tiktok: {
        handle: '@locallegendnoodle',
        likes: 15200
      },
      facebook: {
        page: 'Local Legend Noodles',
        likes: 21000
      },
      whatsapp: null
    }
  },
  {
    placeId: 'plc_004',
    placeName: 'Moonlight Brew',
    promotions: ['promo_102'],
    image:
      'https://wanderlusters.com/wp-content/uploads/2016/10/Sharada-Prasad-CS-CC-Flickr.jpg',
    location: {
      area: 'Bangna',
      city: 'Bangkok',
      lat: 13.7304,
      lng: 100.5696
    },
    mapsLinkKey: 'ChIJ_moonlight_brew_key',
    averageRating: 4.1,
    priceRange: '$',
    openingHours: {
      monday: [{ open: '09:00', close: '18:00' }],
      tuesday: [{ open: '09:00', close: '18:00' }],
      wednesday: [{ open: '09:00', close: '18:00' }],
      thursday: [{ open: '09:00', close: '20:00' }],
      friday: [
        { open: '09:00', close: '14:00' },
        { open: '17:00', close: '22:00' }
      ],
      saturday: [{ open: '10:00', close: '22:00' }],
      sunday: [] // closed
    },
    isActive: true,
    typicalTimeSpent: '2–3 hours',
    vibe: ['chill', 'modern', 'night-friendly'],
    specialFacilities: [
      'Craft coffee',
      'Outdoor seating',
      'Live DJ (weekends)'
    ],
    contactNumber: '+66 92 567 8910',
    socialMedia: {
      instagram: {
        handle: '@moonlightbrew.bkk',
        likes: 18900
      },
      tiktok: {
        handle: '@moonlightbrew',
        likes: 62300
      },
      facebook: {
        page: 'Moonlight Brew',
        likes: 14200
      },
      whatsapp: null
    }
  },
  {
    placeId: 'plc_005',
    placeName: 'Canopy Corner',
    promotions: ['promo_103', 'promo_105'],
    image: 'https://www.holidify.com/images/bgImages/POKHARA.jpg',
    location: {
      area: 'Sathorn',
      city: 'Bangkok',
      lat: 13.7212,
      lng: 100.5298
    },
    mapsLinkKey: 'ChIJ_canopy_corner_key',
    averageRating: 3.9,
    priceRange: '$$',
    openingHours: {
      monday: [{ open: '09:00', close: '18:00' }],
      tuesday: [{ open: '09:00', close: '18:00' }],
      wednesday: [{ open: '09:00', close: '18:00' }],
      thursday: [{ open: '09:00', close: '20:00' }],
      friday: [
        { open: '09:00', close: '14:00' },
        { open: '17:00', close: '22:00' }
      ],
      saturday: [{ open: '10:00', close: '22:00' }],
      sunday: [] // closed
    },
    isActive: true,
    typicalTimeSpent: '1–2 hours',
    vibe: ['green', 'calm', 'work-friendly'],
    specialFacilities: ['Indoor plants', 'Quiet zones', 'Specialty tea'],
    contactNumber: '+66 88 345 9021',
    socialMedia: {
      instagram: {
        handle: '@canopycorner.bkk',
        likes: 9400
      },
      tiktok: {
        handle: '@canopycorner',
        likes: 21700
      },
      facebook: {
        page: 'Canopy Corner',
        likes: 7600
      },
      whatsapp: null
    }
  }
];
