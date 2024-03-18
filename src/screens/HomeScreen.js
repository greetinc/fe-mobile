import React, { useState, useEffect } from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Animated, PanResponder, Dimensions, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../components/Footer.js';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [position] = useState(new Animated.ValueXY());
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTreeMenuVisible, setIsTreeMenuVisible] = useState(false);
  const [showStars, setShowStars] = useState([]);
  const SWIPE_THRESHOLD = 50;
  const SWIPE_OUT_THRESHOLD = 50;
  const heartIconRef = React.useRef(null);
  const closeIconRef = React.useRef(null);
  let isLogPrinted = false; // Flag untuk menandai apakah log telah dicetak
  const [imagePlace, setImage] = useState([]);
  const [hasSwipedRight, setHasSwipedRight] = useState(false); // New state variable
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD && !isLogPrinted) {
        console.log(gestureState.dx > 0 ? 'Swipe Right' : 'Swipe Left');
        isLogPrinted = true;
      }
      position.setValue({ x: gestureState.dx, y: 0 });
    },
    onPanResponderRelease: (evt, gestureState) => {
      isLogPrinted = false;
      if (gestureState.dx > SWIPE_THRESHOLD) {
        forceSwipe('right');
      } else if (gestureState.dx < -SWIPE_THRESHOLD) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    },
  });

  useEffect(() => {
    setHasSwipedRight(false); // Reset hasSwipedRight when currentIndex changes
  }, [currentIndex]);


  const forceSwipe = (direction) => {
    if (direction === 'right' && !hasSwipedRight) {
      setHasSwipedRight(true);
      const x = SWIPE_OUT_THRESHOLD;
      Animated.timing(position, {
        toValue: { x, y: 0 },
        duration: 250,
        useNativeDriver: false,
      }).start(() => {
        handleSwipeComplete(direction);
      });
    } else if (direction === 'left') {
      const x = -SWIPE_OUT_THRESHOLD; // Atur nilai x negatif untuk swipe ke kiri
      Animated.timing(position, {
        toValue: { x, y: 0 },
        duration: 250,
        useNativeDriver: false,
      }).start(() => {
        handleSwipeComplete(direction);
      });
    }
  };
  
  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start(() => {
      setHasSwipedRight(false);
      if (position.x._value < 0) {
        // Hanya perbarui currentIndex jika swipe kiri
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    });
  };

  const handleSwipeComplete = (direction) => {
    if (direction === 'right') {
      handleHeartIconPress();
    }
    setCurrentIndex((prevIndex) => prevIndex + 1);
    position.setValue({ x: 0, y: 0 });
  };

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await axios.get('http://192.168.43.250:8080/api/v1/user/find', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setUsers(response.data);

      } else {
        Alert.alert('Fetch Data Failed', 'Unexpected response from the server.');
      }
    } catch (error) {
      Alert.alert('Fetch Data Failed', 'An error occurred while fetching the data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleTreeMenu = () => {
    setIsTreeMenuVisible(!isTreeMenuVisible);
  };

  const goToPreviousUser = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      position.setValue({ x: 0, y: 0 });
    }
  };

  const handleHeartIconPress = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await axios.post('http://192.168.43.250:8080/api/v1/user/find/swipe', {
        like_id: users[currentIndex]?.id, // Assuming each user object has an 'id' property
        action: 'like', // or 'dislike' based on your backend requirements
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
      } else {
        Alert.alert('Swipe Failed', 'Unexpected response from the server.');
      }
    } catch (error) {
      Alert.alert('Swipe Failed', 'An error occurred while processing the swipe.');
    }
  };

  const fetchUserProfile = async (profile_id) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await axios.get(`http://192.168.43.250:8080/api/v1/profile/${profile_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      
      if (response.status === 200) {
        // Handle the data from the API response
        console.log('User Profile:', response.data);
        navigation.navigate('ProfileView', { profile_id });

      } else {
        Alert.alert('Fetch Profile Failed', 'Unexpected response from the server.');
      }
    } catch (error) {
      Alert.alert('Fetch Profile Failed', 'An error occurred while fetching the profile.');
    }
  };

  const handleProfileClick = (profile_id) => {
    fetchUserProfile(profile_id);
    // Additional logic for handling the click, e.g., navigation or other actions
  };  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Home</Text>
        <TouchableOpacity onPress={toggleTreeMenu}>
          <Icon name="menu" size={screenWidth * 0.05} color="#000" />
        </TouchableOpacity>
      </View>
      {isTreeMenuVisible && (
        <View style={styles.treeMenu}>
          <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
            <Text>Setting</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
            <Text>Match</Text>
          </TouchableOpacity>
          <Text>Menu 3</Text>
        </View>
      )}

<Animated.View
  {...panResponder.panHandlers}
  style={[
    styles.cardStyle,
    position.getLayout(),
    {
      transform: [
        {
          rotate: position.x.interpolate({
            inputRange: [-300, 0, 300],
            outputRange: ["-50deg", "0deg", "50deg"],
            extrapolate: "clamp",
          }),
        },
      ],
    },
  ]}
>
<TouchableWithoutFeedback onPress={() => handleProfileClick(users[currentIndex]?.profile_id)}>
  {users[currentIndex]?.profile_picture?.file_path ? (
    // Log image information
    console.log('Image Information:', `http://192.168.43.250:8080/${users[currentIndex]?.profile_picture?.file_path}`) ||

    <Image
      source={{ uri: `http://192.168.43.250:8080/${users[currentIndex]?.profile_picture?.file_path}` }}
      style={styles.cardImage}
    />
  ) : (
    <Text>No Image Available</Text>
  )}
