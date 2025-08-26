// components/InputBar.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
  Text,
  Easing,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Animated Audio Wave Component
const AudioWave = () => {
  const waveAnimations = useRef([...Array(5)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const createWaveAnimation = (animValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 800 + Math.random() * 400,
            delay,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: false,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 800 + Math.random() * 400,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: false,
          }),
        ])
      );
    };

    const animations = waveAnimations.map((anim, index) =>
      createWaveAnimation(anim, index * 100)
    );

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, [waveAnimations]);

  return (
    <View style={styles.audioWaveContainer}>
      {waveAnimations.map((anim, index) => {
        const height = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [4, 20],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.waveBar,
              {
                height,
                backgroundColor: index % 2 === 0 ? '#ff4444' : '#ff6666',
              }
            ]}
          />
        );
      })}
    </View>
  );
};

const InputBar = ({
  value,
  onChangeText,
  onSend,
  isLoading,
  onStartRecording,
  onStopRecording,
  isRecording,
  selectedLanguage = 'en',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const scaleAnim = new Animated.Value(1);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);

  // Recording timer logic
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      intervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Pulse animation for recording button
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
      };
    } else {
      clearInterval(intervalRef.current);
      setRecordingSeconds(0);
      pulseAnim.setValue(1);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRecording, pulseAnim]);

  const handleSendPress = () => {
    if (!isRecording && value.trim().length > 0 && !isLoading) {
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
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const isActive = value.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Recording Info Overlay */}
      {isRecording && (
        <View style={styles.recordingOverlay}>
          <LinearGradient
            colors={['rgba(255, 68, 68, 0.95)', 'rgba(255, 102, 102, 0.9)']}
            style={styles.recordingGradient}
          >
            <View style={styles.recordingContent}>
              <AudioWave />
              <View style={styles.recordingInfo}>
                <MaterialIcons name="fiber-manual-record" size={12} color="#ffffff" />
                <Text style={styles.recordingText}>Recording</Text>
                <Text style={styles.recordingTime}>{formatTime(recordingSeconds)}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Main Input Container */}
      <View style={styles.inputContainer}>
        {/* Text Input with Glassmorphic Effect */}
        <View style={[
          styles.textInputWrapper,
          isFocused && styles.textInputWrapperFocused,
          isRecording && styles.textInputWrapperRecording
        ]}>
          <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={isRecording ? "Listening..." : "Type your message..."}
            placeholderTextColor={isRecording ? "#ff9999" : "#a0b3b8"}
            multiline
            maxLength={2000}
            editable={!isRecording}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {/* Send Button */}
          <Animated.View 
            style={[
              styles.sendButtonContainer,
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!isActive || isRecording) && styles.sendButtonDisabled
              ]}
              onPress={handleSendPress}
              disabled={isLoading || !isActive || isRecording}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isActive && !isRecording ? ['#00D1B2', '#00a27a'] : ['#e5e7eb', '#d1d5db']}
                style={styles.sendButtonGradient}
              >
                <MaterialIcons
                  name={isLoading ? "hourglass-empty" : "send"}
                  size={20}
                  color={isActive && !isRecording ? '#ffffff' : '#9ca3af'}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Recording Button */}
          <Animated.View
            style={[
              styles.recordButtonContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive
              ]}
              onPressIn={onStartRecording}
              onPressOut={onStopRecording}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isRecording ? ['#ff4444', '#ff6666'] : ['#00D1B2', '#00a27a']}
                style={styles.recordButtonGradient}
              >
                <MaterialIcons
                  name={isRecording ? "stop" : "mic"}
                  size={22}
                  color="#ffffff"
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  recordingOverlay: {
    position: 'absolute',
    top: -60,
    left: 16,
    right: 16,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordingGradient: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  recordingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    marginRight: 12,
  },
  recordingTime: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  audioWaveContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 20,
  },
  waveBar: {
    width: 3,
    borderRadius: 1.5,
    marginHorizontal: 1,
    minHeight: 4,
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
  textInputWrapperRecording: {
    borderColor: 'rgba(255, 68, 68, 0.3)',
    backgroundColor: 'rgba(255, 245, 245, 0.8)',
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sendButtonContainer: {
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  recordButtonContainer: {
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  recordButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  recordButtonActive: {
    shadowColor: '#ff4444',
    shadowOpacity: 0.3,
  },
  recordButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
});

export default InputBar;
