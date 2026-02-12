import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import { BaseCard } from '@/components/cards/BaseCard';
import { AppTextInput } from '@/components/AppTextInput';
import { useAuth } from '../../context/AuthContext';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isIdentifierInvalid = submitted && !identifier.trim();
  const isPasswordInvalid = submitted && !password;

  const handleLogin = async () => {
    setSubmitted(true);

    if (!identifier.trim() || !password) {
      return;
    }

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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="w-full flex-grow justify-end">
        <View className="items-center pb-20">
          <Image
            source={require('@/assets/images/icon.png')}
            className="h-64 w-64"
            resizeMode="contain"
          />
        </View>

        <BaseCard className="rounded-t-[40px] px-8 py-16">
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
            className="items-center py-2"
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
