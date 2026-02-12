import { useRouter } from 'expo-router';
import { useState } from 'react';
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

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isNameInvalid = submitted && !name.trim();
  const isUsernameInvalid =
    submitted && (!username.trim() || username.length < 3);
  const isIdentifierInvalid = submitted && !identifier.trim();
  const isPasswordInvalid = submitted && (!password || password.length < 6);
  const isConfirmPasswordInvalid = submitted && password !== confirmPassword;

  const handleRegister = async () => {
    setSubmitted(true);

    if (
      !name.trim() ||
      !username.trim() ||
      username.length < 3 ||
      !identifier.trim() ||
      !password ||
      password.length < 6 ||
      password !== confirmPassword
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await register(name.trim(), username.trim(), identifier.trim(), password);

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
    >
      <View className="flex-grow justify-end">
        <BaseCard className="w-full rounded-t-[40px] px-8 py-16">
          <AppText className="mb-2" variant="title">
            Create Account
          </AppText>

          <AppText className="mb-8" variant="muted">
            Sign up to continue!
          </AppText>

          <View className="gap-5">
            <AppTextInput
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!isLoading}
              required
              error={isNameInvalid ? 'Full name is required' : undefined}
            />

            <AppTextInput
              label="Username"
              placeholder="Enter a username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!isLoading}
              required
              error={
                isUsernameInvalid
                  ? username.length < 3 && username.length > 0
                    ? 'Username must be at least 3 characters'
                    : 'Username is required'
                  : undefined
              }
            />

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
              placeholder="Enter a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
              required
              error={
                isPasswordInvalid
                  ? password.length < 6 && password.length > 0
                    ? 'Password must be at least 6 characters'
                    : 'Password is required'
                  : undefined
              }
            />

            <AppTextInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoading}
              required
              error={
                isConfirmPasswordInvalid ? 'Passwords do not match' : undefined
              }
            />

            <Button
              title="Register"
              onPress={handleRegister}
              isLoading={isLoading}
            />
          </View>

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
}
