// components/MessageBubble.js
import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Share, 
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';

const { width } = Dimensions.get('window');

const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  if (!message || !message.text) {
    return null;
  }

  const isUser = message.sender === 'user';

  const onShare = async () => {
    try {
      await Share.share({ 
        message: message.text,
        title: 'Shared from Carbeez AI'
      });
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (error) {
      Alert.alert('Share Error', error.message);
    }
  };

  const onCopy = async () => {
    try {
      await Clipboard.setStringAsync(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      Alert.alert('Copy Error', 'Failed to copy text');
    }
  };

  const onSave = () => {
    // You can implement save to favorites/bookmarks functionality here
    Alert.alert('Saved', 'Message saved to your bookmarks');
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
              <Markdown style={userMarkdownStyles}>{message.text}</Markdown>
            </View>
            {/* Glassmorphic overlay */}
            <View style={styles.userGlassOverlay} />
          </LinearGradient>
          
          {/* User message actions - minimal */}
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
              <Markdown style={botMarkdownStyles}>{message.text}</Markdown>
            </View>
            
            {/* Subtle border accent */}
            <View style={styles.botAccentBorder} />
          </LinearGradient>
          
          {/* Enhanced action buttons */}
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
                colors={['#fef3c7', '#fef7cd']}
                style={styles.buttonGradient}
              >
                <Feather name="bookmark" size={18} color="#d97706" />
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
  },
  code_inline: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    color: '#f0fdfa',
    fontFamily: 'Courier',
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
    fontFamily: 'Courier',
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
};

// Enhanced markdown styles for bot messages
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
  },
  heading3: {
    color: '#008a66',
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 19,
    marginBottom: 10,
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
  code_inline: {
    backgroundColor: '#f0fdfa',
    color: '#00D1B2',
    fontFamily: 'Courier',
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
    fontFamily: 'Courier',
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
};

const styles = StyleSheet.create({
  userMessageContainer: {
    alignItems: 'flex-end',
    marginVertical: 10,
    paddingHorizontal: 18,
  },
  botMessageContainer: {
    alignItems: 'flex-start',
    marginVertical: 10,
    paddingHorizontal: 18,
  },
  userWrapper: {
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  botWrapper: {
    alignItems: 'flex-start',
    maxWidth: '90%',
  },
  bubble: {
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 18,
    minWidth: '25%',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  userBubble: {
    borderBottomRightRadius: 8,
    shadowColor: '#00D1B2',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  botBubble: {
    borderBottomLeftRadius: 8,
    shadowColor: '#00D1B2',
    borderWidth: 2,
    borderColor: 'rgba(0, 209, 178, 0.1)',
  },
  userTextContainer: {
    position: 'relative',
    zIndex: 2,
  },
  botTextContainer: {
    position: 'relative',
    zIndex: 2,
  },
  userGlassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    borderBottomRightRadius: 8,
    zIndex: 1,
  },
  botAccentBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    backgroundColor: '#00D1B2',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 8,
  },
  userActions: {
    flexDirection: 'row',
    marginTop: 8,
    marginRight: 4,
  },
  userActionBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 14,
    marginLeft: 8,
    gap: 10,
  },
  actionButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonGradient: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 209, 178, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
});

export default MessageBubble;
