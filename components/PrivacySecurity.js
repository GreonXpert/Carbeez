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
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

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
        color={met ? "#10B981" : "#D1D5DB"} 
      />
      <Text style={[styles.requirementText, { color: met ? "#10B981" : "#6B7280" }]}>
        {text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* Current Password Display Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="lock" size={24} color="#4CAF50" />
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
                <MaterialIcons 
                  name={showStoredPassword ? 'visibility-off' : 'visibility'} 
                  size={24} 
                  color="#6B7280" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Change Password Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="security" size={24} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Change Password</Text>
            </View>

            {/* Current Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <View style={[styles.inputContainer, currentPassword && styles.inputFocused]}>
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
                  <MaterialIcons 
                    name={showCurrentPassword ? 'visibility-off' : 'visibility'} 
                    size={24} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={[styles.inputContainer, newPassword && styles.inputFocused]}>
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
                  <MaterialIcons 
                    name={showNewPassword ? 'visibility-off' : 'visibility'} 
                    size={24} 
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
                  <MaterialIcons 
                    name={showConfirmPassword ? 'visibility-off' : 'visibility'} 
                    size={24} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Password Match Indicator */}
              {confirmPassword.length > 0 && (
                <View style={styles.matchIndicator}>
                  <MaterialIcons 
                    name={newPassword === confirmPassword ? "check-circle" : "cancel"} 
                    size={16} 
                    color={newPassword === confirmPassword ? "#10B981" : "#EF4444"} 
                  />
                  <Text style={[
                    styles.matchText, 
                    { color: newPassword === confirmPassword ? "#10B981" : "#EF4444" }
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
            <Text style={styles.buttonText}>
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </Text>
            {!isLoading && (
              <MaterialIcons name="security" size={20} color="white" style={styles.buttonIcon} />
            )}
          </TouchableOpacity>

          {/* Security Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Security Tips</Text>
            <View style={styles.tipItem}>
              <MaterialIcons name="lightbulb" size={16} color="#F59E0B" />
              <Text style={styles.tipText}>Use a unique password you don't use elsewhere</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="lightbulb" size={16} color="#F59E0B" />
              <Text style={styles.tipText}>Consider using a password manager</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="lightbulb" size={16} color="#F59E0B" />
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginLeft: 12,
  },
  passwordDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    height: 56,
  },
  passwordText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#111827',
    letterSpacing: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E5E7EB',
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    minHeight: 56,
  },
  inputFocused: {
    borderColor: '#4CAF50',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#111827',
  },
  eyeIcon: {
    padding: 16,
  },
  strengthContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  strengthTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
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
    fontFamily: 'Inter_400Regular',
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  matchText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  button: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  tipsContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#92400E',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#92400E',
    flex: 1,
    lineHeight: 18,
  },
});

export default PrivacySecurity;
