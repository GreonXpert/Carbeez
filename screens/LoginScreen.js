// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    try {
      const userDataString = await AsyncStorage.getItem('@user_data');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData.email === email.toLowerCase() && userData.password === password) {
          navigation.replace('MainApp');
        } else {
          Alert.alert('Error', 'Invalid email or password.');
        }
      } else {
        Alert.alert('Error', 'No account found. Please register.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to log in.');
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons name="eco" size={60} color="#4CAF50" style={styles.logo} />
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Log in to continue with Carbeez</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.switchText}>
            Don't have an account? <Text style={styles.switchLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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

export default LoginScreen;