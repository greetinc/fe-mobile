import React, { useEffect, useState } from 'react';
import { View, Text, Button, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const LocationRequestScreen = () => {
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
        console.log("info", info);
        setLocation(info.coords);
      },
      error => {
        console.log("ERROR", error);
        setError(`Location error: ${error.message}`);
      },
      config,
    );
  };

  useEffect(() => {
    // Uncomment the line below if you want to get location on component mount
    // requestLocationPermission();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Location Example</Text>
      {location && (
        <Text>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      )}
      {error && <Text>Error: {error}</Text>}
      <Button title="Get Location" onPress={requestLocationPermission} />
    </View>
  );
};

export default LocationRequestScreen;
