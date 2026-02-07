import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { BaseCard } from '@/components/cards/BaseCard';

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
          <Text className="mb-2 text-center text-3xl font-bold text-colors-text">
            Welcome Back
          </Text>
          <Text className="mb-8 text-center text-base text-gray-500">
            Login to continue
          </Text>

          {/* Email or Phone Input */}
          <TextInput
            className="mb-4 rounded-lg border border-gray-300 bg-gray-50 px-4 py-4 text-base text-colors-text"
            placeholder="Email or Phone Number"
            placeholderTextColor="#999"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />

          {/* Password Input */}
          <TextInput
            className="mb-4 rounded-lg border border-gray-300 bg-gray-50 px-4 py-4 text-base text-colors-text"
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          {/* Login Button */}
          <TouchableOpacity
            className={`mb-4 mt-2 items-center rounded-lg py-4 ${
              isLoading ? 'bg-colors-surface-muted' : 'bg-colors-brand-primary'
            }`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-lg font-semibold text-colors-text-inverse">
                Login
              </Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity
            className="items-center py-2"
            onPress={() => router.push('/(auth)/register')}
            disabled={isLoading}
          >
            <Text className="text-sm text-gray-500">
              {"Don't have an account? "}
              <Text className="font-semibold text-colors-text">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </BaseCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
