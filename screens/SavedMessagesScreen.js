// screens/SavedMessagesScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Markdown from 'react-native-markdown-display';
import ConversationViewModal from '../components/ConversationViewModal'; // ✅ NEW: Import modal

const { width, height } = Dimensions.get('window');

const SavedMessagesScreen = () => {
  const [savedMessages, setSavedMessages] = useState([]);
  const [savedChats, setSavedChats] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null); // ✅ NEW: Modal state
  const [modalVisible, setModalVisible] = useState(false); // ✅ NEW: Modal visibility
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        // Fetch individual saved messages
        const messagesString = await AsyncStorage.getItem('@saved_messages');
        if (messagesString) {
          setSavedMessages(JSON.parse(messagesString));
        }

        // Fetch saved complete chats
        const chatsString = await AsyncStorage.getItem('@saved_chats');
        if (chatsString) {
          const chats = JSON.parse(chatsString);
          console.log('📱 Loaded saved chats:', chats.length);
          setSavedChats(chats);
        }
      } catch (error) {
        console.error('Error fetching saved data:', error);
      }
    };

    if (isFocused) {
      fetchSavedData();
    }
  }, [isFocused]);

  const formatDateTime = (timestamp) => {
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

  const deleteMessage = async (messageId) => {
    const updatedMessages = savedMessages.filter(msg => msg.id !== messageId);
    setSavedMessages(updatedMessages);
    await AsyncStorage.setItem('@saved_messages', JSON.stringify(updatedMessages));
  };

  const deleteChat = async (chatId) => {
    const updatedChats = savedChats.filter(chat => chat.id !== chatId);
    setSavedChats(updatedChats);
    await AsyncStorage.setItem('@saved_chats', JSON.stringify(updatedChats));
  };

  // ✅ NEW: Handle conversation view
  const viewConversation = (conversation) => {
    setSelectedConversation(conversation);
    setModalVisible(true);
  };

  // ✅ NEW: Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedConversation(null);
  };

  // ✅ UPDATED: Render saved chat item with view button
  const renderChatItem = ({ item, index }) => (
    <View style={styles.messageCard}>
      {/* Chat Header */}
      <View style={styles.messageHeader}>
        <View style={styles.messageIcon}>
          <MaterialIcons name="chat" size={16} color="#00D1B2" />
        </View>
        <Text style={styles.messageIndex} numberOfLines={1}>{item.title}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteChat(item.id)}
        >
          <MaterialIcons name="delete" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Chat Content Preview */}
      <View style={styles.messageContent}>
        <Text style={styles.chatPreview}>
          {item.messageCount} messages with {item.consultantType}
        </Text>
        <Text style={styles.chatDetails}>
          User: {item.userName}
        </Text>
      </View>

      {/* ✅ NEW: Action Buttons */}
      <View style={styles.chatActions}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => viewConversation(item)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#00D1B2', '#00a27a']}
            style={styles.viewButtonGradient}
          >
            <MaterialIcons name="visibility" size={16} color="#ffffff" />
            <Text style={styles.viewButtonText}>View Full Chat</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Chat Footer */}
      <View style={styles.messageFooter}>
        <View style={styles.timestampContainer}>
          <MaterialIcons name="access-time" size={12} color="#6b7280" />
          <Text style={styles.timestamp}>{formatDateTime(item.timestamp)}</Text>
        </View>
      </View>
    </View>
  );

  // Render individual message item (unchanged)
  const renderMessageItem = ({ item, index }) => (
    <View style={styles.messageCard}>
      {/* Message Header */}
      <View style={styles.messageHeader}>
        <View style={styles.messageIcon}>
          <MaterialIcons name="message" size={16} color="#00D1B2" />
        </View>
        <Text style={styles.messageIndex}>#{index + 1}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteMessage(item.id)}
        >
          <MaterialIcons name="delete" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Message Content */}
      <View style={styles.messageContent}>
        <Markdown style={markdownStyles}>{item.text || 'No content'}</Markdown>
      </View>

      {/* Message Footer */}
      <View style={styles.messageFooter}>
        <View style={styles.timestampContainer}>
          <MaterialIcons name="access-time" size={12} color="#6b7280" />
          <Text style={styles.timestamp}>{formatDateTime(item.timestamp)}</Text>
        </View>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyIconContainer}>
        <LinearGradient
          colors={['#00D1B2', '#00a27a']}
          style={styles.emptyIconGradient}
        >
          <MaterialIcons name="chat-bubble-outline" size={48} color="#ffffff" />
        </LinearGradient>
      </View>
      <Text style={styles.emptyTitle}>No Saved Data</Text>
      <Text style={styles.emptySubtitle}>
        Save important messages or entire conversations{'\n'}to access them anytime here.
      </Text>
      <TouchableOpacity
        style={styles.startChattingButton}
        onPress={() => navigation.goBack()}
      >
        <LinearGradient
          colors={['#00D1B2', '#00a27a']}
          style={styles.startChattingGradient}
        >
          <MaterialIcons name="chat" size={20} color="#ffffff" />
          <Text style={styles.startChattingText}>Start Chatting</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Gradient Background */}
      <LinearGradient
        colors={['#00D1B2', '#00a27a']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Saved Data</Text>

          <View style={styles.headerRight}>
            <View style={styles.messageCountBadge}>
              <Text style={styles.messageCountText}>
                {savedMessages.length + savedChats.length}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.contentContainer}>
        {savedMessages.length > 0 || savedChats.length > 0 ? (
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {/* Show Saved Chats First */}
            {savedChats.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>💬 Saved Conversations</Text>
                <FlatList
                  data={savedChats}
                  renderItem={renderChatItem}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                />
              </>
            )}

            {/* Show Individual Messages */}
            {savedMessages.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>📝 Individual Messages</Text>
                <FlatList
                  data={savedMessages}
                  renderItem={renderMessageItem}
                  keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                  scrollEnabled={false}
                />
              </>
            )}
          </ScrollView>
        ) : (
          <EmptyState />
        )}
      </View>

      {/* ✅ NEW: Conversation View Modal */}
      <ConversationViewModal
        visible={modalVisible}
        onClose={closeModal}
        conversation={selectedConversation}
      />
    </SafeAreaView>
  );
};

const markdownStyles = {
  body: {
    color: '#1f2937',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  heading1: {
    color: '#00D1B2',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  heading2: {
    color: '#00a27a',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 8,
  },
  strong: {
    color: '#00D1B2',
    fontWeight: '700',
  },
  list_item: {
    color: '#1f2937',
    fontSize: 15,
  },
  code_inline: {
    backgroundColor: '#f3f4f6',
    color: '#00a27a',
    fontSize: 14,
    fontWeight: '600',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  headerGradient: {
    paddingBottom: 20,
    elevation: 8,
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerRight: {
    width: 40,
    alignItems: 'center',
  },
  messageCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  messageCountText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  messageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  messageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 209, 178, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageIndex: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageFooter: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  chatPreview: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00D1B2',
    marginBottom: 4,
  },
  chatDetails: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  // ✅ NEW: Chat action styles
  chatActions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  viewButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  viewButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  startChattingButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  startChattingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  startChattingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SavedMessagesScreen;
