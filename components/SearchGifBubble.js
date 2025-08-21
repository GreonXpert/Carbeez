// components/SearchGifBubble.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const SearchGifBubble = () => {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Image
          source={require('../assets/images/search.gif')}
          style={styles.gif}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  bubble: {
    backgroundColor: '#333333',
    borderRadius: 20,
    padding: 10,
    maxWidth: '70%',
  },
  gif: {
    width: 60,
    height: 60,
  },
});

export default SearchGifBubble;