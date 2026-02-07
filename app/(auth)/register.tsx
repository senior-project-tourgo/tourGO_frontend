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
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-5">
        <BaseCard className="p-5 shadow-lg">
          <Text className="mb-2 text-center text-3xl font-bold text-colors-text">
            Create Account
          </Text>
          <Text className="mb-8 text-center text-base text-gray-500">
            Sign up to get started
          </Text>

          {/* Name Input */}
          <TextInput
            className="mb-4 rounded-lg border border-gray-300 bg-gray-50 px-4 py-4 text-base text-colors-text"
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!isLoading}
          />

          {/* Username Input */}
          <TextInput
            className="mb-4 rounded-lg border border-gray-300 bg-gray-50 px-4 py-4 text-base text-colors-text"
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!isLoading}
          />

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

          {/* Confirm Password Input */}
          <TextInput
            className="mb-4 rounded-lg border border-gray-300 bg-gray-50 px-4 py-4 text-base text-colors-text"
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!isLoading}
          />

          {/* Register Button */}
          <TouchableOpacity
            className={`mb-4 mt-2 items-center rounded-lg py-4 ${
              isLoading ? 'bg-colors-surface-muted' : 'bg-colors-brand-primary'
            }`}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-lg font-semibold text-white">Register</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity
            className="items-center py-2"
            onPress={() => router.replace('/(auth)/login')}
            disabled={isLoading}
          >
            <Text className="text-sm text-gray-500">
              Already have an account?{' '}
              <Text className="font-semibold text-colors-brand-primary">
                Login
              </Text>
            </Text>
          </TouchableOpacity>
        </BaseCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
