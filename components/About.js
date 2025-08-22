// components/About.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  Linking,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const teamMembers = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Chief Technology Officer',
    expertise: 'AI & Machine Learning',
    icon: 'cpu',
    color: '#00D1B2'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Lead Carbon Analyst',
    expertise: 'Environmental Science',
    icon: 'leaf',
    color: '#00a27a'
  },
  {
    name: 'Emma Thompson',
    role: 'UX Design Director',
    expertise: 'Human-Centered Design',
    icon: 'palette',
    color: '#6366f1'
  },
  {
    name: 'David Kim',
    role: 'Data Science Lead',
    expertise: 'Climate Analytics',
    icon: 'trending-up',
    color: '#f59e0b'
  }
];

const features = [
  {
    title: 'AI-Powered Analytics',
    description: 'Advanced machine learning algorithms for accurate carbon footprint calculation',
    icon: 'zap',
    color: '#00D1B2',
    metrics: '99.5% Accuracy'
  },
  {
    title: 'Real-time Monitoring',
    description: 'Continuous tracking of emissions across all business operations',
    icon: 'activity',
    color: '#00a27a',
    metrics: '24/7 Tracking'
  },
  {
    title: 'Global Standards',
    description: 'Compliance with GHG Protocol, ISO 14064-1:2018, and TCFD frameworks',
    icon: 'globe',
    color: '#6366f1',
    metrics: '15+ Standards'
  },
  {
    title: 'Predictive Insights',
    description: 'Future emission trends and optimization recommendations',
    icon: 'brain',
    color: '#f59e0b',
    metrics: 'Smart Forecasting'
  }
];

const achievements = [
  { label: 'Companies Served', value: '2,500+', icon: 'building' },
  { label: 'CO₂ Tracked', value: '50M+ Tons', icon: 'trending-down' },
  { label: 'Countries Active', value: '45+', icon: 'map' },
  { label: 'Awards Won', value: '12+', icon: 'award' }
];

