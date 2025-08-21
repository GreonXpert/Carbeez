// components/MessageBubble.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Share, Clipboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { LinearGradient } from 'expo-linear-gradient';

const MessageBubble = ({ message }) => {
  if (!message || !message.text) {
    return null;
  }

  const isUser = message.sender === 'user';

  const onShare = async () => {
    try {
      await Share.share({ message: message.text });
    } catch (error) {
      alert(error.message);
    }
  };

  const onCopy = () => {
    Clipboard.setString(message.text);
  };

  return (
    <View style={isUser ? styles.userMessageContainer : styles.botMessageContainer}>
      {isUser ? (
        <LinearGradient
          colors={['#004d40', '#00695c', '#004d40']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.userBubble]}
        >
          <View style={styles.userTextContainer}>
            <Markdown style={userMarkdownStyles}>{message.text}</Markdown>
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.botBubbleContainer}>
          <LinearGradient
            colors={['#ffffff', '#f8f9fa', '#ffffff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.bubble, styles.botBubble]}
          >
            <View style={styles.botTextContainer}>
              <Markdown style={botMarkdownStyles}>{message.text}</Markdown>
            </View>
          </LinearGradient>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onCopy} style={styles.button}>
              <LinearGradient
                colors={['#e8f5e8', '#f0f9ff']}
                style={styles.buttonGradient}
              >
                <MaterialIcons name="content-copy" size={20} color="#059669" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare} style={styles.button}>
              <LinearGradient
                colors={['#e8f5e8', '#f0f9ff']}
                style={styles.buttonGradient}
              >
                <MaterialIcons name="share" size={20} color="#059669" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// Enhanced markdown styles for user messages
const userMarkdownStyles = {
  body: {
    color: '#ffffff',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  heading1: {
    color: '#ffffff',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 24,
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heading2: {
    color: '#ffffff',
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    marginBottom: 10,
  },
  heading3: {
    color: '#ffffff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  strong: {
    fontFamily: 'Inter_700Bold',
    color: '#b2dfdb',
  },
  em: {
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
    color: '#e0f2f1',
  },
  list_item: {
    color: '#ffffff',
    marginBottom: 6,
    fontSize: 16,
  },
  code_inline: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#e0f2f1',
    fontFamily: 'monospace',
    fontSize: 14,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  code_block: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#ffffff',
    padding: 16,
    borderRadius: 12,
    fontFamily: 'monospace',
    fontSize: 14,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#b2dfdb',
  },
  link: {
    color: '#a7ffeb',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  blockquote: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#26a69a',
    paddingLeft: 16,
    paddingVertical: 8,
    marginVertical: 8,
    fontStyle: 'italic',
  },
};

// Enhanced markdown styles for bot messages
const botMarkdownStyles = {
  body: {
    color: '#1f2937',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  heading1: {
    color: '#004d40',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 24,
    marginBottom: 12,
    textShadowColor: 'rgba(0,77,64,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heading2: {
    color: '#00695c',
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    marginBottom: 10,
  },
  heading3: {
    color: '#00796b',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  strong: {
    fontFamily: 'Inter_700Bold',
    color: '#004d40',
  },
  em: {
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
    color: '#455a64',
  },
  list_item: {
    color: '#374151',
    marginBottom: 8,
    fontSize: 16,
    paddingLeft: 4,
  },
  code_inline: {
    backgroundColor: '#e8f5e8',
    color: '#059669',
    fontFamily: 'monospace',
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '600',
  },
  code_block: {
    backgroundColor: '#f0fdf4',
    color: '#047857',
    padding: 16,
    borderRadius: 12,
    fontFamily: 'monospace',
    fontSize: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#d1fae5',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  link: {
    color: '#059669',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  blockquote: {
    backgroundColor: '#f0fdfa',
    borderLeftWidth: 4,
    borderLeftColor: '#14b8a6',
    paddingLeft: 16,
    paddingVertical: 12,
    marginVertical: 10,
    borderRadius: 8,
    fontStyle: 'italic',
    color: '#0f766e',
  },
  table: {
    borderWidth: 1,
    borderColor: '#d1fae5',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
  },
  th: {
    backgroundColor: '#dcfce7',
    color: '#047857',
    fontFamily: 'Inter_600SemiBold',
    padding: 12,
  },
  td: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0fdf4',
    color: '#374151',
  },
};

const styles = StyleSheet.create({
  userMessageContainer: {
    alignItems: 'flex-end',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  botMessageContainer: {
    alignItems: 'flex-start',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  bubble: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxWidth: '88%',
    minWidth: '20%',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  userBubble: {
    borderBottomRightRadius: 8,
    shadowColor: '#004d4094',
  },
  botBubbleContainer: {
    alignItems: 'flex-start',
  },
  botBubble: {
    borderBottomLeftRadius: 8,
    shadowColor: '#059669',
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.1)',
  },
  userTextContainer: {
    position: 'relative',
  },
  botTextContainer: {
    position: 'relative',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
    marginLeft: 12,
    gap: 8,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonGradient: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.2)',
  },
});

export default MessageBubble;
