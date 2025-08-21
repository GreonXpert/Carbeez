// --------------------------------------------------
// components/CustomLoader.js (NEW FILE)
// --------------------------------------------------
import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

const Dot = ({ scale }) => {
  return (
    <Animated.View style={[styles.dot, { transform: [{ scale }] }]} />
  );
};

const CustomLoader = () => {
  const animations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const animate = (index) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations[index], {
          toValue: 1,
          duration: 600,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animations[index], {
          toValue: 0,
          duration: 600,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    const timers = [
      setTimeout(() => animate(0), 0),
      setTimeout(() => animate(1), 200),
      setTimeout(() => animate(2), 400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const scales = animations.map(anim => anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1, 0.5],
  }));

  return (
    <View style={styles.container}>
      <Dot scale={scales[0]} />
      <Dot scale={scales[1]} />
      <Dot scale={scales[2]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0EA5A3',
    marginHorizontal: 3,
  },
});

export default CustomLoader;
