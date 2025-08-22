// screens/LoginScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { sendOtpEmail, generateOtp } from '../services/email';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [sentOtp, setSentOtp] = React.useState(null);
  const [isOtpSent, setIsOtpSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    setIsLoading(true);
    const newOtp = generateOtp();
    setSentOtp(newOtp);

    const emailSent = await sendOtpEmail(email, newOtp);
    setIsLoading(false);

    if (emailSent) {
      setIsOtpSent(true);
      Alert.alert('OTP Sent', `An OTP has been sent to ${email}.`);
    } else {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp === sentOtp) {
      try {
        // Create a simple user object
        const userData = { name: 'Valued User', email: email.toLowerCase() };
        await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
        navigation.replace('MainApp');
      } catch (e) {
        Alert.alert('Error', 'Failed to save user data.');
      }
    } else {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons name="eco" size={60} color="#4CAF50" style={styles.logo} />
        <Text style={styles.title}>{isOtpSent ? 'Enter OTP' : 'Welcome!'}</Text>
        <Text style={styles.subtitle}>
          {isOtpSent ? `We sent a code to ${email}` : 'Log in to continue with Carbeez'}
        </Text>

        {!isOtpSent ? (
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
        ) : (
          <View style={styles.inputContainer}>
            <MaterialIcons name="dialpad" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="6-Digit OTP"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={isOtpSent ? handleVerifyOtp : handleSendOtp} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Sending...' : isOtpSent ? 'Verify & Login' : 'Send OTP'}</Text>
        </TouchableOpacity>

        {isOtpSent && (
          <TouchableOpacity onPress={() => setIsOtpSent(false)}>
            <Text style={styles.switchText}>
              Entered the wrong email? <Text style={styles.switchLink}>Go Back</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

// ... (Your styles remain the same)
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