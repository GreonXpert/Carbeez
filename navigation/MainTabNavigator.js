// navigation/MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={{
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 34 : 20,
      left: 20,
      right: 20,
      height: 70,
      borderRadius: 35,
      overflow: 'hidden',
      shadowColor: '#00D1B2',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 15,
    }}>
      {/* Main Tab Bar Background */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(248, 253, 251, 0.9)']}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingHorizontal: 24,
          borderWidth: 1,
          borderColor: 'rgba(0, 209, 178, 0.08)',
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Icon configuration based on your tabs
          let iconName;
          if (route.name === 'Carbon') {
            iconName = 'cloud'; // Or 'eco' for environmental theme
          } else if (route.name === 'ESG') {
            iconName = 'business'; // Or 'assessment' for ESG
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                position: 'relative',
              }}
              activeOpacity={0.8}
            >
              {/* Active Tab Circle Background - Matches your image */}
              {isFocused && (
                <View style={{
                  position: 'absolute',
                  width: 54,
                  height: 54,
                  borderRadius: 27,
                  backgroundColor: '#00D1B2',
                  shadowColor: '#00D1B2',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.25,
                  shadowRadius: 12,
                  elevation: 8,
                }} />
              )}
              
              {/* Icon */}
              <View style={{
                zIndex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <MaterialIcons
                  name={iconName}
                  size={26}
                  color={isFocused ? '#ffffff' : '#00D1B2'}
                  style={{
                    opacity: isFocused ? 1 : 0.75,
                  }}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
      
      {/* Subtle bottom accent line - matches your design */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: 'rgba(0, 209, 178, 0.06)',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
      }} />
    </View>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide default tab bar
      }}
    >
      <Tab.Screen
        name="Carbon"
        component={ChatScreen}
        initialParams={{ consultantType: 'Carbon Consultant' }}
        options={{
          tabBarLabel: 'Carbon',
        }}
      />
      <Tab.Screen
        name="ESG"
        component={ChatScreen}
        initialParams={{ consultantType: 'ESG Consultant' }}
        options={{
          tabBarLabel: 'ESG',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;