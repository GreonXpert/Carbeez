// screens/PaymentMethods.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const PREMIUM_FEATURES = [
  {
    icon: 'chat-bubble-outline',
    title: 'Unlimited Messages',
    subtitle: 'No daily message limits',
    color: '#00D1B2',
  },
  {
    icon: 'bookmark',
    title: 'Save Messages',
    subtitle: 'Save important conversations',
    color: '#00a27a',
  },
  {
    icon: 'share',
    title: 'Share Conversations',
    subtitle: 'Export & share with team',
    color: '#6366f1',
  },
  {
    icon: 'volume-up',
    title: 'Audio Responses',
    subtitle: 'Text-to-speech feature',
    color: '#f59e0b',
  },
  {
    icon: 'language',
    title: 'Advanced Multilingual',
    subtitle: 'Premium language models',
    color: '#ef4444',
  },
  {
    icon: 'priority-high',
    title: 'Priority Support',
    subtitle: '24/7 premium assistance',
    color: '#8b5cf6',
  },
  {
    icon: 'analytics',
    title: 'Advanced Analytics',
    subtitle: 'Detailed emission reports',
    color: '#00D1B2',
  },
  {
    icon: 'file-download',
    title: 'Export Capabilities',
    subtitle: 'PDF & Excel exports',
    color: '#00a27a',
  },
];

const PAYMENT_METHODS = [
  { id: 'card', icon: 'credit-card', name: 'Credit/Debit Card', subtitle: 'Visa, Mastercard, Amex' },
  { id: 'paypal', icon: 'account-balance-wallet', name: 'PayPal', subtitle: 'Secure PayPal payment' },
  { id: 'google', icon: 'google', name: 'Google Pay', subtitle: 'Pay with Google' },
  { id: 'apple', icon: 'phone-iphone', name: 'Apple Pay', subtitle: 'Touch ID or Face ID' },
];

const PaymentMethods = () => {
  const navigation = useNavigation();
  const [isPremium, setIsPremium] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [selectedPayment, setSelectedPayment] = useState('card');

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const premiumStatus = await AsyncStorage.getItem('@premium_status');
        setIsPremium(premiumStatus === 'true');
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    };
    checkPremiumStatus();
  }, []);

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to Premium',
      `Are you sure you want to upgrade to Premium ${selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'} plan?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upgrade',
          onPress: async () => {
            // Here you would integrate with actual payment processing
            await AsyncStorage.setItem('@premium_status', 'true');
            setIsPremium(true);
            Alert.alert('Success!', 'Welcome to Carbeez Premium! 🎉');
          }
        },
      ]
    );
  };

  const FeatureCard = ({ feature }) => (
    <View style={styles.featureCard}>
      <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
        <MaterialIcons name={feature.icon} size={24} color={feature.color} />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
      </View>
      <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
    </View>
  );

  const PlanCard = ({ planType, price, originalPrice, isPopular = false }) => (
    <TouchableOpacity
      style={[
        styles.planCard,
        selectedPlan === planType && styles.planCardSelected,
        isPopular && styles.planCardPopular
      ]}
      onPress={() => setSelectedPlan(planType)}
      activeOpacity={0.8}
    >
      {isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}
      
      <Text style={styles.planType}>
        {planType === 'monthly' ? 'Monthly' : 'Yearly'}
      </Text>
      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${price}</Text>
        <Text style={styles.pricePeriod}>/{planType === 'monthly' ? 'month' : 'year'}</Text>
      </View>
      
      {originalPrice && (
        <View style={styles.savingsContainer}>
          <Text style={styles.originalPrice}>${originalPrice}/year</Text>
          <Text style={styles.savings}>Save ${originalPrice - price}!</Text>
        </View>
      )}
      
      <Text style={styles.planDescription}>
        {planType === 'monthly' 
          ? 'Perfect for trying premium features'
          : 'Best value - 2 months free!'
        }
      </Text>
    </TouchableOpacity>
  );

  const PaymentMethodCard = ({ method }) => (
    <TouchableOpacity
      style={[
        styles.paymentCard,
        selectedPayment === method.id && styles.paymentCardSelected
      ]}
      onPress={() => setSelectedPayment(method.id)}
      activeOpacity={0.7}
    >
      <View style={styles.paymentIcon}>
        <MaterialIcons name={method.icon} size={24} color="#00D1B2" />
      </View>
      <View style={styles.paymentContent}>
        <Text style={styles.paymentName}>{method.name}</Text>
        <Text style={styles.paymentSubtitle}>{method.subtitle}</Text>
      </View>
      <View style={[
        styles.radioButton,
        selectedPayment === method.id && styles.radioButtonSelected
      ]}>
        {selectedPayment === method.id && (
          <View style={styles.radioButtonInner} />
        )}
      </View>
    </TouchableOpacity>
  );

  if (isPremium) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#00D1B2', '#00a27a']}
          style={styles.headerGradient}
        >
          <SafeAreaView>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Premium Status</Text>
              <View style={styles.headerRight} />
            </View>
          </SafeAreaView>
        </LinearGradient>

        <ScrollView style={styles.contentContainer}>
          <View style={styles.premiumStatusCard}>
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.statusGradient}
            >
              <MaterialIcons name="workspace-premium" size={64} color="#ffffff" />
              <Text style={styles.statusTitle}>Premium Member</Text>
              <Text style={styles.statusSubtitle}>Enjoying all premium features</Text>
            </LinearGradient>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Premium Features</Text>
            {PREMIUM_FEATURES.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00D1B2', '#00a27a']}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Upgrade to Premium</Text>
            <View style={styles.headerRight} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.contentContainer}>
        {/* Premium Features Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="workspace-premium" size={28} color="#00D1B2" />
            <Text style={styles.sectionTitle}>Premium Features</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Unlock powerful features to enhance your carbon consulting experience
          </Text>
          
          {PREMIUM_FEATURES.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </View>

        {/* Pricing Plans */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          <View style={styles.plansContainer}>
            <PlanCard planType="monthly" price={11} />
            <PlanCard planType="yearly" price={110} originalPrice={132} isPopular={true} />
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {PAYMENT_METHODS.map((method, index) => (
            <PaymentMethodCard key={index} method={method} />
          ))}
        </View>

        {/* Upgrade Button */}
        <View style={styles.upgradeSection}>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={handleUpgrade}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#00D1B2', '#00a27a']}
              style={styles.upgradeGradient}
            >
              <MaterialIcons name="workspace-premium" size={24} color="#ffffff" />
              <Text style={styles.upgradeText}>
                Upgrade to Premium - ${selectedPlan === 'monthly' ? '11/month' : '110/year'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            Cancel anytime. Your subscription will be charged to your selected payment method.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
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
  },
  contentContainer: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  featureSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  plansContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#00D1B2',
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  planCardPopular: {
    borderColor: '#4CAF50',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  planType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    color: '#00D1B2',
  },
  pricePeriod: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 4,
  },
  savingsContainer: {
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#6b7280',
    textDecorationLine: 'line-through',
  },
  savings: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  planDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  paymentCardSelected: {
    borderColor: '#00D1B2',
    backgroundColor: '#f0fdfa',
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 209, 178, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentContent: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  paymentSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#00D1B2',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00D1B2',
  },
  upgradeSection: {
    padding: 20,
    paddingBottom: 40,
  },
  upgradeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  upgradeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  premiumStatusCard: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statusGradient: {
    padding: 40,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
});

export default PaymentMethods;
