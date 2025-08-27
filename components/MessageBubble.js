// components/MessageBubble.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Share,
  Alert,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';

const { width } = Dimensions.get('window');

// Audio Wave Component for Playback
const AudioPlaybackWave = ({ isPlaying, duration }) => {
  const waveAnimations = useRef([...Array(8)].map(() => new Animated.Value(0.2))).current;

  useEffect(() => {
    if (isPlaying) {
      const animations = waveAnimations.map((anim, index) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 0.8 + Math.random() * 0.2,
              duration: 300 + Math.random() * 200,
              delay: index * 40,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: 0.2 + Math.random() * 0.3,
              duration: 300 + Math.random() * 200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ])
        );
      });

      animations.forEach(anim => anim.start());
      return () => animations.forEach(anim => anim.stop());
    } else {
      waveAnimations.forEach(anim => anim.setValue(0.2));
    }
  }, [isPlaying]);

  return (
    <View style={styles.playbackWaveContainer}>
      {waveAnimations.map((anim, index) => {
        const height = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [3, 18 + (index % 3) * 2],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.playbackWaveBar,
              {
                height,
                backgroundColor: '#00D1B2',
                opacity: 0.7,
              }
            ]}
          />
        );
      })}
    </View>
  );
};

// ✅ ULTIMATE FIX: Audio Message Component with GUARANTEED Full Volume
const AudioMessage = ({ message, isUser }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnloaded, setIsUnloaded] = useState(false);
  const positionIntervalRef = useRef(null);

  // Cleanup with unload tracking
  useEffect(() => {
    return () => {
      if (sound && !isUnloaded) {
        sound.unloadAsync()
          .then(() => setIsUnloaded(true))
          .catch(() => {});
      }
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
    };
  }, [sound, isUnloaded]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // ✅ NUCLEAR OPTION: Complete Audio Session Decontamination
  const decontaminateAudioSession = async () => {
    try {
      console.log('🧹 DECONTAMINATING audio session - NUCLEAR RESET...');
      
      // ✅ Step 1: Aggressive reset with multiple attempts
      for (let i = 0; i < 3; i++) {
        await Audio.setAudioModeAsync({
          // ✅ CRITICAL: Force recording OFF
          allowsRecordingIOS: false,
          
          // ✅ Force playback routing to speakers/Bluetooth, NOT earpiece
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          
          // ✅ Proper interruption handling for external devices
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          shouldDuckAndroid: false,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          playThroughEarpieceAndroid: false,
        });
        
        // ✅ Wait between resets to ensure they take effect
        await new Promise(resolve => setTimeout(resolve, 150));
        console.log(`✅ Audio decontamination attempt ${i + 1}/3 completed`);
      }
      
      console.log('🎵 Audio session FULLY DECONTAMINATED - Ready for FULL VOLUME playback');
    } catch (error) {
      console.error('❌ Audio decontamination failed:', error);
    }
  };

  const togglePlayback = async () => {
    try {
      if (sound && !isUnloaded) {
        if (isPlaying) {
          // Pause
          await sound.pauseAsync();
          setIsPlaying(false);
          if (positionIntervalRef.current) {
            clearInterval(positionIntervalRef.current);
          }
        } else {
          // ✅ CRITICAL: Decontaminate audio session BEFORE resume
          await decontaminateAudioSession();
          
          // ✅ Force MAXIMUM volume
          await sound.setVolumeAsync(1.0);
          
          // Resume or replay
          const status = await sound.getStatusAsync();
          if (status.positionMillis === status.durationMillis || status.didJustFinish) {
            await sound.replayAsync();
          } else {
            await sound.playAsync();
          }
          setIsPlaying(true);
          startPositionTracking();
        }
      } else {
        // Load and play new audio
        setIsLoading(true);
        
        // ✅ CRITICAL: Decontaminate audio session BEFORE loading
        await decontaminateAudioSession();

        console.log('🎵 Loading audio from URI:', message.uri);
        
        // ✅ Create sound with maximum volume settings
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: message.uri },
          { 
            shouldPlay: false, // Don't auto-play, configure first
            volume: 1.0,       // Maximum volume
            rate: 1.0,
            shouldCorrectPitch: true,
            progressUpdateIntervalMillis: 100,
          }
        );
        
        setSound(newSound);
        setIsUnloaded(false);
        setIsLoading(false);

        // ✅ CRITICAL: Force MAXIMUM volume after creation
        await newSound.setVolumeAsync(1.0);
        
        // ✅ CRITICAL: One final decontamination before playback
        await decontaminateAudioSession();
        
        // ✅ NOW play at GUARANTEED FULL VOLUME
        await newSound.playAsync();
        setIsPlaying(true);

        // Set up playback completion listener
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPlaybackPosition(0);
            if (positionIntervalRef.current) {
              clearInterval(positionIntervalRef.current);
            }
          }
          if (status.error) {
            console.error('🔊 Audio playback error:', status.error);
            setIsPlaying(false);
            setIsLoading(false);
          }
        });

        startPositionTracking(newSound);
      }
    } catch (error) {
      console.error('❌ Error playing audio:', error);
      setIsLoading(false);
      setIsPlaying(false);
      Alert.alert(
        'Audio Playback Error', 
        'Unable to play audio. Please:\n\n• Check device volume\n• Ensure Bluetooth/headphones are connected properly\n• Try disconnecting and reconnecting audio devices'
      );
    }
  };

  const startPositionTracking = (soundInstance = sound) => {
    positionIntervalRef.current = setInterval(async () => {
      if (soundInstance && !isUnloaded) {
        try {
          const status = await soundInstance.getStatusAsync();
          if (status.isLoaded && status.positionMillis !== undefined) {
            setPlaybackPosition(status.positionMillis);
          }
        } catch (error) {
          clearInterval(positionIntervalRef.current);
        }
      }
    }, 100);
  };

  const getDurationText = () => {
    const currentTime = formatTime(playbackPosition);
    const totalTime = formatTime((message.duration || 0) * 1000);
    return `${currentTime} / ${totalTime}`;
  };

  return (
    <View style={[styles.audioContainer, isUser && styles.userAudioContainer]}>
      <TouchableOpacity 
        onPress={togglePlayback}
        style={[styles.playButton, isUser && styles.userPlayButton]}
        disabled={isLoading}
      >
        <LinearGradient
          colors={isUser ? ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'] : ['#00D1B2', '#00a27a']}
          style={styles.playButtonGradient}
        >
          <MaterialIcons
            name={isLoading ? "hourglass-empty" : (isPlaying ? "pause" : "play-arrow")}
            size={24}
            color="#ffffff"
          />
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.audioInfo}>
        <AudioPlaybackWave isPlaying={isPlaying} duration={message.duration} />
        <Text style={[styles.audioDuration, isUser && styles.userAudioDuration]}>
          {getDurationText()}
        </Text>
      </View>
    </View>
  );
};

