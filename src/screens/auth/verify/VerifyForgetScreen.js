import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Button from '../../../components/Button';

const VerifyForgetScreen = ({ navigation, route }) => {
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [code3, setCode3] = useState('');
  const [code4, setCode4] = useState('');
  const [countdown, setCountdown] = useState(240); // 4 minutes in seconds
  const [id] = useState(route.params?.id || null);
  const [email] = useState(route.params?.email || '');
  const [resetTimer, setResetTimer] = useState(false); // New state for timer reset
  const [apiToken] = useState(route.params?.apiToken || null);

  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown, resetTimer]); 

  const resendCode = async () => {
    try {
      const apiUrl = `http://192.168.43.250:8080/resend-otp?token=${apiToken}`;
  
      // Extract email from the previous registration response
  
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const responseText = await response.text(); // Retrieve response as text for debugging
      setCountdown(240);
      setResetTimer((prev) => !prev); // Toggle the resetTimer state
      if (response.ok) {
        const responseData = JSON.parse(responseText);
        // Handle the response, you may show a success message or take any other actions
        Alert.alert(responseData?.meta?.message);
      } else {
        // Handle error conditions
        const responseData = JSON.parse(responseText);
        Alert.alert('Error', responseData?.meta?.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };
  

  const sendOTP = async () => {
    try {
      const { user_id } = route.params;

      const otp = code1 + code2 + code3 + code4;
      const apiUrl = `http://192.168.43.250:8080/verify?token=${apiToken}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });

      if (response.ok) {
        const responseData = await response.json();
  
        if (responseData?.data?.verified) {
          // Handle successful verification
          Alert.alert(responseData?.message);
          // Proceed with any additional logic or navigation
          navigation.navigate('NameRegister', {user_id});
        } else {
          // Handle case where verification is not successful
          Alert.alert('Verification Error', 'Your OTP could not be verified. Please try again.');
        }
      } else {
        // Handle other error conditions
        const responseData = await response.json();
  
        if (responseData?.error === 'not_verified') {
          // Handle specific error condition, e.g., show an alert with the error message
          Alert.alert(responseData?.meta?.message);
        } else {
          // Handle other error conditions
          Alert.alert('Error', 'Failed to verify OTP. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      // Handle other unexpected errors
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    }
  };
  const formattedTime = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Verification Code</Text>

      {/* Verification Code Input Fields */}
      <View style={styles.codeContainer}>
        <TextInput
          style={styles.codeInput}
          maxLength={1}
          keyboardType="numeric"
          onChangeText={(text) => setCode1(text)}
        />
        <TextInput
          style={styles.codeInput}
          maxLength={1}
          keyboardType="numeric"
          onChangeText={(text) => setCode2(text)}
        />
        <TextInput
          style={styles.codeInput}
          maxLength={1}
          keyboardType="numeric"
          onChangeText={(text) => setCode3(text)}
        />
        <TextInput
          style={styles.codeInput}
          maxLength={1}
          keyboardType="numeric"
          onChangeText={(text) => setCode4(text)}
        />
      </View>

      {/* Add your verification logic here */}
      {countdown === 0 ? (
        <View style={styles.resendContainer}>
          <TouchableOpacity onPress={resendCode}>
            <Text style={styles.resendText}> Resend Code</Text>
          </TouchableOpacity>
          <Text style={styles.timerText}>{formattedTime()}</Text>
        </View>
      ) : (
        <Text style={styles.timerText}>{formattedTime()}</Text>
      )}
      {/* Button for further action */}
    
      <Button title="Send" onPress={sendOTP}/>

      <Text> *Input your code verification </Text>
      <Text> Please check your email receive or spam </Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    width: '22%',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  resendText: {
    color: '#007bff',
    
  },
  timerText: {
    fontWeight: 'bold',
    marginTop: 20,

  },
  verifyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default VerifyForgetScreen;
