import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-5">
        <BaseCard className="p-5 shadow-lg">
          <AppText className="mb-2 text-center text-3xl" variant="title">
            Welcome Back
          </AppText>
          <AppText className="mb-8 text-center" variant="muted">
            Login to continue
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
