import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const { width } = Dimensions.get('window');

const DOBScreen = (user_id) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [dateSelected, setDateSelected] = useState(false);
  const checkDateSelected = () => {
    setDateSelected(selectedDay !== '' && selectedMonth !== '' && selectedYear !== '');
  };
  const calculateAge = () => {
    if (selectedDay && selectedMonth && selectedYear) {
      const birthDate = new Date(`${selectedYear}-${selectedMonth}-${selectedDay}`);
      const currentDate = new Date();
      let age = currentDate.getFullYear() - birthDate.getFullYear();

      // Adjust age if the birthday hasn't occurred yet this year
      if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
          currentDate.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    }

    return null; // Return null if any of the date values is not selected
  };

  const handleRegister = async () => {
    const { full_name, gender, user_id } = route.params;
    const age = calculateAge();
    
    try {
      setLoading(true); // Set loading to true when registration starts
  
      // Implement your registration logic here
      console.log('Full Name:', full_name);
      console.log('Password:', gender);
      console.log('user id:', user_id);

      // Additional logic to save the user's information to the database or perform any other actions
  
      // Example: Make a POST request to the registration endpoint
      const response = await axios.post(`http://192.168.43.250:8080/api/auth/register-detail?user_id=${user_id}`,

        {
          full_name: full_name,
          gender: gender,
          age: age,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // Navigate to the Home screen
      if (response.status === 200) {
        // Token diterima dari respons registrasi
      
        // Navigasi ke layar verifikasi dengan membawa token
        navigation.navigate('PictureRegister',{ user_id });
      } else {
        // Handle error, contohnya, tampilkan sebuah peringatan
        showMessage({
          message: 'Registration failed',
          description: 'An unexpected error occurred.',
          type: 'danger',
        });
      }
    } catch (error) {
      showMessage({
        message: 'Registration failed',
        description: 'An unexpected error occurred.',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate an array of month items dynamically
  const monthItems = Array.from({ length: 12 }, (_, index) => {
    const monthNumber = index + 1;
    const monthLabel = monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;
    return { label: monthLabel, value: monthLabel };
  });

  // Generate an array of date items dynamically
  const dateItems = Array.from({ length: 31 }, (_, index) => {
    const monthNumber = index + 1;
    const monthLabel = monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;
    return { label: monthLabel, value: monthLabel };
  });

  // Generate an array of year items dynamically
  const yearsItems = Array.from({ length: 38 }, (_, index) => {
    const monthNumber = index + 1970;
    const monthLabel = monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;
    return { label: monthLabel, value: monthLabel };
  });

  return (
    <View style={styles.container}>
      {!loading && (
      <View style={styles.dobContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Day</Text>
          <RNPickerSelect
            onValueChange={(value) => {
              setSelectedDay(value);
              checkDateSelected(); // Check if all date components are selected
            }}
            items={dateItems}
            style={pickerSelectStyles}
          />
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Month</Text>
          <RNPickerSelect
              onValueChange={(value) => {
                setSelectedMonth(value);
                checkDateSelected(); // Check if all date components are selected
              }}
              items={monthItems}
              style={pickerSelectStyles}
            />
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Year</Text>
          <RNPickerSelect
              onValueChange={(value) => {
                setSelectedYear(value);
                checkDateSelected(); // Check if all date components are selected
              }}
              items={yearsItems}
              style={pickerSelectStyles}
            />
        </View>
      </View>
        )}
        {!loading && (
          <Button title="Next" onPress={handleRegister} disabled={!dateSelected}/>
        )}      
      {loading && <ActivityIndicator size="large" color="#E92026" />}

      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  dobContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
    color: '#000',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#000',
  },
 
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    width: width * 0.3, // Adjusted to a percentage of the screen width
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    width: width * 0.3, // Adjusted to a percentage of the screen width
  },
});

export default DOBScreen;
