import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

/**
 * Login Screen Component
 * Allows users to login with email/phone and password
 */
const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();

  // Form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle login form submission
   */
  const handleLogin = async () => {
    if (!identifier.trim()) {
      Alert.alert('Error', 'Please enter your email or phone number');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      await login(identifier.trim(), password);
      Alert.alert('Success', 'Logged in successfully!');
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
      <View className="items-center pt-40">
        <Image
          source={require('@/assets/images/icon.png')}
          className="h-64 w-64"
          resizeMode="contain"
        />
      </View>
      <View className="w-full flex-grow justify-end">
        <BaseCard className="rounded-t-[40px] px-8 py-16">
          <AppText className="mb-2 text-3xl" variant="title">
            Login
          </AppText>
          <AppText className="mb-8" variant="muted">
            Welcome back!
          </AppText>

          {/* Email or Phone Input */}
          <AppTextInput
            placeholder="Email or Phone Number"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />

          {/* Password Input */}
          <AppTextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          {/* Login Button */}
          <Button title="Login" onPress={handleLogin} isLoading={isLoading} />

          {/* Register Link */}
          <TouchableOpacity
            className="items-center py-2"
            onPress={() => router.push('/(auth)/register')}
            disabled={isLoading}
          >
            <AppText className=" text-gray-500" variant="muted">
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
};

export default LoginScreen;
