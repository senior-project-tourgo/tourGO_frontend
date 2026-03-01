import { AppText } from '@/components/AppText';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function LogoutScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        router.replace('/(auth)/login');
      } catch {
        router.replace('/(auth)/login');
      }
    };

    performLogout();
  }, [logout, router]);

  return (
    <View className="flex-1 items-center justify-center bg-colors-surface-background">
      <ActivityIndicator size="large" />
      <AppText className="mt-4 text-base">Logging out...</AppText>
    </View>
  );
}
