// components/ConversationViewModal.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Markdown from 'react-native-markdown-display';

const { width, height } = Dimensions.get('window');

const ConversationViewModal = ({ visible, onClose, conversation }) => {
  const flatListRef = useRef(null);

  if (!conversation) return null;

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessage = ({ item, index }) => {
    const isUser = item.sender === 'user';
    const isAudioMessage = item.type === 'audio';

    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.botMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.botBubble
        ]}>
          {isUser ? (
            <LinearGradient
              colors={['#00D1B2', '#00a27a']}
              style={styles.userGradient}
            >
              <View style={styles.messageContent}>
                {isAudioMessage ? (
                  <View style={styles.audioMessage}>
                    <MaterialIcons name="mic" size={16} color="#ffffff" />
                    <Text style={styles.audioText}>
                      Audio message ({item.duration}s)
                    </Text>
                  </View>
                ) : (
                  <Markdown style={userMarkdownStyles}>
                    {item.text}
                  </Markdown>
                )}
              </View>
            </LinearGradient>
          ) : (
            <View style={styles.botContent}>
              <View style={styles.botAccent} />
              {isAudioMessage ? (
                <View style={styles.audioMessage}>
                  <MaterialIcons name="mic" size={16} color="#00D1B2" />
                  <Text style={styles.audioTextBot}>
                    Audio message ({item.duration}s)
                  </Text>
                </View>
              ) : (
                <Markdown style={botMarkdownStyles}>
                  {item.text}
                </Markdown>
              )}
            </View>
          )}
          
          <Text style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.botTimestamp
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#00D1B2" />
        
        {/* Header */}
        <LinearGradient
          colors={['#00D1B2', '#00a27a']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <MaterialIcons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {conversation.title}
              </Text>
              <Text style={styles.headerSubtitle}>
                {conversation.messageCount} messages • {formatDate(conversation.timestamp)}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.scrollToBottomButton}
              onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}
              activeOpacity={0.7}
            >
              <MaterialIcons name="keyboard-arrow-down" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Messages List */}
        <View style={styles.messagesContainer}>
          <FlatList
            ref={flatListRef}
            data={conversation.messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => item.id || index.toString()}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            initialScrollIndex={conversation.messages.length > 0 ? conversation.messages.length - 1 : 0}
            getItemLayout={(data, index) => ({
              length: 100, // Approximate message height
              offset: 100 * index,
              index,
            })}
            onScrollToIndexFailed={() => {
              // Fallback if scrollToIndex fails
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: false });
              }, 100);
            }}
          />
        </View>

        {/* Footer Info */}
        <BlurView intensity={95} style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerInfo}>
              <MaterialIcons name="person" size={16} color="#00D1B2" />
              <Text style={styles.footerText}>
                Conversation with {conversation.userName}
              </Text>
            </View>
            <View style={styles.footerInfo}>
              <MaterialIcons name="smart-toy" size={16} color="#00D1B2" />
              <Text style={styles.footerText}>
                {conversation.consultantType}
              </Text>
            </View>
          </View>
        </BlurView>
      </SafeAreaView>
    </Modal>
  );
};

// Markdown Styles
const userMarkdownStyles = {
  body: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  heading1: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  heading2: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  strong: {
    color: '#ffffff',
    fontWeight: '700',
  },
  code_inline: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
};

const botMarkdownStyles = {
  body: {
    color: '#1f2937',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  heading1: {
    color: '#00D1B2',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  heading2: {
    color: '#00a27a',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  strong: {
    color: '#00D1B2',
    fontWeight: '700',
  },
  code_inline: {
    backgroundColor: '#f3f4f6',
    color: '#00a27a',
    fontSize: 13,
    fontWeight: '600',
  },
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 56,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  scrollToBottomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 100,
  },
  messageContainer: {
    marginVertical: 8,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userBubble: {
    borderBottomRightRadius: 6,
  },
  botBubble: {
    borderBottomLeftRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0, 209, 178, 0.1)',
  },
  userGradient: {
    padding: 16,
  },
  botContent: {
    padding: 16,
    position: 'relative',
  },
  botAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#00D1B2',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 6,
  },
  messageContent: {
    // Content wrapper
  },
  audioMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  audioTextBot: {
    color: '#00D1B2',
    fontSize: 14,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '500',
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  botTimestamp: {
    color: '#9ca3af',
    textAlign: 'left',
  },
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 209, 178, 0.1)',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default ConversationViewModal;
