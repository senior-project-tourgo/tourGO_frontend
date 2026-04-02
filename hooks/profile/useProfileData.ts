import { useEffect, useState } from 'react';
import {
  getStampCard,
  getUserProfile,
  type StampEntry,
  type UserProfile
} from '@/services/user.service';

export function useProfileData() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stamps, setStamps] = useState<StampEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUserProfile(), getStampCard().catch(() => [])])
      .then(([p, s]) => {
        setProfile(p);
        setStamps(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { profile, stamps, loading };
}
