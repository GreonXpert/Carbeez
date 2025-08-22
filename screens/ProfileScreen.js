// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDataString = await AsyncStorage.getItem('@user_data');
      if (userDataString) {
        setUserData(JSON.parse(userDataString));
      }
    };
    fetchUserData();
  }, []);

  const ProfileOption = ({ icon, title, subtitle, onPress, iconBg }) => (
    <TouchableOpacity style={styles.modernOptionItem} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={22} color="#ffffff" />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.chevronContainer}>
        <MaterialIcons name="chevron-right" size={20} color="#d1d5db" />
      </View>
    </TouchableOpacity>
  );

  const StatCard = ({ number, label }) => (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const QuickAction = ({ icon, label, color, onPress }) => (
    <TouchableOpacity style={styles.quickActionBtn} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Feather name={icon} size={20} color="#ffffff" />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00D1B2" />
      
      {/* Header with Gradient Background */}
      <LinearGradient
        colors={['#00D1B2', '#00a27a', '#008a66']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <Feather name="edit-3" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Profile Info Section with Glassmorphism Effect */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarGlow}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarInitial}>
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Feather name="camera" size={16} color="#00D1B2" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{userData?.name || 'John Doe'}</Text>
          <Text style={styles.userEmail}>{userData?.email || 'john.doe@example.com'}</Text>
          <View style={styles.userBadge}>
            <Text style={styles.userRole}>Premium Member</Text>
          </View>
          
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatCard number="24" label="Projects" />
            <StatCard number="1.2k" label="Followers" />
            <StatCard number="456" label="Following" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Quick Actions with Modern Design */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <QuickAction 
              icon="settings" 
              label="Settings" 
              color="#6366f1" 
              onPress={() => navigation.navigate('Settings')}
            />
            <QuickAction 
              icon="bookmark" 
              label="Saved" 
              color="#f59e0b" 
              onPress={() => navigation.navigate('Saved')}
            />
            <QuickAction 
              icon="heart" 
              label="Liked" 
              color="#ef4444" 
              onPress={() => navigation.navigate('Liked')}
            />
            <QuickAction 
              icon="share-2" 
              label="Share" 
              color="#8b5cf6" 
              onPress={() => navigation.navigate('Share')}
            />
          </View>
        </View>

        {/* Menu Options with Modern Cards */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Account & Settings</Text>
          
          <View style={styles.menuCard}>
            <ProfileOption 
              icon="person-outline" 
              title="Personal Information" 
              subtitle="Update your profile details"
              iconBg="#00D1B2"
              onPress={() => navigation.navigate('PersonalInfo')} 
            />
            <View style={styles.divider} />
            
            <ProfileOption 
              icon="lock-closed-outline" 
              title="Privacy & Security" 
              subtitle="Manage your account security"
              iconBg="#6366f1"
              onPress={() => navigation.navigate('PrivacySecurity')} 
            />
            <View style={styles.divider} />
            
            <ProfileOption 
              icon="notifications-outline" 
              title="Notifications" 
              subtitle="Configure alert preferences"
              iconBg="#f59e0b"
              onPress={() => navigation.navigate('Notifications')} 
            />
            <View style={styles.divider} />
            
            <ProfileOption 
              icon="card-outline" 
              title="Payment Methods" 
              subtitle="Manage billing information"
              iconBg="#10b981"
              onPress={() => navigation.navigate('PaymentMethods')} 
            />
          </View>

          <View style={styles.menuCard}>
            <ProfileOption 
              icon="help-circle-outline" 
              title="Help Center" 
              subtitle="Get support and assistance"
              iconBg="#8b5cf6"
              onPress={() => navigation.navigate('HelpCenter')} 
            />
            <View style={styles.divider} />
            
            <ProfileOption 
              icon="call-outline" 
              title="Contact Us" 
              subtitle="Reach out to our team"
              iconBg="#ef4444"
              onPress={() => navigation.navigate('ContactUs')} 
            />
            <View style={styles.divider} />
            
            <ProfileOption 
              icon="information-circle-outline" 
              title="About App" 
              subtitle="Version 2.1.0"
              iconBg="#6b7280"
              onPress={() => navigation.navigate('About')} 
            />
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton}>
            <Feather name="log-out" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  headerGradient: {
    paddingBottom: 30,
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarGlow: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 36,
    color: '#00D1B2',
    fontWeight: '800',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  userBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 24,
  },
  userRole: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionBtn: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  modernOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '400',
  },
  chevronContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 80,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fee2e2',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 8,
  },
});

export default ProfileScreen;
