// components/ContactUs.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const CONTACT = {
  name: 'Mohamed Fazil',
  title: 'CTO & Founder',
  company: 'Greon Xpert',
  email: 'email@greonxpert.com',
  phone: '+91 98765 43210'
};

const ContactUs = () => {
  const navigation = useNavigation();

  const handleEmail = () => {
    Linking.openURL(`mailto:${CONTACT.email}`);
  };
  const handlePhone = () => {
    Linking.openURL(`tel:${CONTACT.phone}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00D1B2" />

      {/* Gradient Header */}
      <LinearGradient
        colors={['#00D1B2', '#00a27a', '#008a66']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact Us</Text>
          <View style={{ width: 32 }} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-circle-outline" size={64} color="#00D1B2" />
          </View>
          <Text style={styles.name}>{CONTACT.name}</Text>
          <Text style={styles.title}>{CONTACT.title}</Text>
          <Text style={styles.company}>{CONTACT.company}</Text>

          <View style={styles.divider} />

          {/* Contact methods */}
          <TouchableOpacity style={styles.contactBtn} onPress={handleEmail}>
            <Feather name="mail" size={20} color="#00D1B2" />
            <Text style={styles.contactText}>{CONTACT.email}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn} onPress={handlePhone}>
            <Feather name="phone-call" size={20} color="#00a27a" />
            <Text style={styles.contactText}>{CONTACT.phone}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.brandCard}>
          <Text style={styles.brandCardTitle}>Support Hours</Text>
          <Text style={styles.brandCardLine}><Feather name="clock" size={15} /> 09:00 AM – 06:00 PM (IST)</Text>
          <Text style={styles.brandCardLine}><Feather name="calendar" size={15} /> Monday – Saturday</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  headerGradient: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 26,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
  },
  backBtn: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  infoCard: {
    marginTop: -32,
    backgroundColor: 'rgba(255,255,255,0.89)',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.11,
    shadowRadius: 18,
    elevation: 4,
  },
  avatarCircle: {
    padding: 0,
    backgroundColor: "rgba(0,209,178,0.10)",
    borderRadius: 50,
    marginBottom: 8,
  },
  name: {
    fontSize: 23,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00D1B2',
    marginVertical: 2,
    letterSpacing: 0.1,
  },
  company: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 5,
    letterSpacing: 0.08,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 10,
    borderRadius: 8,
    width: '90%'
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 8,
    backgroundColor: 'rgba(0,209,178,0.08)',
    marginTop: 6,
    marginBottom: 2,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
    letterSpacing: 0.04,
  },
  brandCard: {
    marginTop: 30,
    padding: 18,
    width: '85%',
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    shadowColor: "#9CA3AF",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.09,
    shadowRadius: 5,
    borderWidth: 1.4,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  brandCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00D1B2',
    marginBottom: 8,
    letterSpacing: 0.16,
  },
  brandCardLine: {
    fontSize: 14,
    color: '#374151',
    marginVertical: 0,
    marginBottom: 3,
    fontWeight: "600"
  }
});

export default ContactUs;
