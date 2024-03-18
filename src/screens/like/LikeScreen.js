import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../../components/Footer'; // Import the Footer component

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const LikeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  const fetchData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('jwtToken');

      const response = await fetch('http://192.168.43.250:8080/api/v1/like', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const result = await response.json();
      setData(result); // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>User ID: {item.user_id}</Text>
      {/* Other properties can be displayed as needed */}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={true}
        contentContainerStyle={{ paddingBottom: screenHeight * 0.1 }}
      />

      <Footer navigation={navigation} /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 8,
    width: (screenWidth - 36) / 2,
    height: screenHeight * 0.3,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default LikeScreen;