// Rest of MessageBubble component (same as before)
const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!message) {
    return null;
  }

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const savedMessagesString = await AsyncStorage.getItem('@saved_messages');
        if (savedMessagesString) {
          const savedMessages = JSON.parse(savedMessagesString);
          const messageIsSaved = savedMessages.some(savedMsg => savedMsg.id === message.id);
          setIsSaved(messageIsSaved);
        }
      } catch (error) {
        console.error('Failed to check saved status', error);
      }
    };
    checkIfSaved();
  }, [message.id]);

  const isUser = message.sender === 'user';
  const isAudioMessage = message.type === 'audio';

  const onShare = async () => {
    try {
      const shareContent = isAudioMessage 
        ? { url: message.uri, title: 'Shared Audio from Carbeez AI' }
        : { message: message.text, title: 'Shared from Carbeez AI' };
      
      await Share.share(shareContent);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (error) {
      Alert.alert('Share Error', error.message);
    }
  };

  const onCopy = async () => {
    try {
      if (isAudioMessage) {
        await Clipboard.setStringAsync(`Audio message (${message.duration}s)`);
      } else {
        await Clipboard.setStringAsync(message.text);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      Alert.alert('Copy Error', 'Failed to copy text');
    }
  };

  const onSave = async () => {
    try {
      const savedMessagesString = await AsyncStorage.getItem('@saved_messages');
      let messages = savedMessagesString ? JSON.parse(savedMessagesString) : [];
      const existingIndex = messages.findIndex(savedMsg => savedMsg.id === message.id);

      if (existingIndex > -1) {
        messages.splice(existingIndex, 1);
        await AsyncStorage.setItem('@saved_messages', JSON.stringify(messages));
        setIsSaved(false);
        Alert.alert('Removed', 'Message removed from your bookmarks');
      } else {
        messages.push(message);
        await AsyncStorage.setItem('@saved_messages', JSON.stringify(messages));
        setIsSaved(true);
        Alert.alert('Saved', 'Message saved to your bookmarks');
      }
    } catch (error) {
      Alert.alert('Save Error', 'Failed to update bookmarks');
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={isUser ? styles.userMessageContainer : styles.botMessageContainer}>
      {isUser ? (
        <View style={styles.userWrapper}>
          <LinearGradient
            colors={['#00D1B2', '#00a27a', '#008a66']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.bubble, styles.userBubble]}
          >
            <View style={styles.userTextContainer}>
              {isAudioMessage ? (
                <AudioMessage message={message} isUser={true} />
              ) : (
                <Markdown style={userMarkdownStyles}>{message.text}</Markdown>
              )}
            </View>
            <Text style={styles.timeTextUser}>{formatTime(message.timestamp)}</Text>
            <View style={styles.userGlassOverlay} />
          </LinearGradient>

          <View style={styles.userActions}>
            <TouchableOpacity onPress={onCopy} style={styles.userActionBtn}>
              <Feather
                name={copied ? "check" : "copy"}
                size={14}
                color={copied ? "#4ade80" : "rgba(255,255,255,0.7)"}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.botWrapper}>
          <LinearGradient
            colors={['#ffffff', '#fafafa', '#f8fafc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.bubble, styles.botBubble]}
          >
            <View style={styles.botTextContainer}>
              {isAudioMessage ? (
                <AudioMessage message={message} isUser={false} />
              ) : (
                <Markdown style={botMarkdownStyles}>{message.text}</Markdown>
              )}
            </View>
            <Text style={styles.timeTextBot}>{formatTime(message.timestamp)}</Text>
            <View style={styles.botAccentBorder} />
          </LinearGradient>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onCopy} style={styles.actionButton}>
              <LinearGradient
                colors={copied ? ['#dcfce7', '#f0fdf4'] : ['#f0fdfa', '#ecfdf5']}
                style={styles.buttonGradient}
              >
                <Feather
                  name={copied ? "check" : "copy"}
                  size={18}
                  color={copied ? "#059669" : "#00D1B2"}
                />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={onShare} style={styles.actionButton}>
              <LinearGradient
                colors={shared ? ['#dbeafe', '#eff6ff'] : ['#f0f9ff', '#e0f2fe']}
                style={styles.buttonGradient}
              >
                <Feather
                  name={shared ? "check" : "share-2"}
                  size={18}
                  color={shared ? "#2563eb" : "#00a27a"}
                />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSave} style={styles.actionButton}>
              <LinearGradient
                colors={isSaved ? ['#facc15', '#eab308'] : ['#fef3c7', '#fef7cd']}
                style={styles.buttonGradient}
              >
                <Feather
                  name="bookmark"
                  size={18}
                  color={isSaved ? "#ffffff" : "#d97706"}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// ✅ ENHANCED MARKDOWN STYLES for User Messages (White on Gradient)
const userMarkdownStyles = {
  body: {
    color: '#ffffff',
    fontFamily: 'System',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  heading1: {
    color: '#ffffff',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 26,
    marginBottom: 14,
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heading2: {
    color: '#ffffff',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 12,
    marginTop: 6,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heading3: {
    color: '#ffffff',
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 19,
    marginBottom: 10,
    marginTop: 4,
  },
  strong: {
    fontFamily: 'System',
    fontWeight: '700',
    color: '#e0f9f5',
  },
  em: {
    fontFamily: 'System',
    fontStyle: 'italic',
    color: '#ccfbf1',
    fontWeight: '400',
  },
  list_item: {
    color: '#ffffff',
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 22,
    paddingLeft: 4,
  },
  ordered_list: {
    marginVertical: 8,
  },
  bullet_list: {
    marginVertical: 8,
  },
  code_inline: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    color: '#f0fdfa',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 15,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontWeight: '600',
  },
  code_block: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#ffffff',
    padding: 18,
    borderRadius: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#e0f9f5',
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  fence: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#ffffff',
    padding: 18,
    borderRadius: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#e0f9f5',
  },
  link: {
    color: '#a7f3d0',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  blockquote: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderLeftWidth: 5,
    borderLeftColor: '#6ee7b7',
    paddingLeft: 18,
    paddingVertical: 12,
    marginVertical: 10,
    borderRadius: 10,
    fontStyle: 'italic',
  },
  paragraph: {
    marginVertical: 4,
  },
  table: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    marginVertical: 10,
  },
  th: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#ffffff',
    fontWeight: '700',
    padding: 12,
    fontSize: 15,
  },
  td: {
    color: '#ffffff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    fontSize: 15,
  },
};

// ✅ ENHANCED MARKDOWN STYLES for Bot Messages (Dark on White)
const botMarkdownStyles = {
  body: {
    color: '#1f2937',
    fontFamily: 'System',
    fontSize: 16,
    lineHeight: 25,
    fontWeight: '400',
  },
  heading1: {
    color: '#00D1B2',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 26,
    marginBottom: 14,
    marginTop: 8,
    textShadowColor: 'rgba(0,209,178,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heading2: {
    color: '#00a27a',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 12,
    marginTop: 6,
  },
  heading3: {
    color: '#008a66',
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 19,
    marginBottom: 10,
    marginTop: 4,
  },
  strong: {
    fontFamily: 'System',
    fontWeight: '700',
    color: '#00D1B2',
  },
  em: {
    fontFamily: 'System',
    fontStyle: 'italic',
    color: '#4b5563',
    fontWeight: '400',
  },
  list_item: {
    color: '#374151',
    marginBottom: 10,
    fontSize: 16,
    paddingLeft: 6,
    lineHeight: 22,
  },
  ordered_list: {
    marginVertical: 8,
  },
  bullet_list: {
    marginVertical: 8,
  },
  code_inline: {
    backgroundColor: '#f0fdfa',
    color: '#00D1B2',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  code_block: {
    backgroundColor: '#f8fafc',
    color: '#00a27a',
    padding: 20,
    borderRadius: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    marginVertical: 12,
    borderWidth: 2,
    borderColor: '#e0f9f5',
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  fence: {
    backgroundColor: '#f8fafc',
    color: '#00a27a',
    padding: 20,
    borderRadius: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    marginVertical: 12,
    borderWidth: 2,
    borderColor: '#e0f9f5',
  },
  link: {
    color: '#00D1B2',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  blockquote: {
    backgroundColor: '#f0fdfa',
    borderLeftWidth: 5,
    borderLeftColor: '#00D1B2',
    paddingLeft: 20,
    paddingVertical: 15,
    marginVertical: 12,
    borderRadius: 12,
    fontStyle: 'italic',
    color: '#00796b',
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paragraph: {
    marginVertical: 4,
  },
  table: {
    borderWidth: 2,
    borderColor: '#e0f9f5',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 12,
    backgroundColor: '#ffffff',
  },
  th: {
    backgroundColor: '#f0fdfa',
    color: '#00D1B2',
    fontFamily: 'System',
    fontWeight: '700',
    padding: 14,
    fontSize: 15,
  },
  td: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0fdfa',
    color: '#374151',
    fontSize: 15,
  },
  tr: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0f9f5',
  },
  textgroup: {
    color: '#1f2937',
  },
  s: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  del: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
};

// Styles (same as before)
const styles = StyleSheet.create({
  userMessageContainer: { alignItems: 'flex-end', marginVertical: 10, paddingHorizontal: 18 },
  botMessageContainer: { alignItems: 'flex-start', marginVertical: 10, paddingHorizontal: 18 },
  userWrapper: { alignItems: 'flex-end', maxWidth: '85%' },
  botWrapper: { alignItems: 'flex-start', maxWidth: '90%' },
  bubble: { borderRadius: 24, paddingHorizontal: 22, paddingVertical: 18, minWidth: '25%', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8, position: 'relative' },
  userBubble: { borderBottomRightRadius: 8, shadowColor: '#00D1B2', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  botBubble: { borderBottomLeftRadius: 8, shadowColor: '#00D1B2', borderWidth: 2, borderColor: 'rgba(0, 209, 178, 0.1)' },
  userTextContainer: { position: 'relative', zIndex: 2 },
  botTextContainer: { position: 'relative', zIndex: 2 },
  userGlassOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, borderBottomRightRadius: 8, zIndex: 1 },
  botAccentBorder: { position: 'absolute', top: 0, left: 0, width: 4, height: '100%', backgroundColor: '#00D1B2', borderTopLeftRadius: 24, borderBottomLeftRadius: 8 },
  userActions: { flexDirection: 'row', marginTop: 8, marginRight: 4 },
  userActionBtn: { padding: 6, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.1)' },
  buttonContainer: { flexDirection: 'row', marginTop: 14, marginLeft: 8, gap: 10 },
  actionButton: { borderRadius: 14, overflow: 'hidden', shadowColor: '#00D1B2', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 4 },
  buttonGradient: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(0, 209, 178, 0.15)', alignItems: 'center', justifyContent: 'center', minWidth: 44, minHeight: 44 },
  timeTextUser: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'right', marginTop: 5 },
  timeTextBot: { color: '#9ca3af', fontSize: 12, textAlign: 'right', marginTop: 5 },
  audioContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: 200 },
  userAudioContainer: { justifyContent: 'flex-end' },
  playButton: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  userPlayButton: { shadowColor: 'rgba(255,255,255,0.3)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  playButtonGradient: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 22 },
  audioInfo: { flex: 1, alignItems: 'center', gap: 8 },
  playbackWaveContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', height: 20, gap: 2 },
  playbackWaveBar: { width: 3, borderRadius: 2, minHeight: 3 },
  audioDuration: { fontSize: 13, color: '#4b5563', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: '600' },
  userAudioDuration: { color: 'rgba(255,255,255,0.8)' },
});

export default MessageBubble;
