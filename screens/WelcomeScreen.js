// screens/WelcomeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// --- Data for the Onboarding Screens ---
const onboardingSteps = [
  {
    image: require('../assets/images/character.png'),
    title: 'Welcome to Carbeez!',
    subtitle: 'Your personal AI-powered guide to understanding and managing carbon emissions.',
    backgroundColor: '#E0F7FA', // Light Cyan
    circleColor: '#B2EBF2',   // Medium Cyan
    buttonColor: '#00ACC1',   // Dark Cyan
  },
  {
    image: require('../assets/images/character-2.png'),
    title: 'Track Your GHG Inventory',
    subtitle: 'Easily log and categorize your Scope 1, 2, and 3 emissions with expert guidance.',
    backgroundColor: '#E8F5E9', // Light Green
    circleColor: '#C8E6C9',   // Medium Green
    buttonColor: '#4CAF50',   // Dark Green
  },
  {
    image: require('../assets/images/character-3.png'),
    title: 'Achieve Your ESG Goals',
    subtitle: 'Get audit-ready reports and actionable insights to improve your sustainability profile.',
    backgroundColor: '#FFF3E0', // Light Orange
    circleColor: '#FFE0B2',   // Medium Orange
    buttonColor: '#FB8C00',   // Dark Orange
  },
];

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentStep = onboardingSteps[currentIndex];

   const handleNext = () => {
    if (currentIndex < onboardingSteps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login'); // Changed from 'MainApp' to 'Login'
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToMainApp = () => {
    navigation.replace('Login'); // Changed from 'MainApp' to 'Login'
  };


  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentStep.backgroundColor }]}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <View style={[styles.backgroundCircle, { backgroundColor: currentStep.circleColor }]} />
          <Image
            source={currentStep.image}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{currentStep.title}</Text>
          <Text style={styles.subtitle}>{currentStep.subtitle}</Text>

          {/* Progress Dots */}
          <View style={styles.dotsContainer}>
            {onboardingSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: index === currentIndex ? currentStep.buttonColor : '#D1D5DB' }
                ]}
              />
            ))}
          </View>

          <View style={styles.footer}>
            <View style={styles.buttonGroup}>
              {/* Back button is only visible after the first screen */}
              {currentIndex > 0 && (
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: currentStep.buttonColor }]}
                  onPress={handleBack}
                >
                  <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: currentStep.buttonColor }]}
                onPress={handleNext}
              >
                <MaterialIcons name="arrow-forward" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.skipButton} onPress={goToMainApp}>
              <Text style={styles.skipButtonText}>SKIP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  imageContainer: {
    flex: 0.55,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  backgroundCircle: {
    position: 'absolute',
    top: '15%',
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  characterImage: {
    width: '90%',
    height: '90%',
  },
  contentContainer: {
    flex: 0.45,
    padding: 32,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    color: '#4B5563',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  skipButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  skipButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#4B5563',
    fontSize: 14,
  },
});

export default WelcomeScreen;