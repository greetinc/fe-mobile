import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import InputField from '../components/InputField';
import Button from '../components/Button';
import axios from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      // Implement your login logic here
      console.log('Email:', email);
      console.log('Password:', password);

      // Example API call using axios
      const response = await axios.post(
        'http://10.0.2.2:8080/api/auth/login',
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Assuming the API response contains a token
      const token = response.data.token;

      // Save the token to AsyncStorage or any other storage mechanism
      // For simplicity, let's assume you have a function to save the token
      saveTokenToStorage(token);

      // Navigate to the Home screen
      navigation.navigate('Home');
    } catch (error) {
      showMessage({
        message: 'Login failed',
        description:
          error.response?.data?.meta?.message ||
          'An unexpected error occurred.',
        type: 'danger',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // Function to save the token to AsyncStorage
  const saveTokenToStorage = async (token) => {
    try {
      await AsyncStorage.setItem('jwtToken', token);
      console.log('Token saved successfully');
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Your App Name</Text>
      <InputField placeholder="Email" onChangeText={(text) => setEmail(text)} />
      <InputField
        placeholder="Password"
        secureTextEntry
        isPasswordVisible={isPasswordVisible}
        togglePasswordVisibility={togglePasswordVisibility}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />

      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default LoginScreen;
