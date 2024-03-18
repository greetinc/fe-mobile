import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../../components/Footer.js';

const BoostScreen = ({ navigation }) => {
  const [boostData, setBoostData] = useState([]);
  const closeIconRef = React.useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const response = await fetch('http://192.168.43.250:8080/api/v1/boost', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setBoostData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleBoostItemPress = (item) => {
    // Navigate to PaymentScreen or other desired screen
    navigation.navigate('CheckoutScreen', { boostItem: item });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleBoostItemPress(item)}
      >
        <Text>{item.name}</Text>
        <Text>{item.price}</Text>
        <Icon name="rocket" size={90} color="#3B2674" />
        <Text>{item.limit}</Text>
              <Text style={styles.duration}>{item.description && `Duration: ${item.description.Duration}`}</Text>

      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={boostData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      />
      <Footer navigation={navigation} closeIconRef={closeIconRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#323232',
  },
  content: {
    alignItems: 'center',
  },
  item: {
    width: Dimensions.get('window').width / 1.6,
    height: 400,
    marginHorizontal: 5,
    borderRadius: 13,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BoostScreen;
