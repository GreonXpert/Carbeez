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
    Alert.alert("Logout", "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK", onPress: async () => {
            try {
              await AsyncStorage.removeItem('@user_data');
              navigation.replace('Login');
            } catch (e) { Alert.alert("Error", "Could not logout."); }
          }
        }
      ]
    );
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

// ✅ CORRECTED: Save Chat Function in ChatScreen.js
const handleSaveChat = async () => {
  try {
    // ✅ Debug: Check what messages we have
    console.log('💾 Attempting to save chat with messages:', messages.length);
    console.log('💾 Messages content:', messages);
    
    if (!messages || messages.length <= 1) {
      Alert.alert("No Chat to Save", "There are no messages to save in this conversation.");
      return;
    }

    // ✅ Create chat object with all current messages
    const chatToSave = {
      id: `chat_${Date.now()}`,
      title: `Chat with ${consultantType}`,
      messages: [...messages], // ✅ Spread to ensure fresh copy
      consultantType: consultantType,
      timestamp: new Date().getTime(),
      userName: userName,
      messageCount: messages.length
    };

    console.log('💾 Chat object to save:', chatToSave);

    // ✅ CRITICAL: Use different key '@saved_chats' (not '@saved_messages')
    const savedChatsString = await AsyncStorage.getItem('@saved_chats');
    let savedChats = savedChatsString ? JSON.parse(savedChatsString) : [];
    
    console.log('💾 Existing saved chats:', savedChats.length);

    // ✅ Add new chat to array
    savedChats.push(chatToSave);

    // ✅ Save to dedicated chat storage key
    await AsyncStorage.setItem('@saved_chats', JSON.stringify(savedChats));
    
    console.log('✅ Chat saved successfully!');

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
      const response = await sendMessage(input, userName, selectedLanguage);
      const botMessage = {
        id: Date.now().toString() + 'bot',
        text: response,
        sender: 'bot',
        timestamp: new Date().getTime(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now().toString() + 'err',
        text: "Sorry, I'm having trouble connecting.",
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

  // ✅ CRITICAL FIX: Aggressive audio session reset after recording
 const handleAudioMessage = async (audioData) => {
  try {
    const audioMessage = {
      ...audioData,
      timestamp: new Date().getTime(),
    };
    
    setMessages((prev) => [...prev, audioMessage]);
    console.log('🎵 Audio message added:', audioData);
    
    // ✅ IMMEDIATE NUCLEAR DECONTAMINATION after recording
    console.log('🧹 NUCLEAR audio session decontamination after recording...');
    
    // Multiple aggressive resets with longer delays
    const decontaminationSequence = [100, 300, 500, 750, 1000];
    
    decontaminationSequence.forEach((delay, index) => {
      setTimeout(async () => {
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false, // CRITICAL
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
    
  } catch (error) {
    console.error('Failed to process audio message:', error);
    Alert.alert('Error', 'Failed to process audio message');
  }
};

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, isLoading]);

  const renderThinkingItem = () => {
    if (thinkingStage === 1) return <SearchGifBubble />;
    if (thinkingStage === 2) return <ThinkingBubble />;
    return null;
  };

  const inputBarPadding = isKeyboardVisible 
    ? (Platform.OS === 'ios' ? 10 : 8.5)
    : (Platform.OS === 'ios' ? 100 : 85);

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#eefcf9', '#ffffff']}
        style={styles.gradientBackground}
        pointerEvents="none"
      />
      <GlassmorphicHeader
        title={consultantType}
        onProfilePress={handleProfile}
        onLogoutPress={handleLogout}
        onClearChat={handleClearChat}    // ✅ NEW
  onSaveChat={handleSaveChat}      // ✅ NEW
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 48 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={[...messages, ...(isLoading ? [{ id: 'thinking' }] : [])]}
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
            onAudioMessage={handleAudioMessage}
            isLoading={isLoading}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            showLanguageSelector={true}
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