</TouchableWithoutFeedback>
  <View style={styles.nameAgeContainer}>
    <Text style={styles.fullNameText}>{users[currentIndex]?.full_name || 'Swipe me!' }, </Text>
    <Text style={styles.ageText}>{users[currentIndex]?.age}</Text>
  </View>
  
  <View style={styles.distanceContainer}>
  <Text style={styles.distanceText}>{users[currentIndex]?.distance}</Text>
  </View>

  
  {showStars[currentIndex] && (
    <Animated.View style={[styles.starIcon, {
      transform: [{
        rotate: position.x.interpolate({
          inputRange: [-300, 0, 300],
          outputRange: ["-360deg", "0deg", "360deg"],
          extrapolate: "clamp",
        }),
      }]
    }]}>
      <Icon name="star" size={screenWidth * 0.1} color="#48cf91" />
    </Animated.View>
  )}

</Animated.View>

      <View style={styles.newFooter}>
      <TouchableOpacity style={styles.circularButton} onPress={goToPreviousUser}>
          <Icon name="arrow-undo" size={screenWidth * 0.06} color="#b899ba" />
        </TouchableOpacity>
      <TouchableOpacity 
        style={styles.heartcloseButton} onPress={() => {forceSwipe('left'); }} >
        <Icon ref={closeIconRef}name="close" size={screenWidth * 0.08} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.circularButton} onPress={() => {
          const newShowStars = [...showStars];
          newShowStars[currentIndex] = true;
          setShowStars(newShowStars);
          setTimeout(() => {
            newShowStars[currentIndex] = false;
            setShowStars(newShowStars);
          }, 3000);
        }}>
          <Icon name="star" size={screenWidth * 0.06} color="#48cf91" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.heartHeartButton} 
          onPress={() => {
            forceSwipe('right');  // Force swipe to the right when heart icon is pressed
          }}
        >
          <Icon 
            ref={heartIconRef}
            name="heart" 
            size={screenWidth * 0.08} 
            color="#fe2b29" 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.heartcloseButton} onPress={() => navigation.navigate('Boost')}>
          <Icon name="flash" size={screenWidth * 0.06} color="#426ec8" />
        </TouchableOpacity>
        
       </View>
       <Footer navigation={navigation} closeIconRef={closeIconRef} />
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
   cardImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  treeMenu: {
    position: 'absolute',
    top: screenHeight * 0.05,
    left: screenWidth * 0.65,
    right: screenWidth * 0.2,
    width: screenWidth * 0.4,
    backgroundColor: '#fff',
    padding: screenWidth * 0.01,
    zIndex: 10,
    elevation: 10,
  },
  cardStyle: {
    position: 'relative',
    width: screenWidth * 0.9,
    height: screenHeight * 0.73,
    marginTop: screenHeight * 0.01,
    marginBottom: screenHeight * 0.05,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    zIndex: 1,
  },

  starIcon: {
    position: 'absolute',
    top: '50%',               // Position it vertically at the center
    left: '45%',              // Position it horizontally at the center
    transform: [{ translateX: -screenWidth * 0.05 / 2 }, { translateY: -screenWidth * 0.1 / 2 }],  // Adjust icon size
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: screenHeight * 0.012,
    paddingHorizontal: screenWidth * 0.05,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,  // Ensure the header appears above the card

  },
  header: {
    fontSize: screenWidth * 0.06,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  newFooter: {
    position: 'absolute',
    bottom: screenHeight * 0.07,
    left: 0,
    right: 0,
    backgroundColor: '#00000040',  // Warna hitam dengan opacity sekitar 50%
    paddingVertical: screenHeight * 0.015,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: screenWidth * 0.05,
    zIndex: 2,
  },

  circularButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    padding: screenWidth * 0.02,
  },
  heartcloseButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    padding: screenWidth * 0.03,
  },
  heartHeartButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    padding: screenWidth * 0.03,
  },
  nameAgeContainer: {
    position: 'absolute',
    bottom: 40,            // Position from the bottom of the card
    left: 20,              // Position from the left of the card
    flexDirection: 'row',  // Arrange items horizontally
    alignItems: 'center',  // Center items vertically
  },
  distanceContainer: {
    position: 'absolute',
    bottom: 10,            // Position from the bottom of the card
    left: 20,              // Position from the left of the card
    flexDirection: 'row',  // Arrange items horizontally
    alignItems: 'center',  // Center items vertically
  },

  fullNameText: {
    fontSize: screenWidth * 0.04,  // Adjust font size as needed
    fontWeight: 'bold',
    marginRight: 5,  // Add some spacing between full_name and age
  },

  ageText: {
    fontSize: screenWidth * 0.04,  // Adjust font size as needed
  },
  distanceText: {
    fontSize: screenWidth * 0.04
  },
});

export default HomeScreen;

