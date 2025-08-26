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

 // Optimized keyboard listeners with immediate state update
 useEffect(() => {
  const keyboardDidShowListener = Keyboard.addListener(
   Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', // Use 'Will' for iOS for faster response
   () => {
    setKeyboardVisible(true);
   }
  );
  const keyboardDidHideListener = Keyboard.addListener(
   Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', // Use 'Will' for iOS for faster response
   () => {
    setKeyboardVisible(false);
   }
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
    timestamp: new Date().toISOString(),
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

 const handleProfile = () => {
  navigation.dispatch(CommonActions.navigate({ name: 'Profile' }));
 };

 const handleSend = async () => {
  if (input.trim().length === 0) return;
  const userMessage = { id: Date.now().toString(), text: input, sender: 'user', timestamp: new Date().toISOString() };
  setMessages((prev) => [...prev, userMessage]);
  setInput('');
  setIsLoading(true);
  setThinkingStage(1);
  loadingTimerRef.current = setTimeout(() => setThinkingStage(2), 2000);

  try {
   const response = await sendMessage(input, userName);
   const botMessage = { id: Date.now().toString() + 'bot', text: response, sender: 'bot', timestamp: new Date().toISOString() };
   setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
   const errorMessage = { id: Date.now().toString() + 'err', text: "Sorry, I'm having trouble connecting.", sender: 'bot', timestamp: new Date().toISOString() };
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
 }, [messages, isLoading]);

 const renderThinkingItem = () => {
  if (thinkingStage === 1) return <SearchGifBubble />;
  if (thinkingStage === 2) return <ThinkingBubble />;
  return null;
 };

 // Pre-calculate padding values to avoid inline calculations
 const inputBarPadding = isKeyboardVisible
  ? (Platform.OS === 'ios' ? 10 : 8.5)  // When keyboard is open
  : (Platform.OS === 'ios' ? 100 : 85); // When keyboard is closed

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
      isLoading={isLoading}
     />
    </View>
   </KeyboardAvoidingView>
  </View>
 );
};

const styles = StyleSheet.create({
 screenContainer: {
  flex: 1,
  backgroundColor: 'transparent',
  position: 'relative',
 },
 gradientBackground: {
  ...StyleSheet.absoluteFillObject,
  zIndex: 0,
 },
 keyboardAvoidingView: {
  flex: 1,
 },
 flatList: {
  flex: 1,
  zIndex: 1,
 },
 messageList: {
  paddingHorizontal: 10,
  paddingTop: 6,
  paddingBottom: 12,
  backgroundColor: 'transparent',
  zIndex: 1,
 },
 inputBarContainer: {
  paddingHorizontal: 6,
  paddingTop: 8,
  backgroundColor: 'rgba(255,255,255,0.92)',
  borderTopLeftRadius: 19,
  borderTopRightRadius: 19,
  shadowColor: '#00D1B2',
  shadowOpacity: 0.09,
  shadowRadius: 10,
  shadowOffset: { height: -2, width: 0 },
  elevation: 6,
 }
});

export default ChatScreen;