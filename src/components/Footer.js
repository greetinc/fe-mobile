import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Footer = ({ closeIconRef }) => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.circularButton} onPress={() => navigation.navigate('Likes')}>
        <Icon name="heart-outline" size={screenWidth * 0.06} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.circularButton} onPress={() => navigation.navigate('Subscribe')}>
        <Icon ref={closeIconRef} name="grid-outline" size={screenWidth * 0.06} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.circularButton} onPress={() => navigation.navigate('Home')}>
        <Icon name="locate-outline" size={screenWidth * 0.06} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.circularButton} onPress={() => navigation.navigate('Friends')}>
        <Icon name="chatbubbles-outline" size={screenWidth * 0.06} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.circularButton} onPress={() => navigation.navigate('Profile')}>
        <Icon name="person-outline" size={screenWidth * 0.06} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: screenHeight * 0.007,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: screenWidth * 0.05,
  },

  circularButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: screenWidth * 0.02,
  },
});

export default Footer;
