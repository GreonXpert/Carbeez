// components/GlassmorphicHeader.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import FloatingAvatar from './FloatingAvatar';

// Fix: Added `actions = []` to provide a default empty array
const GlassmorphicHeader = ({ title, actions = [] }) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        <FloatingAvatar />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.actionsContainer}>
          {/* This line will no longer crash because actions is now an empty array by default */}
          {actions.map((action, index) => (
            <TouchableOpacity key={index} onPress={action.onPress} style={styles.actionButton}>
              <MaterialIcons name={action.icon} size={24} color="#FFF" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 50, 
    height: 110,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
    padding: 8,
  },
});

export default GlassmorphicHeader;