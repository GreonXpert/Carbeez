// components/PersonalInfo.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const FIELDS = [
  { key: 'name', label: 'Name', icon: 'user', iconColor: '#00D1B2' },
  { key: 'email', label: 'Email', icon: 'mail', iconColor: '#00a27a' },
  { key: 'age', label: 'Age', icon: 'calendar', iconColor: '#6366f1' },
  { key: 'address', label: 'Address', icon: 'map-pin', iconColor: '#f59e0b' },
  { key: 'job', label: 'Job Title', icon: 'briefcase', iconColor: '#ef4444' },
  { key: 'company', label: 'Company', icon: 'activity', iconColor: '#008a66' },
  { key: 'details', label: 'Details', icon: 'info', iconColor: '#374151' },
];

const DEFAULT_USER = {
  name: '',
  email: '',
  age: '',
  address: '',
  job: '',
  company: '',
  details: '',
};

const PersonalInfo = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(DEFAULT_USER);
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState(DEFAULT_USER);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('@user_data');
        if (userDataString) {
          const loaded = { ...DEFAULT_USER, ...JSON.parse(userDataString) };
          setUserData(loaded);
          setFields(loaded);
        }
      } catch (e) {
        console.error("Failed to load user data.", e);
      }
    };
    fetchUserData();
  }, []);

  const startEdit = () => {
    setFields(userData);
    setEditing(true);
  };

  const updateField = (key, value) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const saveData = async () => {
    const newUser = { ...fields };
    setUserData(newUser);
    setEditing(false);
    try {
      await AsyncStorage.setItem('@user_data', JSON.stringify(newUser));
    } catch (e) {
      console.error("Failed to save user data.", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00D1B2" />
      <LinearGradient
        colors={['#00D1B2', '#00a27a', '#008a66']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Information</Text>
          <TouchableOpacity onPress={editing ? saveData : startEdit} style={styles.editBtn}>
            <Feather name={editing ? "check" : "edit"} size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.infoCard}>
            {FIELDS.map(({ key, label, icon, iconColor }) => (
              <View key={key} style={styles.row}>
                <Feather name={icon} size={19} color={iconColor} style={styles.icon} />
                <View style={styles.infoTextBlock}>
                  <Text style={styles.label}>{label}</Text>
                  {editing ? (
                    <TextInput
                      style={[styles.value, styles.input]}
                      placeholder={`Enter ${label}`}
                      value={fields[key]}
                      onChangeText={value => updateField(key, value)}
                      placeholderTextColor="#9ca3af"
                      keyboardType={key === "age" ? "numeric" : "default"}
                      multiline={key === "details"}
                    />
                  ) : (
                    <Text style={styles.value}>{userData[key]?.trim() ? userData[key] : "N/A"}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  headerGradient: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 30,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtn: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.6,
  },
  infoCard: {
    marginTop: 20,
    marginHorizontal: 18,
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  icon: {
    marginRight: 14,
    marginTop: 2,
  },
  infoTextBlock: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00D1B2',
    marginBottom: 1,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.1,
    minHeight: 22,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 2,
    color: '#1A1A1A',
    backgroundColor: 'transparent',
  },
});

export default PersonalInfo;
