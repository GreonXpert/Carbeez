// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('@user_data');
        if (userDataString) {
          setUserData(JSON.parse(userDataString));
        }
      } catch (e) {
        console.error("Failed to load user data.", e);
      }
    };
    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarInitial}>
            {userData?.name ? userData.name.charAt(0).toUpperCase() : ''}
          </Text>
        </View>
        <Text style={styles.userName}>{userData?.name}</Text>
        <Text style={styles.userEmail}>{userData?.email}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarInitial: {
    fontSize: 48,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
  },
});

export default ProfileScreen;