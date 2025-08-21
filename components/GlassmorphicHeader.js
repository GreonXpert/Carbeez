// components/GlassmorphicHeader.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import FloatingAvatar from './FloatingAvatar';

// FIX: Provide default empty functions for the press handlers to prevent crashes
const GlassmorphicHeader = ({
  title,
  onProfilePress = () => {},
  onLogoutPress = () => {},
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleProfile = () => {
    setMenuVisible(false);
    onProfilePress(); // This is now safe to call
  };

  const handleLogout = () => {
    setMenuVisible(false);
    onLogoutPress(); // This is now safe to call
  };

  return (
    <>
      <View style={styles.container}>
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.content}>
          <FloatingAvatar />
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.actionButton}>
            <MaterialIcons name="person" size={28} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={handleProfile}>
                <MaterialIcons name="account-circle" size={22} color="#4B5563" style={styles.menuIcon} />
                <Text style={styles.menuText}>Profile</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <MaterialIcons name="logout" size={22} color="#EF4444" style={styles.menuIcon} />
                <Text style={[styles.menuText, { color: '#EF4444' }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
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
    color: '#000',
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  actionButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  menuContainer: {
    position: 'absolute',
    top: 100,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 8,
    width: 180,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
});

export default GlassmorphicHeader;