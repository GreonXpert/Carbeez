import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { sendOtpEmail, generateOtp } from '../services/email';

const OtpCircle = ({ show }) => (
  <Animated.View style={[styles.otpCircle, show ? { backgroundColor: '#4CAF50' } : null]}/>
);

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

  // Visual OTP digit feedback (for entered OTP length)
  const digitCircles = Array.from({ length: 6 }, (_, i) => (
    <OtpCircle key={i} show={otp.length > i} />
  ));

  return (
    <LinearGradient colors={['#e0fff4', '#f9fafb']} style={styles.gradientBG}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'center' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.cardContainer}>
            {/* Logo */}
            <View style={styles.logoWrapper}>
              <LinearGradient colors={['#4CAF50', '#00D1B2']} style={styles.logoBG}>
                <MaterialIcons name="eco" size={42} color="#fff" />
              </LinearGradient>
            </View>

            {/* Title & Subtitle */}
            <Text style={styles.title}>
              {isOtpSent ? 'Enter OTP' : 'Sign In'}
            </Text>
            <Text style={styles.subtitle}>
              {isOtpSent
                ? `We sent a code to\n${email}`
                : 'Log in to continue with Carbeez'}
            </Text>

            {/* Input */}
            {!isOtpSent ? (
              <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={22} color="#00D1B2" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#a7b9bb"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="dialpad" size={22} color="#4CAF50" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="6-digit code"
                    placeholderTextColor="#b2bdbc"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                  />
                </View>
                <View style={styles.otpVisualRow}>{digitCircles}</View>
              </>
            )}

            {/* Action Button */}
            <TouchableOpacity
              style={[
                styles.button,
                isOtpSent ? styles.buttonGradient : styles.buttonGradientAlt,
                isLoading && { opacity: 0.7 }
              ]}
              onPress={isOtpSent ? handleVerifyOtp : handleSendOtp}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>
                {isLoading
                  ? (isOtpSent ? 'Verifying...' : 'Sending...')
                  : isOtpSent ? 'Verify & Login' : 'Send OTP'}
              </Text>
            </TouchableOpacity>

            {isOtpSent && (
              <TouchableOpacity onPress={() => { setIsOtpSent(false); setOtp(''); }} style={{marginTop:16}}>
                <Text style={styles.switchText}>
                  <MaterialIcons name="arrow-back-ios" size={14} color="#00D1B2" />
                  <Text style={styles.switchLink}> Change Email</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBG: {
    flex: 1
  },
  cardContainer: {
    marginHorizontal: 22,
    backgroundColor: '#ffffffee',
    borderRadius: 26,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#00D1B2',
    shadowOpacity: 0.10,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 6 },
    elevation: 13,
  },
  logoWrapper: {
    marginBottom: 10,
    marginTop: 6,
  },
  logoBG: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#12a987',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#00a27a',
    textAlign: 'center',
    marginBottom: 26,
    marginTop: 0,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6FDFA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B9F6CA',
    shadowColor: '#eef5ef',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    paddingHorizontal: 14,
    marginBottom: 12,
    width: '100%',
    height: 48
  },
  inputIcon: {
    marginRight: 10,
    opacity: 0.85,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#139178',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  otpVisualRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  otpCircle: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#e6f9ee',
    marginHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#4CAF50',
  },
  button: {
    marginTop: 16,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonGradient: {
    backgroundColor: '#4CAF50',
  },
  buttonGradientAlt: {
    backgroundColor: '#00D1B2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  switchText: {
    textAlign: 'center',
    color: '#00D1B2',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 1,
  },
  switchLink: {
    color: '#12a987',
    fontWeight: '800',
  },
});

export default LoginScreen;
