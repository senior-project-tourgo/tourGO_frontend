import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

/**
 * Login Screen Component
 * Allows users to login with email/phone and password
 */
const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { login } = useAuth();
    const router = useRouter();

    // Form state
    const [identifier, setIdentifier] = useState(''); // Email or phone
    const [password, setPassword] = useState('');

    // UI state
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handle login form submission
     */
    const handleLogin = async () => {
        // Validation
        if (!identifier.trim()) {
            Alert.alert('Error', 'Please enter your email or phone number');
            return;
        }

        if (!password) {
            Alert.alert('Error', 'Please enter your password');
            return;
        }

        // Attempt login
        setIsLoading(true);
        try {
            await login(identifier.trim(), password);

            Alert.alert('Success', 'Logged in successfully!');
            // Navigation will be handled by AuthContext state change
            router.replace('/(tabs)/home');
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Login to continue</Text>

                    {/* Email or Phone Input */}
                    <TextInput
                        style={styles.input}
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
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!isLoading}
                    />

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    {/* Register Link */}
                    <TouchableOpacity
                        style={styles.linkContainer}
                        onPress={() => router.push('/(auth)/register')}
                        disabled={isLoading}
                    >
                        <Text style={styles.linkText}>
                            {"Don't have an account?"} <Text style={styles.linkBold}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

/**
 * Stylesheet for LoginScreen
 * Matches the design of RegisterScreen
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        marginBottom: 15,
        color: '#333',
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
    buttonDisabled: {
        backgroundColor: '#99c5ff',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    linkContainer: {
        alignItems: 'center',
        padding: 10,
    },
    linkText: {
        color: '#666',
        fontSize: 14,
    },
    linkBold: {
        color: '#007AFF',
        fontWeight: '600',
    },
});

export default LoginScreen;
