import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { BaseCard } from '@/components/cards/BaseCard';
import { Button } from '@/components/Button';
import { AppText } from '@/components/AppText';
import { AppTextInput } from '@/components/AppTextInput';

/**
 * Registration Screen Component
 * Allows users to create a new account with email or phone number
 */
const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { register } = useAuth();
  const router = useRouter();

  // Form state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle registration form submission
   */
  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return;
    }

    if (!identifier.trim()) {
      Alert.alert('Error', 'Please enter your email or phone number');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await register(name.trim(), username.trim(), identifier.trim(), password);
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-colors-brand-secondary"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View className="flex-grow justify-end">
        <View className="items-center pt-24">
          <Image
            source={require('@/assets/images/icon.png')}
            className="h-48 w-48"
            resizeMode="contain"
          />
        </View>
        <BaseCard className="w-full rounded-t-[40px] px-8 py-16">
          <AppText className="mb-2" variant="title">
            Create Account
          </AppText>
          <AppText className="mb-8" variant="muted">
            Sign up to continue!
          </AppText>

          {/* Name Input */}
          <AppTextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!isLoading}
          />

          {/* Username Input */}
          <AppTextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!isLoading}
          />

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

          {/* Confirm Password Input */}
          <AppTextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!isLoading}
          />

          {/* Register Button */}
          <Button
            title="Register"
            onPress={handleRegister}
            isLoading={isLoading}
          />

          {/* Login Link */}
          <TouchableOpacity
            className="items-center py-2"
            onPress={() => router.replace('/(auth)/login')}
            disabled={isLoading}
          >
            <AppText className="text-sm text-gray-500">
              Already have an account?{' '}
              <AppText className="font-semibold text-colors-brand-primary">
                Login
              </AppText>
            </AppText>
          </TouchableOpacity>
        </BaseCard>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
