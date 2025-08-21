// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    const userData = {
      name,
      email: email.toLowerCase(),
      password, // Note: In a real app, you should hash the password.
    };
    try {
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
      navigation.replace('MainApp');
    } catch (e) {
      Alert.alert('Error', 'Failed to save user data.');
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons name="eco" size={60} color="#4CAF50" style={styles.logo} />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Carbeez to start your journey</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.switchText}>
            Already have an account? <Text style={styles.switchLink}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Use the same styles as LoginScreen for consistency
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 24,
    },
    logo: {
        alignSelf: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontFamily: 'Inter_700Bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 56,
        fontSize: 16,
        color: '#111827',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
    },
    switchText: {
        marginTop: 24,
        textAlign: 'center',
        color: '#6B7280',
        fontSize: 14,
    },
    switchLink: {
        color: '#4CAF50',
        fontFamily: 'Inter_600SemiBold',
    },
});

export default RegisterScreen;