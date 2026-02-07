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
 * Registration Screen Component
 * Allows users to create a new account with email or phone number
 */
const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { register } = useAuth();
    const router = useRouter();

    // Form state
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [identifier, setIdentifier] = useState(''); // Email or phone
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI state
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handle registration form submission
     */
    const handleRegister = async () => {
        // Validation
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

        // Attempt registration
        setIsLoading(true);
        try {
            await register(name.trim(), username.trim(), identifier.trim(), password);

            Alert.alert('Success', 'Account created successfully!');
            // Navigation will be handled by AuthContext state change
            router.replace('/(auth)/login');
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message);
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
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>

                    {/* Name Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#999"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        editable={!isLoading}
                    />

                    {/* Username Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#999"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        editable={!isLoading}
                    />

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

                    {/* Confirm Password Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#999"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        editable={!isLoading}
                    />

                    {/* Register Button */}
                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Register</Text>
                        )}
                    </TouchableOpacity>

                    {/* Login Link */}
                    <TouchableOpacity
                        style={styles.linkContainer}
                        onPress={() => router.replace('/(auth)/login')}
                        disabled={isLoading}
                    >
                        <Text style={styles.linkText}>
                            Already have an account? <Text style={styles.linkBold}>Login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

/**
 * Stylesheet for RegisterScreen
 * Clean and modern design with good spacing
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

export default RegisterScreen;
