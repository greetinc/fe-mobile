import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Footer from '../../components/Footer.js';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';

const ProfileViewScreen = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const { profile_id } = route.params;

  const fetchData = async (profile_id) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await axios.get(`http://192.168.43.250:8080/api/v1/profile/${profile_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data; // Use response.data instead of await response.data
      console.log('API Response:', data);
      setProfileData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const navigation = useNavigation();



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
      ImagePicker.launchImageLibrary(options, async (response) => {
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
            type: response.type || 'image/jpeg',
            name: response.fileName || 'image.jpg',
          });

          const uploadResponse = await axios.post('http://192.168.43.250:8080/api/v1/uploads', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });

          if (uploadResponse.status === 200) {
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

  useEffect(() => {
    if (profile_id) {
      fetchData(profile_id);
    }
  }, [profile_id]);

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
              <Text style={styles.sectionTitle}>{profileData?.data?.full_name || 'N/A'}, {profileData?.data?.age || 'N/A'}</Text>
            </View>

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

            <View style={styles.sectionContainer}>
              
            </View>
          </View>
        )}
      </View>
      <Footer navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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

export default ProfileViewScreen;
