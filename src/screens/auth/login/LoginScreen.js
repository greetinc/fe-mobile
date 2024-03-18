import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, Image} from 'react-native';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import axios from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handleGoogleLogin = () => {
    // Implementasikan logika login dengan Google di sini
    console.log('Google Login Pressed');
    // Misalnya, arahkan ke halaman login Google
    // navigation.navigate('GoogleLogin');
  };
  const handleLogin = async () => {
    try {
      setLoading(true); // Set loading to true when starting the login process
      
      // Determine whether the entered value is an email or a phone number
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isPhoneNumber = /^\d+$/.test(email);
  
      if (!isEmail && !isPhoneNumber) {
        showMessage({
          message: 'Invalid login format',
          description: 'Please enter a valid email or phone number.',
          type: 'danger',
        });
        return;
      }
  
      // Create the request payload based on the entered value
      const loginRequest = isEmail
        ? { email: email, password: password }
        : { whatsapp: email, password: password };
  
      // Example API call using axios
      const response = await axios.post(
        'http://192.168.43.250:8080/api/auth/login',
        loginRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Assuming the API response contains a token, user data, and token_verified
      const token = response.data.data.token;
      const userId = response.data.data.id;
      const fullName = response.data.data.full_name;
      
      // Check if the full_name is empty or undefined
      if (!fullName) {
        // Navigate to VerifyForget screen with email, apiToken, and tokenVerified
        const apiToken = response.data.data.VerifiedResp?.token_verified;
        navigation.navigate('VerifyForget', { email, apiToken });

        console.log('Token:', apiToken);

        return;
      }
  
      // Save the token to AsyncStorage or any other storage mechanism
      saveTokenToStorage(token);
      await AsyncStorage.setItem('userId', userId);
  
      // Navigate to the Home screen
      navigation.navigate('Home');
    } catch (error) {
      // Handle error
      showMessage({
        message: 'Login failed',
        description:
          error.response?.data?.meta?.message ||
          'An unexpected error occurred.',
        type: 'danger',
      });
    } finally {
      setLoading(false); // Set loading to false after login attempt, whether it succeeds or fails     
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
  const isLoginButtonDisabled = !email || !password;

  return (
    <View style={styles.container}>
      {!loading && (
      <InputField placeholder="Email or Phone" onChangeText={(text) => setEmail(text)} />
      )}
      {!loading && (
      <InputField
        placeholder="Password"
        secureTextEntry
        isPasswordVisible={isPasswordVisible}
        togglePasswordVisibility={togglePasswordVisibility}
        onChangeText={(text) => setPassword(text)}
      />
      )}
      {!loading && (

      // <Button title="Login" onPress={handleLogin} />
      <Button title="Login" onPress={handleLogin} disabled={isLoginButtonDisabled} />

      )}
      {/* <Text style={styles.orLabel}> ---- Or ----</Text>


      <TouchableOpacity style={styles.googleLabel} onPress={handleGoogleLogin}>
        <Image source={require('../../../assets/images/logo_google.png')} style={styles.googleLogo} />
      </TouchableOpacity> */}
            {!loading && (

         <Text style={styles.signupLabel}>
                Don't have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate('Register')}>Sign up</Text>
         </Text>
                     )}

         {!loading && (
         <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
         <Text style={styles.forgotLabel}>
                 <Text style={styles.signupLink}>Forgot Password</Text>
         </Text>
         </TouchableOpacity>
          )}
      {loading && <ActivityIndicator size="large" color="#E92026" />}

      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    minHeight: height, // Set a minimum height to fill the screen
  },
  googleLogo: {
    width: 24, // Sesuaikan ukuran logo sesuai kebutuhan
    height: 24,
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#4285F4', // Warna teks putih
    fontWeight: 'bold',
    fontSize: 17,
  },
  logo: {
    fontSize: width * 0.1, // Responsive font size based on screen width
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputField: {
    width: '100%', // Full width
    marginBottom: 15,
  },
  button: {
    width: '100%', // Full width
    marginTop: 15,
  },
  orLabel: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  googleLabel: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    fontWeight: 'bold',
  },
  signupLabel: {
    marginTop: 60,
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    fontWeight: 'bold',
  },
  forgotLabel: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  signupLink: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
