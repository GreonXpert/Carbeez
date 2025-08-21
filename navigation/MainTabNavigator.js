// navigation/MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Carbon') {
            iconName = 'cloud';
          } else if (route.name === 'ESG') {
            iconName = 'business';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
            backgroundColor: '#1a1a1a',
            borderTopColor: '#333'
        },
        headerShown: false
      })}
    >
      <Tab.Screen
        name="Carbon"
        component={ChatScreen}
        initialParams={{ consultantType: 'Carbon Consultant' }}
      />
      <Tab.Screen
        name="ESG"
        component={ChatScreen}
        initialParams={{ consultantType: 'ESG Consultant' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;