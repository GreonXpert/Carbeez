// components/ThinkingBubble.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomLoader from './CustomLoader';

const defaultSteps = [
  { icon: 'search', text: 'Analyzing request' },
  { icon: 'rule', text: 'Applying GHG Protocol' },
  { icon: 'checklist', text: 'Checking ISO 14064-1' },
  { icon: 'functions', text: 'Calculating emissions' },
];

const AnimatedChip = ({ step, delay, index, isVisible }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;
  const borderWidthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Reset values before starting animation
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      translateYAnim.setValue(20);
      
      // Entrance animation for the container
      const entranceAnimation = Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          delay: delay,
          easing: Easing.back(1.2),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 500,
          delay: delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);

      // Background color pulse animation
      const backgroundPulse = Animated.loop(
        Animated.sequence([
          Animated.timing(backgroundColorAnim, {
            toValue: 1,
            duration: 1500 + (index * 300),
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(backgroundColorAnim, {
            toValue: 0,
            duration: 1500 + (index * 300),
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      );

      // Border animation
      const borderAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(borderWidthAnim, {
            toValue: 1,
            duration: 2000 + (index * 200),
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(borderWidthAnim, {
            toValue: 0,
            duration: 2000 + (index * 200),
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      );

      entranceAnimation.start(() => {
        backgroundPulse.start();
        borderAnimation.start();
      });

      return () => {
        entranceAnimation.stop();
        backgroundPulse.stop();
        borderAnimation.stop();
      };
    } else {
      // Exit animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, delay, index]);

  const backgroundColorInterpolate = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0f2f1', '#f0fdfa'],
  });

  const borderWidthInterpolate = borderWidthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 3],
  });

  const borderColorInterpolate = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(5, 150, 105, 0.2)', 'rgba(5, 150, 105, 0.6)'],
  });

  // Always render the component, but control visibility with opacity and scale
  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          { translateY: translateYAnim },
        ],
        opacity: opacityAnim,
      }}
    >
      <Animated.View
        style={{
          backgroundColor: backgroundColorInterpolate,
          borderRadius: 20,
          padding: 12,
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 10,
          marginBottom: 10,
          borderWidth: borderWidthInterpolate,
          borderColor: borderColorInterpolate,
          shadowColor: '#059669',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <MaterialIcons name={step.icon} size={18} color="#004d40" />
        <ChipText>{step.text}</ChipText>
      </Animated.View>
    </Animated.View>
  );
};

const ThinkingBubble = ({ steps = defaultSteps }) => {
  const [showSteps, setShowSteps] = useState(false);
  const containerScaleAnim = useRef(new Animated.Value(0.8)).current;
  const containerOpacityAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const arrowRotateAnim = useRef(new Animated.Value(0)).current;
  const stepsContainerHeightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Container entrance animation
    Animated.parallel([
      Animated.spring(containerScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(containerOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Shimmer effect animation
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, []);

  const toggleSteps = () => {
    setShowSteps(!showSteps);
    
    // Rotate arrow animation
    Animated.timing(arrowRotateAnim, {
      toValue: showSteps ? 0 : 1,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();

    // Steps container height animation - Fixed height calculation
    Animated.timing(stepsContainerHeightAnim, {
      toValue: showSteps ? 0 : 1,
      duration: 400,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  };

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 350],
  });

  const arrowRotateInterpolate = arrowRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Increased height to accommodate all steps properly
  const stepsContainerHeight = stepsContainerHeightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150], // Increased from 120 to 150
  });

  const stepsContainerOpacity = stepsContainerHeightAnim.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale: containerScaleAnim }],
        opacity: containerOpacityAnim,
      }}
    >
      <BubbleContainer
        style={{
          // Add dynamic height based on content
          minHeight: showSteps ? 220 : 80,
        }}
      >
        <BubbleGradient
          colors={['#ffffff', '#f8f9fa', '#ffffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Shimmer overlay */}
          <ShimmerOverlay>
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                transform: [{ translateX: shimmerTranslateX }],
              }}
            >
              <LinearGradient
                colors={['transparent', 'rgba(5, 150, 105, 0.1)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: 100, height: '100%' }}
              />
            </Animated.View>
          </ShimmerOverlay>

          <HeaderRow>
            <CustomLoader />
            <ThinkingTextContainer>
              <ThinkingText>Thinking</ThinkingText>
              <DotsContainer>
                <AnimatedDot delay={0}>.</AnimatedDot>
                <AnimatedDot delay={200}>.</AnimatedDot>
                <AnimatedDot delay={400}>.</AnimatedDot>
              </DotsContainer>
            </ThinkingTextContainer>
            <TouchableOpacity 
              onPress={toggleSteps} 
              style={{ marginLeft: 'auto' }}
              activeOpacity={0.7}
            >
              <ArrowButton>
                <Animated.View
                  style={{
                    transform: [{ rotate: arrowRotateInterpolate }],
                  }}
                >
                  <MaterialIcons name="keyboard-arrow-down" size={24} color="#004d40" />
                </Animated.View>
              </ArrowButton>
            </TouchableOpacity>
          </HeaderRow>

          {/* Always render the container but control its visibility */}
          <Animated.View
            style={{
              height: stepsContainerHeight,
              opacity: stepsContainerOpacity,
              overflow: 'hidden',
            }}
          >
            <Divider />
            <ChipContainer>
              {steps.map((step, index) => (
                <AnimatedChip
                  key={index}
                  step={step}
                  index={index}
                  delay={index * 100}
                  isVisible={showSteps}
                />
              ))}
            </ChipContainer>
          </Animated.View>
        </BubbleGradient>
      </BubbleContainer>
    </Animated.View>
  );
};

const AnimatedDot = ({ children, delay }) => {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const dotAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    dotAnimation.start();

    return () => dotAnimation.stop();
  }, [delay]);

  return (
    <Animated.Text
      style={{
        opacity: opacityAnim,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#059669',
        marginLeft: 2,
      }}
    >
      {children}
    </Animated.Text>
  );
};

// Updated Styled Components with proper overflow handling
const BubbleContainer = styled.View`
  border-radius: 24px;
  width: 320px;
  elevation: 8;
  shadow-color: #004d40;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 12px;
  align-self: flex-start;
  margin: 12px 16px;
  border-width: 1px;
  border-color: rgba(5, 150, 105, 0.1);
`;

const BubbleGradient = styled(LinearGradient)`
  padding: 20px;
  border-radius: 24px;
  min-height: 60px;
`;

const ShimmerOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  border-radius: 24px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
  min-height: 40px;
`;

const ThinkingTextContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 12px;
  flex: 1;
`;

const ThinkingText = styled.Text`
  font-family: 'Inter_700Bold';
  font-size: 18px;
  color: #004d40;
`;

const DotsContainer = styled.View`
  flex-direction: row;
  margin-left: 4px;
`;

const ArrowButton = styled.View`
  padding: 8px;
  border-radius: 20px;
  background-color: rgba(5, 150, 105, 0.1);
  border-width: 1px;
  border-color: rgba(5, 150, 105, 0.2);
`;

const Divider = styled.View`
  height: 1px;
  background-color: rgba(5, 150, 105, 0.2);
  margin-bottom: 16px;
  margin-top: 8px;
  border-radius: 1px;
`;

const ChipContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  min-height: 60px;
`;

const ChipText = styled.Text`
  font-family: 'Inter_500Medium';
  font-size: 13px;
  color: #004d40;
  margin-left: 8px;
  font-weight: 600;
`;

export default ThinkingBubble;
