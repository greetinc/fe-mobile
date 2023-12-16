import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [isAttendanceMarked, setAttendanceMarked] = useState(false);
  const [isTapOutButtonDisabled, setTapOutButtonDisabled] = useState(false);
  const [id, setAttendanceId] = useState(null);

  useEffect(() => {
    console.log('Attendance ID after setAttendanceId:', id);
  }, [id]);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');

      if (!token) {
        console.error('Authentication token is missing.');
        return;
      }

      const response = await axios.post('http://10.0.2.2:8080/api/v1/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        await AsyncStorage.removeItem('jwtToken');
        navigation.navigate('Login');
      } else {
        console.log('Response:', response.data);
        Alert.alert('Logout Failed', 'Unexpected response from the server. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Failed', 'An error occurred during the logout process. Please try again.');
    }
  };

  const handleMarkAttendance = () => {
    if (!isAttendanceMarked) {
      if (!handleTapIn()) {
        Alert.alert('Validation Failed', 'Please tap in before tapping out.');
        return;
      }
      setAttendanceMarked(true);
      Alert.alert('Attendance Marked', 'You have successfully marked your attendance.');
    } else {
      Alert.alert('Attendance Already Marked', 'You have already marked your attendance.');
    }
  };

  const handleTapIn = async () => {
    try {
      const currentTime = new Date().toLocaleString();
  
      const response = await axios.post(
        'http://10.0.2.2:8080/api/v1/attendance',
        { tap_in: currentTime },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('jwtToken')}`,
          },
        }
      );
  
      if (response.status === 200) {
        const id = response.data.data.id; // Ubah bagian ini
        console.log('Tap in success:', response.data.data.id);
  
        // Perbarui state dengan attendanceId yang benar
        setAttendanceId(id);
      } else {
        console.log('Tap in failed:', response.data);
        Alert.alert('Tap In Gagal', 'Gagal menandai kehadiran. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error selama tap in:', error);
      Alert.alert('Tap In Gagal', 'Terjadi kesalahan selama proses tap in. Silakan coba lagi.');
    }
  };
  
  const confirmTapOut = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to tap out?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: handleTapOut },
      ],
      { cancelable: true }
    );
  };

  const handleTapOut = async () => {
    try {
      const currentTime = new Date().toLocaleString();

      if (!id) {
        console.error('Attendance ID is missing.');
        Alert.alert('Tap Out Failed', 'Failed to find attendance ID. Please try again.');
        return;
      }

      const response = await axios.put(
        `http://10.0.2.2:8080/api/v1/attendance/${id}`,
        { tap_out: currentTime },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('jwtToken')}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Tap out success:', response.data);
        setAttendanceMarked(true);
        setTapOutButtonDisabled(true);
        Alert.alert('Attendance Marked', 'You have successfully tapped out.');
      } else {
        console.log('Tap out failed:', response.data);
        Alert.alert('Tap Out Failed', 'Failed to mark tap out. Please try again.');
      }
    } catch (error) {
      console.error('Error during tap out:', error);
      Alert.alert('Tap Out Failed', 'An error occurred during the tap out process. Please try again.');
    }
  };

  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Welcome to Your App!</Text>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      {!isAttendanceMarked && (
        <TouchableOpacity
          style={[styles.attendanceButton, isAttendanceMarked && styles.attendanceButtonMarked]}
          onPress={handleMarkAttendance}
        >
          <Text style={styles.buttonText}>Tap In</Text>
        </TouchableOpacity>
      )}

      {isAttendanceMarked && (
        <TouchableOpacity
          style={[styles.attendanceButton, styles.attendanceButtonMarked]}
          onPress={confirmTapOut}
          disabled={isTapOutButtonDisabled}
        >
          <Text style={styles.buttonText}>Tap Out</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.circularButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.circularButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
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
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  attendanceButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  attendanceButtonMarked: {
    backgroundColor: '#2ecc71',
  },
  profileButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2e2e2e',
    paddingVertical: 10,
    alignItems: 'center',
  },
  circularButton: {
    backgroundColor: '#3498db',
    borderRadius: 50,
    padding: 15,
  },
  circularButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
