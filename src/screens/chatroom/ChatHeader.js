import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatHeader = ({ friend }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{friend}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  headerText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChatHeader;
