import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import axios from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewPasswordScreen = ({ navigation, route }) => {
  const [new_password, setPassword] = useState('');
  const [apiToken] = useState(route.params?.apiToken || null);
  const [email] = useState(route.params?.email || '');

  const handleForgot = async () => {
    try {      
        const apiUrl = `http://192.168.43.250:8080/resetpassword?token=${apiToken}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ new_password }),
        });

      if (response.status === 200) {
        const apiToken = response.data?.data?.token;


        navigation.navigate('Login', { apiToken });
      } else {
        showMessage({
          message: 'Request failed',
          description: 'An unexpected error occurred.',
          type: 'danger',
        });
      }
    } catch (error) {
      showMessage({
        message: 'Request failed',
        description:
          error.response?.data?.meta?.message || 'An unexpected error occurred.',
        type: 'danger',
      });
    }
  };
  
  return (
    <View style={styles.container}>
<     InputField placeholder="New Password" onChangeText={(text) => setPassword(text)} />  
      <Button title="Send" onPress={handleForgot} />
        
        
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
  signupLabel: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
  signupLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

export default NewPasswordScreen;
