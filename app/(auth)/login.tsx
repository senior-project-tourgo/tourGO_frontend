import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View
} from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { BaseCard } from '@/components/cards/BaseCard';
import { AppTextInput } from '@/components/AppTextInput';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const isIdentifierInvalid = submitted && !identifier.trim();
  const isPasswordInvalid = submitted && !password;

  const handleLogin = async () => {
    setSubmitted(true);
    if (!identifier.trim() || !password) return;

    setIsLoading(true);
    try {
      await login(identifier.trim(), password);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-colors-brand-secondary"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 justify-end">
        {/* Logo — hidden when keyboard is open so the card stays visible */}
        {!keyboardVisible && (
          <View className="items-center pb-16 pt-8">
            <Image
              source={require('@/assets/images/icon.png')}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          </View>
        )}

        <BaseCard className="rounded-t-[40px] px-8 py-12">
          <AppText className="mb-2 text-3xl" variant="title">
            Login
          </AppText>

          <AppText className="mb-8" variant="muted">
            Welcome back!
          </AppText>

          <View className="gap-5">
            <AppTextInput
              label="Email or Phone"
              placeholder="Enter your email or phone"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
              required
              error={
                isIdentifierInvalid ? 'Email or phone is required' : undefined
              }
            />

            <AppTextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
              required
              error={isPasswordInvalid ? 'Password is required' : undefined}
            />

            <Button title="Login" onPress={handleLogin} isLoading={isLoading} />
          </View>

          <TouchableOpacity
            className="items-center py-4"
            onPress={() => router.push('/(auth)/register')}
            disabled={isLoading}
          >
            <AppText className="text-gray-500" variant="muted">
              {"Don't have an account? "}
              <AppText
                className="font-semibold text-colors-text"
                variant="muted"
              >
                Sign Up
              </AppText>
            </AppText>
          </TouchableOpacity>
        </BaseCard>
      </View>
    </KeyboardAvoidingView>
  );
}
