// components/PrivacySecurity.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const PrivacySecurity = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showStoredPassword, setShowStoredPassword] = useState(false);
  const [storedPassword, setStoredPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPassword = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('@user_data');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setStoredPassword(userData.password || '');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load user data');
      }
    };
    fetchPassword();
  }, []);

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(newPassword);

  const handleChangePassword = async () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password.');
      return;
    }

    if (currentPassword !== storedPassword) {
      Alert.alert('Error', 'The current password you entered is incorrect.');
      return;
    }

    if (!passwordValidation.isValid) {
      Alert.alert('Error', 'Please ensure your new password meets all requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert('Error', 'New password must be different from current password.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userDataString = await AsyncStorage.getItem('@user_data');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        userData.password = newPassword;
        await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
        
        Alert.alert(
          'Success', 
          'Your password has been changed successfully.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setStoredPassword(newPassword); // Update stored password display
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordStrengthIndicator = ({ validation }) => (
    <View style={styles.strengthContainer}>
      <Text style={styles.strengthTitle}>Password Requirements:</Text>
      <View style={styles.requirementsList}>
        <RequirementItem 
          met={validation.minLength} 
          text="At least 8 characters" 
        />
        <RequirementItem 
          met={validation.hasUpperCase} 
          text="One uppercase letter" 
        />
        <RequirementItem 
          met={validation.hasLowerCase} 
          text="One lowercase letter" 
        />
        <RequirementItem 
          met={validation.hasNumbers} 
          text="One number" 
        />
        <RequirementItem 
          met={validation.hasSpecialChar} 
          text="One special character" 
        />
      </View>
    </View>
  );

  const RequirementItem = ({ met, text }) => (
    <View style={styles.requirementItem}>
      <MaterialIcons 
        name={met ? "check-circle" : "radio-button-unchecked"} 
        size={16} 
        color={met ? "#00D1B2" : "#D1D5DB"} 
      />
      <Text style={[styles.requirementText, { color: met ? "#00D1B2" : "#6B7280" }]}>
        {text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header with Gradient Background */}
      <LinearGradient
        colors={['#00D1B2', '#00a27a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy & Security</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* Current Password Display Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#00D1B2' }]}>
                <Feather name="lock" size={20} color="#ffffff" />
              </View>
              <Text style={styles.sectionTitle}>Current Password</Text>
            </View>
            
            <View style={styles.passwordDisplayContainer}>
              <Text style={styles.passwordText}>
                {showStoredPassword ? storedPassword : '••••••••••••'}
              </Text>
              <TouchableOpacity 
                onPress={() => setShowStoredPassword(!showStoredPassword)} 
                style={styles.eyeIcon}
              >
                <Feather 
                  name={showStoredPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color="#6B7280" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Change Password Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#00a27a' }]}>
                <Feather name="shield" size={20} color="#ffffff" />
              </View>
              <Text style={styles.sectionTitle}>Change Password</Text>
            </View>

            {/* Current Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <View style={[styles.inputContainer, currentPassword && styles.inputFocused]}>
                <View style={styles.inputIconContainer}>
                  <Feather name="lock" size={20} color="#00D1B2" />
                </View>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity 
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)} 
                  style={styles.eyeIcon}
                >
                  <Feather 
                    name={showCurrentPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={[styles.inputContainer, newPassword && styles.inputFocused]}>
                <View style={styles.inputIconContainer}>
                  <Feather name="key" size={20} color="#00D1B2" />
                </View>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity 
                  onPress={() => setShowNewPassword(!showNewPassword)} 
                  style={styles.eyeIcon}
                >
                  <Feather 
                    name={showNewPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Password Strength Indicator */}
              {newPassword.length > 0 && (
                <PasswordStrengthIndicator validation={passwordValidation} />
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={[styles.inputContainer, confirmPassword && styles.inputFocused]}>
                <View style={styles.inputIconContainer}>
                  <Feather name="check-circle" size={20} color="#00D1B2" />
                </View>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
                  style={styles.eyeIcon}
                >
                  <Feather 
                    name={showConfirmPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Password Match Indicator */}
              {confirmPassword.length > 0 && (
                <View style={styles.matchIndicator}>
                  <Feather 
                    name={newPassword === confirmPassword ? "check-circle" : "x-circle"} 
                    size={16} 
                    color={newPassword === confirmPassword ? "#00D1B2" : "#EF4444"} 
                  />
                  <Text style={[
                    styles.matchText, 
                    { color: newPassword === confirmPassword ? "#00D1B2" : "#EF4444" }
                  ]}>
                    {newPassword === confirmPassword ? "Passwords match" : "Passwords don't match"}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            style={[
              styles.button, 
              (!passwordValidation.isValid || newPassword !== confirmPassword || isLoading) && styles.buttonDisabled
            ]} 
            onPress={handleChangePassword}
            disabled={!passwordValidation.isValid || newPassword !== confirmPassword || isLoading}
          >
            <LinearGradient
              colors={
                (!passwordValidation.isValid || newPassword !== confirmPassword || isLoading) 
                  ? ['#D1D5DB', '#D1D5DB'] 
                  : ['#00D1B2', '#00a27a']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.buttonText}>Updating Password...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Update Password</Text>
                  <Feather name="shield-check" size={18} color="white" style={styles.buttonIcon} />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Security Tips */}
          <View style={styles.tipsContainer}>
            <View style={styles.tipsHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#F59E0B' }]}>
                <Feather name="shield" size={18} color="#ffffff" />
              </View>
              <Text style={styles.tipsTitle}>Security Tips</Text>
            </View>
            <View style={styles.tipItem}>
              <Feather name="check" size={16} color="#00D1B2" />
              <Text style={styles.tipText}>Use a unique password you don't use elsewhere</Text>
            </View>
            <View style={styles.tipItem}>
              <Feather name="check" size={16} color="#00D1B2" />
              <Text style={styles.tipText}>Consider using a password manager</Text>
            </View>
            <View style={styles.tipItem}>
              <Feather name="check" size={16} color="#00D1B2" />
              <Text style={styles.tipText}>Change your password regularly</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  headerGradient: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 30,
    elevation: 8,
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.6,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.3,
  },
  passwordDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 56,
  },
  passwordText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    letterSpacing: 2,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00D1B2',
    marginBottom: 8,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E5E7EB',
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    minHeight: 56,
  },
  inputFocused: {
    borderColor: '#00D1B2',
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIconContainer: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 16,
  },
  strengthContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontSize: 13,
    fontWeight: '500',
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  matchText: {
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  tipsContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.3,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
    fontWeight: '500',
  },
});

export default PrivacySecurity;
