// App.js
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomLoader from './components/CustomLoader';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainTabNavigator from './navigation/MainTabNavigator';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter_900Black': require('./assets/fonts/Inter_18pt-Black.ttf'),
    'Inter_400Regular': require('./assets/fonts/Inter_18pt-Regular.ttf'),
    // FIX: Corrected the path from './assets-fonts/' to './assets/fonts/'
    'Inter_700Bold': require('./assets/fonts/Inter_18pt-Bold.ttf'),
    'Inter_600SemiBold': require('./assets/fonts/Inter_18pt-SemiBold.ttf'),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Welcome');

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('@user_data');
        if (userData !== null) {
          setInitialRoute('MainApp');
        }
      } catch (e) {
        console.error("Failed to fetch user data from storage.", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  if (!fontsLoaded || isLoading) {
    return <CustomLoader />;
  }
   if (fontError) {
    console.error("Font loading error:", fontError);
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}