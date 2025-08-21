// screens/WelcomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const goToMainApp = () => {
    navigation.replace('MainApp');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <View style={styles.backgroundCircle} />
          <Image
            source={require('../assets/images/character.png')}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Hassle free shopping experience</Text>
          <Text style={styles.subtitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis lectus a nulla feugiat congue.
          </Text>
          <View style={styles.footer}>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={goToMainApp}>
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
    backgroundColor: '#fed7aa', // orange-200
  },
  container: {
    flex: 1,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fed7aa', // orange-200
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 450,
    alignItems: 'center',
    position: 'relative',
  },
  backgroundCircle: {
    position: 'absolute',
    top: 32,
    width: 320,
    height: 320,
    backgroundColor: '#fbbf24', // orange-300
    borderRadius: 160,
  },
  characterImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 400,
  },
  contentContainer: {
    padding: 32,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 30,
    color: '#374151', // gray-800
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    color: '#4b5563', // gray-600
    marginTop: 16,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 48,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: '#f97316', // orange-500
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  skipButton: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  skipButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#374151', // gray-700
    fontSize: 14,
  },
});

export default WelcomeScreen;