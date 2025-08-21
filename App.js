// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font'; // Correctly import useFonts
import { StatusBar } from 'expo-status-bar';

import CustomLoader from './components/CustomLoader';
import WelcomeScreen from './screens/WelcomeScreen';
import MainTabNavigator from './navigation/MainTabNavigator';

const Stack = createStackNavigator();

export default function App() {
  // Load fonts directly from your assets/fonts folder
  const [fontsLoaded, fontError] = useFonts({
    'Inter_900Black': require('./assets/fonts/Inter_18pt-Black.ttf'),
    'Inter_400Regular': require('./assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter_700Bold': require('./assets/fonts/Inter_18pt-Bold.ttf'),
    'Inter_600SemiBold': require('./assets/fonts/Inter_18pt-SemiBold.ttf'),
  });

  // You can log the error to the console for debugging if fonts fail to load
  if (fontError) {
    console.error("Font loading error:", fontError);
  }

  // Show the loader until the fonts are loaded
  if (!fontsLoaded && !fontError) {
    return <CustomLoader />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}