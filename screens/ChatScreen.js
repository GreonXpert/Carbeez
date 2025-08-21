// screens/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { sendMessage } from '../services/gemini.js';
import MessageBubble from '../components/MessageBubble';
import InputBar from '../components/InputBar';
import ThinkingBubble from '../components/ThinkingBubble';
import GlassmorphicHeader from '../components/GlassmorphicHeader.js';

const ChatScreen = ({ route }) => {
  const { consultantType } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Corrected initial message format with "sender"
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

    // Corrected user message format with "sender"
    const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const response = await sendMessage(input);
      // Corrected bot message format with "sender"
      const botMessage = { id: Date.now().toString() + 'bot', text: response, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Corrected error message format with "sender"
      const errorMessage = { id: Date.now().toString() + 'err', text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View style={styles.container}>
       <GlassmorphicHeader title={consultantType} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
        >
        <FlatList
          ref={flatListRef}
          data={[...messages, ...(isLoading ? [{ id: 'thinking' }] : [])]}
          renderItem={({ item }) =>
            item.id === 'thinking' ? (
              <ThinkingBubble />
            ) : (
              // Correctly pass the "message" prop as a single object
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
    backgroundColor: '#fefefe',
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