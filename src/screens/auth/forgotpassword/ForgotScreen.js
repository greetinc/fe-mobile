import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import axios from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';

const ForgotScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgot = async () => {
    try {
      setLoading(true); // Set loading to true when starting the API request

      console.log('Email:', email);

      // Example API call using axios
      const response = await axios.post(
        'http://192.168.43.250:8080/request-reset-password',
        {
          email: email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Assuming the API response contains a token
        const apiToken = response.data?.data?.token;
      
        navigation.navigate('VerifyForgot', { apiToken, email });

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
    } finally {
      setLoading(false); // Set loading back to false after API request completion (success or failure)
    }
  };
  
  return (
    <View style={styles.container}>
      {!loading && (
      <     InputField placeholder="Email" onChangeText={(text) => setEmail(text)} />  
      )}
      {!loading && (
      <Button title="Send" onPress={handleForgot} />
      )}  
      {!loading && (
        //  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        //  <Text style={styles.signupLabel}>
        //         Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
        //  </Text>
        //  </TouchableOpacity>
          <Text style={styles.signupLabel}>
               Don't have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate('Register')}>Sign Up</Text>
        </Text>

         )}
         {loading && <ActivityIndicator size="large" color="#E92026" />}

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
    fontWeight: 'bold',
  },
  signupLink: {
    color: '#000',
  },
});

export default ForgotScreen;
