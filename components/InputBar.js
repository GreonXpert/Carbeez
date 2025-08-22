// components/InputBar.js
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const InputBar = ({ value, onChangeText, onSend, isLoading }) => {
  return (
    // Use SafeAreaView to handle the bottom notch on iOS
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder="Type your message..."
          placeholderTextColor="#9CA3AF"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={onSend}
          disabled={isLoading || value.trim().length === 0}
        >
          <MaterialIcons
            name="send"
            size={24}
            color={value.trim().length > 0 ? '#FFFFFF' : '#f3efefff'}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120, // Allow for multiple lines
    paddingHorizontal: 16,
    paddingVertical: Platform.select({ ios: 12, android: 8 }),
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    fontSize: 16,
    color: '#111827',
  },
  sendButton: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0EA5A3',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InputBar;