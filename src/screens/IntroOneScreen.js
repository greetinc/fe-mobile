import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';

const IntroOneScreen = ({ navigation }) => {
  const slides = [
    {
      id: '1',
      image: require('../assets/images/intro1.png'),
      caption: 'Find new friends and swipe right to like.',
    },
    {
      id: '2',
      image: require('../assets/images/intro2.png'),
      caption: 'If they like you, you can "say hi" after a match.',
    },
    {
      id: '3',
      image: require('../assets/images/intro3.png'),
      caption: 'then you can arrange for a date.',

    },
  ];

  const handleContinue = () => {
    // Navigate to the login screen or any other screen you want
    navigation.navigate('Index');
  };

  return (
    <Swiper style={styles.wrapper} loop={false}>
      {slides.map((slide, index) => (
        <View key={slide.id} style={styles.slide}>
          <View style={styles.logoContainer}>
            <Image source={slide.image} style={styles.logo} />
            <Text style={styles.captionText}>{slide.caption}</Text>
           
          </View>
          {index === slides.length - 1 && (
              <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            )}
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingBottom: 40,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 5,
  },
  captionText: {
    fontSize: 16,
    color: '#333',
  },
  continueButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E92026',
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default IntroOneScreen;
