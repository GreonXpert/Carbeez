// screens/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { sendMessage } from '../services/gemini.js';
import MessageBubble from '../components/MessageBubble';
import InputBar from '../components/InputBar';
import ThinkingBubble from '../components/ThinkingBubble';
import SearchGifBubble from '../components/SearchGifBubble.js';
import GlassmorphicHeader from '../components/GlassmorphicHeader.js';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const { consultantType } = route.params;
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingStage, setThinkingStage] = useState(0);
  const flatListRef = useRef(null);
  const loadingTimerRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // ✅ AGGRESSIVE AUDIO SESSION MANAGEMENT
  useEffect(() => {
    const initializeAudioSession = async () => {
      try {
        console.log('🔧 Initializing OPTIMAL audio session...');
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false, // CRITICAL: Start in playback mode
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          shouldDuckAndroid: false,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          playThroughEarpieceAndroid: false,
        });
        console.log('✅ Audio session initialized for FULL VOLUME playback');
      } catch (error) {
        console.error('❌ Failed to initialize audio session:', error);
      }
    };

    initializeAudioSession();
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('@user_data');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserName(userData.name);
        }
      } catch (e) {
        console.error("Failed to load user data.", e);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const greeting = userName ? `Hello, ${userName}!` : 'Hello!';
    setMessages([
      {
        id: '1',
        text: `${greeting} I am your ${consultantType}. How can I assist you today?`,
        sender: 'bot',
        timestamp: new Date().getTime(),
      },
    ]);
  }, [consultantType, userName]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK", onPress: async () => {
          try {
            await AsyncStorage.removeItem('@user_data');
            navigation.replace('Login');
          } catch (e) { Alert.alert("Error", "Could not logout."); }
        }
      }
    ]);
  };

  const handleClearChat = () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear all messages? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            const greeting = userName ? `Hello, ${userName}!` : 'Hello!';
            setMessages([
              {
                id: '1',
                text: `${greeting} I am your ${consultantType}. How can I assist you today?`,
                sender: 'bot',
                timestamp: new Date().getTime(),
              },
            ]);
          }
        }
      ]
    );
  };

  const handleSaveChat = async () => {
    try {
      console.log('💾 Attempting to save chat with messages:', messages.length);
      
      if (!messages || messages.length <= 1) {
        Alert.alert("No Chat to Save", "There are no messages to save in this conversation.");
        return;
      }

      const chatToSave = {
        id: `chat_${Date.now()}`,
        title: `Chat with ${consultantType}`,
        messages: [...messages],
        consultantType: consultantType,
        timestamp: new Date().getTime(),
        userName: userName,
        messageCount: messages.length
      };

      const savedChatsString = await AsyncStorage.getItem('@saved_chats');
      let savedChats = savedChatsString ? JSON.parse(savedChatsString) : [];
      savedChats.push(chatToSave);
      await AsyncStorage.setItem('@saved_chats', JSON.stringify(savedChats));

      Alert.alert(
        "Chat Saved!",
        `Your conversation with ${consultantType} (${messages.length} messages) has been saved successfully.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('❌ Error saving chat:', error);
      Alert.alert("Save Error", "Failed to save chat. Please try again.");
    }
  };

  const handleProfile = () => {
    navigation.dispatch(CommonActions.navigate({ name: 'Profile' }));
  };

  // ✅ UPDATED: Handle text messages with new response format
  const handleSend = async () => {
    if (input.trim().length === 0) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().getTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setThinkingStage(1);
    loadingTimerRef.current = setTimeout(() => setThinkingStage(2), 2000);

    try {
      // ✅ NEW: Handle updated response format
      const response = await sendMessage(input, userName, selectedLanguage);
      
      const botMessage = {
        id: Date.now().toString() + 'bot',
        text: response.text || response, // Handle both old and new format
        sender: 'bot',
        timestamp: new Date().getTime(),
        language: response.language || 'en',
        // Handle any additional response data
        ...(response.transcription && { transcription: response.transcription })
      };

      setMessages((prev) => [...prev, botMessage]);
      
      // Update selected language if detected
      if (response.language && response.language !== selectedLanguage) {
        setSelectedLanguage(response.language);
      }
      
    } catch (error) {
      console.error('❌ Send message error:', error);
      const errorMessage = {
        id: Date.now().toString() + 'err',
        text: "Sorry, I'm having trouble connecting. Please try again.",
        sender: 'bot',
        timestamp: new Date().getTime(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      clearTimeout(loadingTimerRef.current);
      setIsLoading(false);
      setThinkingStage(0);
    }
  };

  // ✅ UPDATED: Handle audio messages with new response format
// ✅ UPDATED: Handle audio messages with separate audio and text responses
const handleAudioMessage = async (audioData) => {
  try {
    // Add user's audio message to chat
    const userAudioMessage = {
      ...audioData,
      timestamp: new Date().getTime(),
    };
    setMessages((prev) => [...prev, userAudioMessage]);
    console.log('🎵 User audio message added:', audioData);

    // Show thinking state
    setIsLoading(true);
    setThinkingStage(1);
    loadingTimerRef.current = setTimeout(() => setThinkingStage(2), 2000);

    // ✅ Process audio input through updated sendMessage
    const response = await sendMessage(audioData, userName, selectedLanguage);

    // ✅ NEW: Create TWO separate bot messages
    const baseTimestamp = new Date().getTime();

    // 1️⃣ FIRST: Audio response message (if audio was generated)
    if (response.isAudio && response.audioUri) {
      const botAudioMessage = {
        id: baseTimestamp.toString() + 'bot_audio',
        type: 'audio',
        uri: response.audioUri,
        duration: response.duration || 0,
        sender: 'bot',
        timestamp: baseTimestamp,
        language: response.language || 'en',
        // Clean text for audio message (remove transcription prefix)
        text: response.text.replace(/🎤.*?\n\n/g, '').trim(),
        transcription: response.transcription
      };
      setMessages((prev) => [...prev, botAudioMessage]);
      console.log('🔊 Bot audio response added');
    }

    // 2️⃣ SECOND: Text response message (always shown)
    const botTextMessage = {
      id: (baseTimestamp + 1).toString() + 'bot_text',
      text: response.text,
      sender: 'bot',
      timestamp: baseTimestamp + 100, // Slightly later timestamp
      language: response.language || 'en',
      transcription: response.transcription
    };
    setMessages((prev) => [...prev, botTextMessage]);
    console.log('💬 Bot text response added');

    // Update language preference
    if (response.language && response.language !== selectedLanguage) {
      setSelectedLanguage(response.language);
    }

    console.log('🤖 Bot responses added:', {
      audioResponse: !!response.audioUri,
      textResponse: true,
      language: response.language,
      hasTranscription: !!response.transcription
    });

  } catch (error) {
    console.error('❌ Failed to process audio message:', error);
    const errorMessage = {
      id: Date.now().toString() + 'err',
      text: "Sorry, I couldn't process your audio message. Please try again.",
      sender: 'bot',
      timestamp: new Date().getTime(),
    };
    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    clearTimeout(loadingTimerRef.current);
    setIsLoading(false);
    setThinkingStage(0);

    // ✅ CRITICAL: Audio session reset (unchanged)
    console.log('🧹 NUCLEAR audio session decontamination after recording...');
    const decontaminationSequence = [100, 300, 500, 750, 1000];
    decontaminationSequence.forEach((delay, index) => {
      setTimeout(async () => {
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            interruptionModeIOS: InterruptionModeIOS.DuckOthers,
            shouldDuckAndroid: false,
            interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
            playThroughEarpieceAndroid: false,
          });
          console.log(`✅ Decontamination wave ${index + 1}/5 completed`);
          if (index === decontaminationSequence.length - 1) {
            console.log('🎵 AUDIO SESSION FULLY DECONTAMINATED - All audio will now play at FULL VOLUME');
          }
        } catch (error) {
          console.error(`❌ Decontamination wave ${index + 1} failed:`, error);
        }
      }, delay);
    });
  }
};


  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, isLoading]);

  const renderThinkingItem = () => {
    if (thinkingStage === 1) return <ThinkingBubble />;
    if (thinkingStage === 2) return <SearchGifBubble />;
    return null;
  };

  const inputBarPadding = isKeyboardVisible
    ? (Platform.OS === 'ios' ? 10 : 8.5)
    : (Platform.OS === 'ios' ? 100 : 85);

  return (
    <View style={styles.screenContainer}>
      <LinearGradient
        colors={['#f0f9ff', '#e0f2fe', '#f0fdfa']}
        style={styles.gradientBackground}
      />
      
      <GlassmorphicHeader
        title={consultantType}
        onProfilePress={handleProfile}
        onClearChat={handleClearChat}
        onSaveChat={handleSaveChat}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={isLoading ? [...messages, { id: 'thinking' }] : messages}
          renderItem={({ item }) =>
            item.id === 'thinking' ? renderThinkingItem() : <MessageBubble message={item} />
          }
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          style={styles.flatList}
          showsVerticalScrollIndicator={false}
        />

        <View style={[styles.inputBarContainer, { paddingBottom: inputBarPadding }]}>
          <InputBar
            value={input}
            onChangeText={setInput}
            onSend={handleSend}
            isLoading={isLoading}
            onAudioMessage={handleAudioMessage}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: 'transparent', position: 'relative' },
  gradientBackground: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  keyboardAvoidingView: { flex: 1 },
  flatList: { flex: 1, zIndex: 1 },
  messageList: { paddingHorizontal: 10, paddingTop: 6, paddingBottom: 12, backgroundColor: 'transparent', zIndex: 1 },
  inputBarContainer: { paddingHorizontal: 6, paddingTop: 8, backgroundColor: 'rgba(255,255,255,0.92)', borderTopLeftRadius: 19, borderTopRightRadius: 19, shadowColor: '#00D1B2', shadowOpacity: 0.09, shadowRadius: 10, shadowOffset: { height: -2, width: 0 }, elevation: 6 }
});

export default ChatScreen;
