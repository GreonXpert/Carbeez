// components/MessageBubble.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Clipboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';

const MessageBubble = ({ message }) => {
  if (!message || !message.text) {
    // Return null or a placeholder if the message is not valid
    return null;
  }

  const isUser = message.sender === 'user';
  // FIX: Provide a default empty array for chunks to prevent the 'map' error
  const chunks = message.text.split(/(`{3}[\s\S]*?`{3})/g) || [];

  const onShare = async () => {
    try {
      await Share.share({
        message: message.text,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const onCopy = () => {
    Clipboard.setString(message.text);
    // Optional: show a toast or feedback to the user
  };

  return (
    <View style={isUser ? styles.userMessageContainer : styles.botMessageContainer}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Markdown style={markdownStyles}>
          {message.text}
        </Markdown>
      </View>
      {!isUser && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onCopy} style={styles.button}>
            <MaterialIcons name="content-copy" size={18} color="#9e9e9e" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare} style={styles.button}>
            <MaterialIcons name="share" size={18} color="#9e9e9e" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ... (keep the rest of your styles unchanged)
const markdownStyles = {
  heading1: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    marginBottom: 10,
    marginTop: 10,
  },
  body: {
    color: '#E0E0E0',
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  },
  strong: {
    fontFamily: 'Inter_700Bold',
  },
  list_item: {
    color: '#E0E0E0',
    marginBottom: 8,
  },
  code_inline: {
    backgroundColor: '#2E2E2E',
    color: '#A5D6A7',
    fontFamily: 'monospace',
  },
  code_block: {
    backgroundColor: '#1E1E1E',
    color: '#A5D6A7',
    padding: 10,
    borderRadius: 8,
    fontFamily: 'monospace',
  },
  link: {
    color: '#81C784',
  },
};

const styles = StyleSheet.create({
  userMessageContainer: {
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  botMessageContainer: {
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: '#333333',
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: '#1E1E1E',
    borderBottomLeftRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 10,
  },
  button: {
    marginRight: 12,
    padding: 4,
  },
});

export default MessageBubble;