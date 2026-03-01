import { getUser } from '@/utils/storage';

async function authHeaders() {
  const user = await getUser();
  const token = user?.token; // wherever you stored JWT

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

export async function generateRecommendation(payload: any) {
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/recommend`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error('Recommendation failed');
  return res.json();
}

export async function createTrip(payload: any) {
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/trips`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error('Trip creation failed');
  return res.json();
}
