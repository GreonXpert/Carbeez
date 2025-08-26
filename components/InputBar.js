// components/InputBar.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const InputBar = ({ value, onChangeText, onSend, isLoading }) => {
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const handleSendPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onSend();
  };

  const isActive = value.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Main Input Container */}
      <View style={styles.inputContainer}>
        {/* Text Input with Glassmorphic Effect */}
        <View style={[
          styles.textInputWrapper,
          isFocused && styles.textInputWrapperFocused
        ]}>
          <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={onChangeText}
            placeholder="Type your message..."
            placeholderTextColor="#a0b3b8"
            multiline
            maxLength={2000}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>

        {/* Premium Send Button */}
        <Animated.View 
          style={[
            styles.sendButtonContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.sendButton,
              !isActive && styles.sendButtonDisabled
            ]}
            onPress={handleSendPress}
            disabled={isLoading || !isActive}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isActive ? ['#00D1B2', '#00a27a'] : ['#e5e7eb', '#d1d5db']}
              style={styles.sendButtonGradient}
            >
              <MaterialIcons
                name={isLoading ? "hourglass-empty" : "send"}
                size={22}
                color={isActive ? '#ffffff' : '#9ca3af'}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInputWrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 209, 178, 0.1)',
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  textInputWrapperFocused: {
    borderColor: 'rgba(0, 209, 178, 0.3)',
    shadowOpacity: 0.12,
    backgroundColor: '#ffffff',
  },
  textInput: {
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 18,
    paddingVertical: Platform.select({ ios: 14, android: 12 }),
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
    lineHeight: 20,
  },
  sendButtonContainer: {
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
});

export default InputBar;