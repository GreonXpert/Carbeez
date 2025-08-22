// screens/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { sendMessage } from '../services/gemini.js';
import MessageBubble from '../components/MessageBubble';
import InputBar from '../components/InputBar';
import ThinkingBubble from '../components/ThinkingBubble';
import SearchGifBubble from '../components/SearchGifBubble.js';
import GlassmorphicHeader from '../components/GlassmorphicHeader.js';

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
      },
    ]);
  }, [consultantType, userName]);

  const handleLogout = () => {
    Alert.alert( "Logout", "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: async () => {
            try {
              await AsyncStorage.removeItem('@user_data');
              navigation.replace('Login');
            } catch (e) { Alert.alert("Error", "Could not logout."); }
          }
        }
      ]
    );
  };

  const handleProfile = () => {
    navigation.dispatch(CommonActions.navigate({ name: 'Profile' }));
  };

  const handleSend = async () => {
    if (input.trim().length === 0) return;
    const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setThinkingStage(1);
    loadingTimerRef.current = setTimeout(() => setThinkingStage(2), 2000);

    try {
      const response = await sendMessage(input, userName);
      const botMessage = { id: Date.now().toString() + 'bot', text: response, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { id: Date.now().toString() + 'err', text: "Sorry, I'm having trouble connecting.", sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      clearTimeout(loadingTimerRef.current);
      setIsLoading(false);
      setThinkingStage(0);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderThinkingItem = () => {
    if (thinkingStage === 1) return <SearchGifBubble />;
    if (thinkingStage === 2) return <ThinkingBubble />;
    return null;
  };

  return (
    <View style={styles.container}>
      <GlassmorphicHeader
        title={consultantType}
        onProfilePress={handleProfile}
        onLogoutPress={handleLogout}
      />

      {/* --- FINAL FIX IS HERE --- */}
      <KeyboardAvoidingView
        // Use 'padding' for iOS and let Android handle it natively
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={0} // Reset the offset
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
        />
        <InputBar
          value={input}
          onChangeText={setInput}
          onSend={handleSend}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 10,
    paddingTop: 120, // Space for the header
    paddingBottom: 10,
  },
});

export default ChatScreen;