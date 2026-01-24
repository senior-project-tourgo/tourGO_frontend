export const tripPreferencesMock = [
  {
    preferenceId: 'pref_001',
    userId: 'usr_001',
    transportation: ['BTS', 'Walk'],
    mood: ['chill', 'coffee-hop'],
    budget: 'medium',
    startTime: '2025-01-18T09:30:00.000Z',
    endTime: '2025-01-18T18:00:00.000Z',
    startLocation: {
      area: 'Ari',
      city: 'Bangkok'
    },
    totalTimeHours: 8.5,
    numberOfTravelers: 2,
    foodChoice: ['cafe', 'local'],
    specialPreferences: {
      petFriendly: true,
      avoidCrowdedPlaces: true
    },
    createdAt: '2025-01-15T10:12:00.000Z'
  },

  {
    preferenceId: 'pref_002',
    userId: 'usr_001',
    transportation: ['Taxi'],
    mood: ['nightlife', 'romantic'],
    budget: 'high',
    startTime: '2025-01-05T19:00:00.000Z',
    endTime: '2025-01-06T01:00:00.000Z',
    startLocation: {
      area: 'Thonglor',
      city: 'Bangkok'
    },
    totalTimeHours: 6,
    numberOfTravelers: 2,
    foodChoice: ['bar', 'cocktail'],
    specialPreferences: {
      rooftopOnly: true
    },
    createdAt: '2025-01-03T16:35:00.000Z'
  },

  {
    preferenceId: 'pref_003',
    userId: 'usr_001',
    transportation: ['Walk'],
    mood: ['slow', 'relax'],
    budget: 'low',
    startTime: '2025-01-22T10:00:00.000Z',
    endTime: '2025-01-22T15:00:00.000Z',
    startLocation: {
      area: 'Ari',
      city: 'Bangkok'
    },
    totalTimeHours: 5,
    numberOfTravelers: 1,
    foodChoice: ['cafe'],
    specialPreferences: {
      quietPlacesOnly: true
    },
    createdAt: '2025-01-21T08:45:00.000Z'
  }
];
