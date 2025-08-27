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
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  useAudioRecorder, 
  useAudioRecorderState,
  RecordingPresets,
  setAudioModeAsync,
  requestRecordingPermissionsAsync 
} from 'expo-audio';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');

// Enhanced Audio Wave Component
const AudioWave = ({ isActive }) => {
  const waveAnimations = useRef([...Array(10)].map(() => new Animated.Value(0.3))).current;

  useEffect(() => {
    if (isActive) {
      const animations = waveAnimations.map((anim, index) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 0.9 + Math.random() * 0.1,
              duration: 200 + Math.random() * 300,
              delay: index * 50,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: 0.2 + Math.random() * 0.3,
              duration: 200 + Math.random() * 300,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ])
        );
      });

      animations.forEach(anim => anim.start());
      return () => animations.forEach(anim => anim.stop());
    } else {
      waveAnimations.forEach(anim => anim.setValue(0.3));
    }
  }, [isActive]);

  return (
    <View style={styles.audioWaveContainer}>
      {waveAnimations.map((anim, index) => {
        const height = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [4, 24 + (index % 4) * 3],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.waveBar,
              {
                height,
                backgroundColor: `hsl(${120 - index * 8}, 80%, ${60 + index * 2}%)`,
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
  onAudioMessage,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  
  // Animation refs
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recordingOverlayAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  // expo-audio hooks
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  // Setup audio permissions and mode
  useEffect(() => {
    const setupAudio = async () => {
      try {
        const { status } = await requestRecordingPermissionsAsync();
        setHasPermission(status === 'granted');
        
        if (status === 'granted') {
          await setAudioModeAsync({
            playsInSilentMode: true,
            allowsRecording: true,
          });
        }
      } catch (error) {
        console.error('Failed to setup audio:', error);
      }
    };

    setupAudio();
  }, []);

  // Handle recording state changes
  useEffect(() => {
    if (recorderState.isRecording) {
      // Start timer and animations when recording starts
      setRecordingSeconds(0);
      intervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Start recording overlay animation
      Animated.timing(recordingOverlayAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }).start();

      // Start pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    } else {
      // Stop timer and animations when recording stops
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      pulseAnim.setValue(1);

      // Stop overlay animation
      Animated.timing(recordingOverlayAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [recorderState.isRecording]);

  // Start recording
  const startRecording = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Microphone permission is required for voice messages.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
    }
  };

  // Stop recording
  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      
      const uri = audioRecorder.uri;
      const duration = recordingSeconds;

      if (uri && onAudioMessage && duration > 0) {
        try {
          const audioInfo = await FileSystem.getInfoAsync(uri);
          onAudioMessage({
            id: Date.now().toString(),
            type: 'audio',
            uri,
            duration,
            size: audioInfo.size || 0,
            sender: 'user',
            timestamp: new Date().getTime(),
          });
        } catch (fileError) {
          console.error('Error processing audio file:', fileError);
          Alert.alert('Error', 'Failed to process recorded audio');
        }
      }
      
      setRecordingSeconds(0);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Recording Error', 'Failed to save recording.');
    }
  };

  const handleSendPress = () => {
    if (!recorderState.isRecording && value.trim().length > 0 && !isLoading) {
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

  // Recording overlay animations
  const overlayScale = recordingOverlayAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const overlayOpacity = recordingOverlayAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      {/* Recording Info Overlay */}
      {recorderState.isRecording && (
        <Animated.View 
          style={[
            styles.recordingOverlay,
            {
              transform: [{ scale: overlayScale }],
              opacity: overlayOpacity,
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 68, 68, 0.95)', 'rgba(255, 102, 102, 0.95)']}
            style={styles.recordingGradient}
          >
            <View style={styles.recordingContent}>
              <AudioWave isActive={recorderState.isRecording} />
              <View style={styles.recordingInfo}>
                <View style={styles.recordingIndicator}>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingText}>REC</Text>
                </View>
                <Text style={styles.recordingTime}>{formatTime(recordingSeconds)}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Main Input Container */}
      <View style={styles.inputContainer}>
        <View style={[
          styles.textInputWrapper,
          isFocused && styles.textInputWrapperFocused,
          recorderState.isRecording && styles.textInputWrapperRecording
        ]}>
          <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={recorderState.isRecording ? '🎤 Recording...' : 'Type your message...'}
            placeholderTextColor={recorderState.isRecording ? "#ff9999" : "#9ca3af"}
            multiline
            maxLength={2000}
            editable={!recorderState.isRecording}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>

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
                (!isActive || recorderState.isRecording) && styles.sendButtonDisabled
              ]}
              onPress={handleSendPress}
              disabled={isLoading || !isActive || recorderState.isRecording}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isActive && !recorderState.isRecording ? ['#00D1B2', '#00a27a'] : ['#e5e7eb', '#d1d5db']}
                style={styles.sendButtonGradient}
              >
                <MaterialIcons
                  name={isLoading ? "hourglass-empty" : "send"}
                  size={20}
                  color={isActive && !recorderState.isRecording ? '#ffffff' : '#9ca3af'}
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
                recorderState.isRecording && styles.recordButtonActive
              ]}
              onPressIn={startRecording}
              onPressOut={stopRecording}
              activeOpacity={0.8}
              disabled={isLoading || !hasPermission}
            >
              <LinearGradient
                colors={recorderState.isRecording ? ['#ff4444', '#ff6666'] : ['#00D1B2', '#00a27a']}
                style={styles.recordButtonGradient}
              >
                <MaterialIcons
                  name={recorderState.isRecording ? "stop" : "mic"}
                  size={24}
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
    top: -70,
    left: 16,
    right: 16,
    height: 55,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1000,
  },
  recordingGradient: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  recordingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  recordingText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  recordingTime: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    minWidth: 55,
    textAlign: 'center',
  },
  audioWaveContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 30,
    gap: 2,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
    minHeight: 4,
    shadowColor: '#ffffff',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,
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
    backgroundColor: 'rgba(255, 245, 245, 0.9)',
  },
  textInput: {
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 18,
    paddingVertical: Platform.select({ ios: 14, android: 12 }),
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  sendButtonContainer: {
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 23,
  },
  recordButtonContainer: {
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  recordButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
  },
  recordButtonActive: {
    shadowColor: '#ff4444',
    shadowOpacity: 0.5,
    elevation: 10,
  },
  recordButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 26,
  },
});

export default InputBar;
