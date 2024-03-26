import React, { useState, useEffect } from 'react';
import { Modal,TextInput,TouchableHighlight, View,  Text,  StyleSheet,  ActivityIndicator,  TouchableOpacity,  Image,  ScrollView,  Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../../components/Footer.js';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedFullName, setEditedFullName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  useEffect(() => {
    const getTokenFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('jwtToken');
        console.log('Retrieved token:', storedToken);
        if (storedToken) {
          await fetchData(storedToken);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting token from storage:', error);
        setLoading(false);
      }
    };

    getTokenFromStorage();
  }, []);

  const fetchData = async (token) => {
    try {
      const response = await fetch('http://192.168.43.250:8080/api/v1/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('API Response:', data);
      setProfileData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const navigation = useNavigation();

  const handleLogout = async () => {
    console.log('Logout button pressed');

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch('http://192.168.43.250:8080/api/v1/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await AsyncStorage.removeItem('jwtToken');
        navigation.navigate('Login');
      } else {
        Alert.alert('Logout Failed', 'Failed to logout. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Error', 'An error occurred while logging out.');
    }
  };


  const handleImageUpload = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
  
      // Configure the options for ImagePicker
      const options = {
        title: 'Select Image',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
  
      // Show the ImagePicker
      launchImageLibrary(options, async (response) => {
        if (response.didCancel) {
          console.log('Image picker was cancelled');
        } else if (response.error) {
          console.error('ImagePicker Error:', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button:', response.customButton);
        } else {
          const formData = new FormData();
          formData.append('file', {
            uri: response.uri,
            type: response.type || 'image/jpeg', // Adjust the type based on your image type
            name: response.fileName || 'image.jpg',
          });
  
          const uploadResponse = await axios.post('http://192.168.43.250:8080/api/v1/uploads', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });
  
          if (uploadResponse.ok) {
            console.log('Image uploaded successfully');
            // Handle success
          } else {
            console.error('Failed to upload image');
            Alert.alert('Upload Failed', 'Failed to upload image. Please try again.');
          }
        }
      });
    } catch (error) {
      console.error('Error during image upload:', error);
      Alert.alert('Upload Error', 'An error occurred while uploading the image.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: profileData?.data?.profileImageUrl }}
          style={styles.profileImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.profileContainer}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{profileData?.data?.full_name || 'N/A'},  {profileData?.data?.age || 'N/A'}
              <TouchableOpacity onPress={toggleModal} >
                <Icon name="pencil" size={17} color="#000" />
              </TouchableOpacity>
              </Text>
            

            </View>
 {/* Modal for editing full_name */}
 <Modal
    animationType="slide"
    transparent={true}
    visible={isModalVisible}
    onRequestClose={() => {
      Alert.alert('Modal has been closed.');
      toggleModal();
    }}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Edit Full Name</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="Enter new full name"
          value={profileData?.data?.full_name}
          onChangeText={(text) => setEditedFullName(text)}
        />
        <TextInput
          style={styles.modalInput}
          placeholder="Enter new Description"
          value={profileData?.data?.description}
          onChangeText={(text) => setEditedDescription(text)}
        />
        <TouchableHighlight
          style={styles.modalButton}
          onPress={() => {
            // Add logic to update the full_name in the backend
            toggleModal();
          }}>
          <Text style={styles.modalButtonText}>Save</Text>
        </TouchableHighlight>
        <TouchableHighlight
            style={[styles.modalButton, { backgroundColor: '#e74c3c' }]}
            onPress={toggleModal}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableHighlight>
      </View>
    </View>
  </Modal>
            <View style={styles.sectionContainer}>
              <Text style={styles.value}>{profileData?.data?.description || 'N/A'}</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Gallery</Text>
              <View style={styles.galleryContainer}>
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <TouchableOpacity key={index} style={styles.galleryBox} onPress={handleImageUpload}>
                    <Icon name="add-circle-outline" size={30} color="#f5f5f5" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Text style={styles.sectionTitle} onPress={() =>navigation.navigate('Subscribe')}>Lets go</Text>


            <View style={styles.sectionContainer}>
              <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <Footer navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  editContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 60,
    width: 250,

    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryBox: {
    width: '30%',
    height: '30%',
    aspectRatio: 1,
    backgroundColor: '#d1d1d1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginTop: 20,
    marginBottom: 0,
  },
  profileImageContainer: {
    marginBottom: 0,
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileImage: {
    width: 150,
    height: 250,
  },
  profileContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 20,
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  value: {
    // Define styles for the value text if needed
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
