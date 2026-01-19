export const placesMock = [
  {
    placeId: 'plc_001',
    placeName: 'Hidden Yard Café',
    promotions: ['promo_101', 'promo_104'],
    image: 'https://images.example.com/hidden-yard.jpg',
    location: {
      area: 'Ari',
      city: 'Bangkok',
      lat: 13.7798,
      lng: 100.5449
    },
    mapsLinkKey: 'ChIJ_hidden_yard_key',
    averageRatingKey: 'rating_hidden_yard',
    priceRange: '$$',
    openingHours: '09:00 - 20:00',
    isActive: true,
    typicalTimeSpent: '1–2 hours',
    vibe: ['cozy', 'quiet', 'work-friendly'],
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
    promotions: ['promo_102'],
    image: 'https://images.example.com/night-owl.jpg',
    location: {
      area: 'Thonglor',
      city: 'Bangkok',
      lat: 13.7246,
      lng: 100.5804
    },
    mapsLinkKey: 'ChIJ_night_owl_key',
    averageRatingKey: 'rating_night_owl',
    priceRange: '$$$',
    openingHours: '18:00 - 02:00',
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
      whatsapp: {
        number: '+66 92 888 1122'
      }
    }
  },

  {
    placeId: 'plc_003',
    placeName: 'Local Legend Noodles',
    promotions: [],
    image: 'https://images.example.com/local-legend.jpg',
    location: {
      area: 'Chinatown',
      city: 'Bangkok',
      lat: 13.7372,
      lng: 100.5131
    },
    mapsLinkKey: 'ChIJ_local_legend_key',
    averageRatingKey: 'rating_local_legend',
    priceRange: '$',
    openingHours: '10:00 - 22:00',
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
  }
];
