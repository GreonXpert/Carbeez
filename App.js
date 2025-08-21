// App.js

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';

// Use the official expo-clipboard library
import * as Clipboard from 'expo-clipboard';

// Import services and components
import getGeminiResponse, {
  isGHGQuestion,
  isSmallTalk,
  smallTalkResponse,
  buildAccessTrace,
} from './services/gemini.js';
import GlassmorphicHeader from './components/GlassmorphicHeader';
import MessageBubble from './components/MessageBubble';
import FloatingAvatar from './components/FloatingAvatar';
import ThinkingBubble from './components/ThinkingBubble';
import InputBar from './components/InputBar';

// Styled Components
const AppContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #f0f4f8;
`;

const MessageRow = styled.View`
  flex-direction: row;
  margin: 0 16px;
  align-items: flex-start;
  justify-content: ${(props) => (props.sender === 'user' ? 'flex-end' : 'flex-start')};
`;

const MessageContent = styled.View`
    max-width: 85%;
    margin: 0 8px;
`;

const ModalContent = styled.View`
  background-color: white;
  padding: 24px;
  border-radius: 16px;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-family: 'Inter-Bold';
  margin-bottom: 16px;
  color: #1e293b;
`;

const ModalInput = styled.TextInput`
  background-color: #f0f4f8;
  border-radius: 12px;
  padding: 16px;
  min-height: 100px;
  font-size: 16px;
  margin-bottom: 24px;
  color: #1e293b;
  font-family: 'Inter-Regular';
`;

const ModalButtonContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const ModalButton = styled.TouchableOpacity`
  padding: 12px 20px;
  border-radius: 12px;
  margin-left: 12px;
  background-color: ${(props) => (props.primary ? '#0EA5A3' : '#e2e8f0')};
`;

const ModalButtonText = styled.Text`
  color: ${(props) => (props.primary ? 'white' : '#475569')};
  font-family: 'Inter-Bold';
`;

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [accessTrace, setAccessTrace] = useState([]);

  const flatListRef = useRef(null);

  useEffect(() => {
    async function loadAssets() {
      try {
        await Font.loadAsync({
          'Inter-Regular': require('./assets/fonts/Inter_18pt-Regular.ttf'),
          'Inter-Bold': require('./assets/fonts/Inter_18pt-Bold.ttf'),
        });
        setFontLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    }
    loadAssets();
  }, []);

  useEffect(() => {
    if (!fontLoaded) return;
    // ... initial message logic
  }, [fontLoaded]);

  const startThinkingForPrompt = async (promptText) => {
    setLoading(true);
    setIsTyping(true);
    setAccessTrace(buildAccessTrace(promptText));

    setTimeout(async () => {
      try {
        const botText = await getGeminiResponse(promptText);
        setMessages((prev) => [
          ...prev,
          { id: `m-${Date.now()}-bot`, sender: 'bot', text: botText, timestamp: new Date() },
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setIsTyping(false);
        setLoading(false);
      }
    }, 500);
  };

  const handleSend = async (textToSend = input) => {
    const userText = textToSend.trim();
    if (!userText || loading) return;

    const userMessage = {
      id: `m-${Date.now()}-user`,
      sender: 'user',
      text: userText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    await startThinkingForPrompt(userText);
  };
  
  const handleCopy = async (text) => {
   await Clipboard.setStringAsync(text);
 };

 const handleCopyChat = async () => {
    const chatText = messages.map(msg => `${msg.sender === 'user' ? 'You' : 'Carbeez'}: ${msg.text}`).join('\n\n');
    await Clipboard.setStringAsync(chatText);
 };

  const handleStartEdit = (message) => {
    setEditingMessage(message);
    setEditedText(message.text);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editingMessage || !editedText.trim()) return;

    const updatedMessages = messages.map(msg => 
      msg.id === editingMessage.id ? { ...msg, text: editedText, edited: true } : msg
    );
    
    const editedIndex = updatedMessages.findIndex(msg => msg.id === editingMessage.id);
    const finalMessages = updatedMessages.slice(0, editedIndex + 1);

    setMessages(finalMessages);
    
    setEditModalVisible(false);
    setEditingMessage(null);
    handleSend(editedText);
  };


  const renderMessageItem = ({ item }) => (
     <MessageRow sender={item.sender}>
        {item.sender === 'bot' && <FloatingAvatar kind="bot" />}
        <MessageContent>
            <MessageBubble 
              message={item} 
              onCopy={() => handleCopy(item.text)}
              onEdit={() => handleStartEdit(item)}
            />
        </MessageContent>
        {item.sender === 'user' && <FloatingAvatar kind="user" />}
    </MessageRow>
  );

  if (!fontLoaded) {
      return <ActivityIndicator size="large" style={{flex: 1}} color="#0EA5A3"/>
  }

  return (
    <AppContainer>
      <StatusBar barStyle="dark-content" />
      <GlassmorphicHeader onCopyChat={handleCopyChat} />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ItemSeparatorComponent={() => <View style={{height: 10}}/>}
        />

        {isTyping && (
             <MessageRow sender="bot">
                <FloatingAvatar kind="bot" />
                 <MessageContent>
                    <ThinkingBubble accessTrace={accessTrace} />
                </MessageContent>
            </MessageRow>
        )}
      </KeyboardAwareScrollView>

      <InputBar value={input} onChangeText={setInput} onSend={() => handleSend()} disabled={loading} />
      
      <Modal 
        isVisible={isEditModalVisible} 
        onBackdropPress={() => setEditModalVisible(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <ModalContent>
          <ModalTitle>Edit Prompt</ModalTitle>
          <ModalInput 
            value={editedText}
            onChangeText={setEditedText}
            multiline
            textAlignVertical="top"
          />
          <ModalButtonContainer>
            <ModalButton onPress={() => setEditModalVisible(false)}>
              <ModalButtonText>Cancel</ModalButtonText>
            </ModalButton>
            <ModalButton primary onPress={handleSaveEdit}>
              <ModalButtonText primary>Save & Resend</ModalButtonText>
            </ModalButton>
          </ModalButtonContainer>
        </ModalContent>
      </Modal>
    </AppContainer>
  );
};

export default App;
