// screens/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { sendMessage } from '../services/gemini.js';
import MessageBubble from '../components/MessageBubble';
import InputBar from '../components/InputBar';
import ThinkingBubble from '../components/ThinkingBubble';
import SearchGifBubble from '../components/SearchGifBubble.js'; // Import the new component
import GlassmorphicHeader from '../components/GlassmorphicHeader.js';

const ChatScreen = ({ route }) => {
  const { consultantType } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingStage, setThinkingStage] = useState(0); // 0: idle, 1: gif, 2: bubble
  const flatListRef = useRef(null);
  const loadingTimerRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: `Hello! I am your ${consultantType}. How can I assist you today?`,
        sender: 'bot',
      },
    ]);
  }, [consultantType]);

  const handleSend = async () => {
    if (input.trim().length === 0) return;

    const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setThinkingStage(1); // Start with GIF animation

    // Set a timer to switch to the thinking bubble after 2 seconds
    loadingTimerRef.current = setTimeout(() => {
      setThinkingStage(2);
    }, 2000);

    try {
      const response = await sendMessage(input);
      const botMessage = { id: Date.now().toString() + 'bot', text: response, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { id: Date.now().toString() + 'err', text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // Clear the timer and reset loading states
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
    if (thinkingStage === 1) {
      return <SearchGifBubble />;
    }
    if (thinkingStage === 2) {
      return <ThinkingBubble />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <GlassmorphicHeader title={consultantType} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}>
        <FlatList
          ref={flatListRef}
          data={[...messages, ...(isLoading ? [{ id: 'thinking' }] : [])]}
          renderItem={({ item }) =>
            item.id === 'thinking' ? (
              renderThinkingItem()
            ) : (
              <MessageBubble message={item} />
            )
          }
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
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
    backgroundColor: '#0C0C0C',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 10,
    paddingTop: 120,
    paddingBottom: 20,
  },
});

export default ChatScreen;