const About = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('overview');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleSocialPress = (platform) => {
    const urls = {
      website: 'https://carbeez.com',
      linkedin: 'https://linkedin.com/company/carbeez',
      twitter: 'https://twitter.com/carbeez',
      email: 'mailto:hello@carbeez.com'
    };
    
    if (urls[platform]) {
      Linking.openURL(urls[platform]).catch(() => 
        Alert.alert('Error', 'Could not open link')
      );
    }
  };

  const TabButton = ({ id, title, icon }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === id && styles.activeTabButton]}
      onPress={() => setActiveTab(id)}
    >
      <Feather 
        name={icon} 
        size={18} 
        color={activeTab === id ? '#ffffff' : '#6B7280'} 
      />
      <Text style={[styles.tabText, activeTab === id && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const FeatureCard = ({ feature }) => (
    <View style={styles.featureCard}>
      <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
        <Feather name={feature.icon} size={24} color="#ffffff" />
      </View>
      <View style={styles.featureContent}>
        <View style={styles.featureHeader}>
          <Text style={styles.featureTitle}>{feature.title}</Text>
          <View style={styles.featureMetric}>
            <Text style={styles.featureMetricText}>{feature.metrics}</Text>
          </View>
        </View>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
    </View>
  );

  const TeamMember = ({ member }) => (
    <View style={styles.teamMember}>
      <View style={[styles.memberAvatar, { backgroundColor: member.color }]}>
        <Feather name={member.icon} size={24} color="#ffffff" />
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberRole}>{member.role}</Text>
        <Text style={styles.memberExpertise}>{member.expertise}</Text>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View>
            {/* Mission Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#00D1B2' }]}>
                  <Feather name="target" size={20} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Our Mission</Text>
              </View>
              <Text style={styles.missionText}>
                To democratize carbon intelligence through cutting-edge AI technology, 
                empowering businesses of all sizes to measure, manage, and reduce their 
                environmental impact with unprecedented accuracy and ease.
              </Text>
              <View style={styles.visionCard}>
                <Text style={styles.visionTitle}>🌍 Vision 2030</Text>
                <Text style={styles.visionText}>
                  A carbon-neutral world where every business decision is informed by 
                  real-time environmental impact data.
                </Text>
              </View>
            </View>

            {/* Achievements */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#00a27a' }]}>
                  <Feather name="trending-up" size={20} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Impact Metrics</Text>
              </View>
              <View style={styles.achievementsGrid}>
                {achievements.map((achievement, index) => (
                  <View key={index} style={styles.achievementCard}>
                    <View style={styles.achievementIcon}>
                      <Feather name={achievement.icon} size={20} color="#00D1B2" />
                    </View>
                    <Text style={styles.achievementValue}>{achievement.value}</Text>
                    <Text style={styles.achievementLabel}>{achievement.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        );

      case 'features':
        return (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#6366f1' }]}>
                <Feather name="layers" size={20} color="#ffffff" />
              </View>
              <Text style={styles.sectionTitle}>Core Features</Text>
            </View>
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
            
            {/* Technology Stack */}
            <View style={styles.techSection}>
              <Text style={styles.techTitle}>🚀 Technology Stack</Text>
              <View style={styles.techGrid}>
                <View style={styles.techItem}>
                  <Text style={styles.techLabel}>AI/ML</Text>
                  <Text style={styles.techValue}>TensorFlow, PyTorch</Text>
                </View>
                <View style={styles.techItem}>
                  <Text style={styles.techLabel}>Cloud</Text>
                  <Text style={styles.techValue}>AWS, Azure</Text>
                </View>
                <View style={styles.techItem}>
                  <Text style={styles.techLabel}>Data</Text>
                  <Text style={styles.techValue}>Apache Spark, PostgreSQL</Text>
                </View>
                <View style={styles.techItem}>
                  <Text style={styles.techLabel}>Mobile</Text>
                  <Text style={styles.techValue}>React Native</Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 'team':
        return (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#f59e0b' }]}>
                <Feather name="users" size={20} color="#ffffff" />
              </View>
              <Text style={styles.sectionTitle}>Leadership Team</Text>
            </View>
            <Text style={styles.teamDescription}>
              Our diverse team of experts combines decades of experience in climate science, 
              AI technology, and sustainable business practices.
            </Text>
            {teamMembers.map((member, index) => (
              <TeamMember key={index} member={member} />
            ))}
            
            {/* Company Culture */}
            <View style={styles.cultureSection}>
              <Text style={styles.cultureTitle}>🌟 Our Values</Text>
              <View style={styles.valuesList}>
                <View style={styles.valueItem}>
                  <Text style={styles.valueEmoji}>🔬</Text>
                  <Text style={styles.valueText}>Scientific Rigor</Text>
                </View>
                <View style={styles.valueItem}>
                  <Text style={styles.valueEmoji}>🤝</Text>
                  <Text style={styles.valueText}>Transparency</Text>
                </View>
                <View style={styles.valueItem}>
                  <Text style={styles.valueEmoji}>⚡</Text>
                  <Text style={styles.valueText}>Innovation</Text>
                </View>
                <View style={styles.valueItem}>
                  <Text style={styles.valueEmoji}>🌱</Text>
                  <Text style={styles.valueText}>Sustainability</Text>
                </View>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

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
          <Text style={styles.headerTitle}>About Carbeez</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Feather name="share-2" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* App Info Section */}
        <Animated.View 
          style={[
            styles.appInfoSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.appLogo}>
            <LinearGradient
              colors={['#ffffff', '#f0f9ff']}
              style={styles.logoGradient}
            >
              <Feather name="activity" size={32} color="#00D1B2" />
            </LinearGradient>
          </View>
          <Text style={styles.appName}>Carbeez</Text>
          <Text style={styles.appTagline}>AI-Powered Carbon Intelligence</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version 2.1.0</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton id="overview" title="Overview" icon="info" />
        <TabButton id="features" title="Features" icon="zap" />
        <TabButton id="team" title="Team" icon="users" />
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderTabContent()}

          {/* Social Links */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#8b5cf6' }]}>
                <Feather name="link" size={20} color="#ffffff" />
              </View>
              <Text style={styles.sectionTitle}>Connect With Us</Text>
            </View>
            <View style={styles.socialContainer}>
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: '#0077b5' }]}
                onPress={() => handleSocialPress('linkedin')}
              >
                <Feather name="linkedin" size={20} color="#ffffff" />
                <Text style={styles.socialText}>LinkedIn</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: '#1da1f2' }]}
                onPress={() => handleSocialPress('twitter')}
              >
                <Feather name="twitter" size={20} color="#ffffff" />
                <Text style={styles.socialText}>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: '#00D1B2' }]}
                onPress={() => handleSocialPress('website')}
              >
                <Feather name="globe" size={20} color="#ffffff" />
                <Text style={styles.socialText}>Website</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: '#ea4335' }]}
                onPress={() => handleSocialPress('email')}
              >
                <Feather name="mail" size={20} color="#ffffff" />
                <Text style={styles.socialText}>Email</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2025 Carbeez Technologies Inc. All rights reserved.
            </Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.footerSeparator}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.footerSeparator}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Licenses</Text>
              </TouchableOpacity>
            </View>
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
  shareButton: {
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
  appInfoSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  appLogo: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    textAlign: 'center',
  },
  versionBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  versionText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: '#00D1B2',
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#ffffff',
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
  missionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '500',
  },
  visionCard: {
    backgroundColor: 'linear-gradient(135deg, #00D1B2, #00a27a)',
    backgroundColor: '#f0fdfa',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#00D1B2',
  },
  visionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  visionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    fontWeight: '500',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: (width - 80) / 2,
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f0fdfa',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#00D1B2',
    marginBottom: 4,
  },
  achievementLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  featureMetric: {
    backgroundColor: '#00D1B2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featureMetricText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '700',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    fontWeight: '500',
  },
  techSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  techTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  techItem: {
    width: (width - 104) / 2,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  techLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00D1B2',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  techValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  teamDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
    fontWeight: '500',
  },
  teamMember: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
    color: '#00D1B2',
    fontWeight: '600',
    marginBottom: 2,
  },
  memberExpertise: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  cultureSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  cultureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 16,
  },
  valuesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  valueItem: {
    width: (width - 104) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  valueEmoji: {
    fontSize: 20,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    flex: 1,
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialButton: {
    width: (width - 80) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  socialText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLink: {
    fontSize: 12,
    color: '#00D1B2',
    fontWeight: '600',
  },
  footerSeparator: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default About;
