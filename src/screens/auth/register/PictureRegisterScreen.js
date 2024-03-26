import React, { useState, useEffect } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

const UploadImageScreen = ({ route }) => {
  const [image, setImage] = useState(null);
  const { user_id } = route.params;
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getLocation();
      } else {
        setError('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocation = () => {
    const config = {
      enableHighAccuracy: false,
      timeout: 2000,
    };

    Geolocation.getCurrentPosition(
      info => {
        console.log('info', info);
        setLocation(info.coords);
      },
      error => {
        console.log('ERROR', error);
        setError(`Location error: ${error.message}`);
      },
      config
    );
  };

  const pickImage = async () => {
    try {
      await requestLocationPermission(); // Request location permission before opening image picker

      const response = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      setImage(response.path);
      handleLocation(); // Call handleLocation to get location immediately after picking image
    } catch (error) {
      console.error(error);
    }
  };

  const handleLocation = async () => {
    if (location) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': '3f=Pr#g1@RU-nw=30', // Adding the x-api-key header
          },
        };
          await axios.post(`http://192.168.43.250:8080/api/save/location?user_id=${user_id}`, {  
          coords: location,
          extras: {
            'com.qualcomm.location.nlp:ready': true,
            networkLocationType: 'cell',
          },
          mocked: false,
          timestamp: Date.now(),
        }, config);
        console.log('Location saved successfully!');
      } catch (error) {
        console.error('Failed to save location:', error);
      }
    } else {
      console.error('Location is not available.');
    }
  };

  const handleImage = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('file', {
        uri: image,
        type: 'image/jpeg', // Adjust the type based on your requirements
        name: image.split('/').pop(),
      });

      try {
        const serverResponse = await axios.post(`http://192.168.43.250:8080/api/auth/picture?user_id=${user_id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-api-key': '3f=Pr#g1@RU-nw=30',

          },
        });

        console.log(serverResponse.data);
        navigation.navigate('Login');

      } catch (error) {
        console.error(error);

        if (error.response && error.response.status === 403) {
          Alert.alert('Access Denied', 'Failed to upload. Please try again.');
          setImage(null); // Clear the image state to allow retry
        } else {
          Alert.alert('Error', 'Image upload failed. Please try again.');
        }
      }
    }
  };

  useEffect(() => {
    // Uncomment the line below if you want to get location on component mount
    // requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.galleryContainer}>
        <TouchableOpacity style={styles.additionalBox} onPress={pickImage}>
          <Icon name="add-circle-outline" size={30} color="#d8d8d8" style={styles.additionalIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.galleryBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Icon name="add-circle-outline" size={30} color="#d8d8d8" />
          )}
        </TouchableOpacity>
      </View>
      {image && (
        <Button title="Next" onPress={handleImage} />
      )}
  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryBox: {
    width: '48%',
    height: 265,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#d1d1d1',
    borderWidth: 1,
    borderRadius: 10,
  },
  additionalBox: {
    width: '48%',
    height: 270,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#d8d8d8',
    padding: 0,
    position: 'absolute',
    right: 0,
    top: 10,
    overflow: 'hidden',
    transform: [{ rotate: '15deg' }],
  },
  additionalIcon: {
    transform: [{ rotate: '-15deg' }],
  },
});

export default UploadImageScreen;
