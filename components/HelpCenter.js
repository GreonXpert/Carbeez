// components/HelpCenter.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  Alert,
  Linking,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const faqs = [
  { 
    question: 'What is Carbeez?', 
    answer: 'Carbeez is an AI-powered carbon consultant designed to help you track, manage, and report your Greenhouse Gas (GHG) emissions according to international standards like GHG Protocol and ISO 14064-1:2018.',
    category: 'General'
  },
  { 
    question: 'Which standards do you follow?', 
    answer: 'We follow the GHG Protocol Corporate Standard and ISO 14064-1:2018 for GHG inventories. Our platform ensures compliance with international emission reporting standards.',
    category: 'Standards'
  },
  { 
    question: 'How do I change my password?', 
    answer: 'You can change your password from the "Privacy & Security" section in your profile. Navigate to Profile > Privacy & Security > Change Password.',
    category: 'Account'
  },
  { 
    question: 'How accurate are the emission calculations?', 
    answer: 'Our AI-powered calculations use the latest emission factors from IPCC and other recognized databases, ensuring accuracy within industry standards (±5% margin).',
    category: 'Technical'
  },
  { 
    question: 'Can I export my emission reports?', 
    answer: 'Yes! You can export detailed emission reports in PDF, Excel, or CSV formats directly from your dashboard. Premium users get additional customization options.',
    category: 'Reports'
  },
  { 
    question: 'Is my data secure?', 
    answer: 'Absolutely! We use enterprise-grade encryption, secure cloud storage, and comply with GDPR and other privacy regulations to protect your data.',
    category: 'Security'
  }
];

const supportOptions = [
  {
    title: 'Live Chat Support',
    subtitle: 'Get instant help from our experts',
    icon: 'message-circle',
    color: '#00D1B2',
    action: () => Alert.alert('Live Chat', 'Live chat feature coming soon!')
  },
  {
    title: 'Email Support',
    subtitle: 'Send us your questions anytime',
    icon: 'mail',
    color: '#00a27a',
    action: () => Linking.openURL('mailto:support@carbeez.com')
  },
  {
    title: 'Video Tutorials',
    subtitle: 'Learn with step-by-step guides',
    icon: 'play-circle',
    color: '#6366f1',
    action: () => Alert.alert('Tutorials', 'Video tutorials coming soon!')
  },
  {
    title: 'Community Forum',
    subtitle: 'Connect with other users',
    icon: 'users',
    color: '#f59e0b',
    action: () => Alert.alert('Forum', 'Community forum coming soon!')
  }
];

const FaqItem = ({ item, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleOpen = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsOpen(!isOpen);
  };

  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity onPress={toggleOpen} style={styles.questionContainer}>
        <View style={styles.questionContent}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.question}>{item.question}</Text>
        </View>
        <View style={[styles.expandIcon, { transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }]}>
          <Feather name="chevron-down" size={20} color="#00D1B2" />
        </View>
      </TouchableOpacity>
      
      <Animated.View style={[styles.answerContainer, { maxHeight: heightInterpolation }]}>
        <Text style={styles.answer}>{item.answer}</Text>
      </Animated.View>
    </View>
  );
};

const getCategoryColor = (category) => {
  const colors = {
    'General': '#00D1B2',
    'Standards': '#00a27a',
    'Account': '#6366f1',
    'Technical': '#f59e0b',
    'Reports': '#ef4444',
    'Security': '#8b5cf6'
  };
  return colors[category] || '#00D1B2';
};

const SupportOption = ({ option }) => (
  <TouchableOpacity style={styles.supportOption} onPress={option.action}>
    <View style={[styles.supportIcon, { backgroundColor: option.color }]}>
      <Feather name={option.icon} size={24} color="#ffffff" />
    </View>
    <View style={styles.supportContent}>
      <Text style={styles.supportTitle}>{option.title}</Text>
      <Text style={styles.supportSubtitle}>{option.subtitle}</Text>
    </View>
    <Feather name="chevron-right" size={20} color="#6B7280" />
  </TouchableOpacity>
);

const HelpCenter = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header with Gradient Background */}
      <LinearGradient
        colors={['#00D1B2', '#00a27a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Center</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Feather name="search" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>How can we help you?</Text>
          <Text style={styles.welcomeSubtitle}>
            Find answers to common questions or get in touch with our support team
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* Quick Support Options */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#00D1B2' }]}>
                <Feather name="headphones" size={20} color="#ffffff" />
              </View>
              <Text style={styles.sectionTitle}>Get Support</Text>
            </View>
            
            <View style={styles.supportGrid}>
              {supportOptions.map((option, index) => (
                <SupportOption key={index} option={option} />
              ))}
            </View>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#00a27a' }]}>
                <Feather name="help-circle" size={20} color="#ffffff" />
              </View>
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            </View>
            
            <View style={styles.faqContainer}>
              {filteredFaqs.map((faq, index) => (
                <FaqItem key={index} item={faq} index={index} />
              ))}
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#6366f1' }]}>
                <Feather name="phone" size={20} color="#ffffff" />
              </View>
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>
            
            <View style={styles.contactCard}>
              <View style={styles.contactItem}>
                <Feather name="mail" size={18} color="#00D1B2" />
                <Text style={styles.contactText}>support@carbeez.com</Text>
              </View>
              <View style={styles.contactItem}>
                <Feather name="phone" size={18} color="#00D1B2" />
                <Text style={styles.contactText}>+1 (555) 123-4567</Text>
              </View>
              <View style={styles.contactItem}>
                <Feather name="clock" size={18} color="#00D1B2" />
                <Text style={styles.contactText}>Mon-Fri, 9 AM - 6 PM EST</Text>
              </View>
            </View>
          </View>

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Carbeez v2.1.0 • Build 2025.08.22</Text>
          </View>
        </View>
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
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 30,
    elevation: 8,
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.6,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.3,
  },
  supportGrid: {
    gap: 12,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  supportSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  faqContainer: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: '#fafafa',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  questionContent: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  question: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  expandIcon: {
    marginLeft: 12,
    transition: 'transform 0.3s ease',
  },
  answerContainer: {
    overflow: 'hidden',
  },
  answer: {
    padding: 16,
    paddingTop: 0,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    fontWeight: '500',
  },
  contactCard: {
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  versionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default HelpCenter;
