import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Footer from '../../components/Footer';

const FriendsScreen = () => {
  const [friends, setFriends] = useState([]);

  const fetchFriends = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      const response = await axios.get('http://192.168.43.250:8080/api/v1/user/friend?page=1&limit=10', config);
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const navigation = useNavigation();

  const handleChatPress = (friendId, friendName) => {
    navigation.navigate('Chat', { friendId, friendName }); 
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity style={styles.friendItemContainer} onPress={() => handleChatPress(item.friend_id, item.full_name)}>
      <Image source={{ uri: 'https://icon-library.com/images/no-photo-icon/no-photo-icon-0.jpg' }} style={styles.profileImage} />
      <View style={styles.friendInfoContainer}>
        <Text style={styles.friendName}>{item.full_name}</Text>
        {/* You can add additional information here */}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.friend_id.toString()}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  friendItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FriendsScreen;
