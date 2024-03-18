import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [whatsapp, setPhoneWhatsapp] = useState('');
  const [countryCode, setCountryCode] = useState('+62');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCountries = async () => {
    try {
      const response = await axios.get('http://192.168.43.250:8080/api/v1/country');
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries data:', error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleRegister = async () => {
    try {
      setIsLoading(true);

      if (!email || !password || !whatsapp) {
        showMessage({
          message: 'Validation Error',
          description: 'Please fill in all fields.',
          type: 'warning',
        });
        return;
      }

      const userData = {
        email,
        password,
        whatsapp,
      };

      const response = await axios.post('http://192.168.43.250:8080/api/auth/register', userData);

      if (response.status === 200) {
        showMessage({
          message: 'Registration Successful',
          description: 'Your account has been created successfully.',
          type: 'success',
        });

        const apiToken = response.data?.data?.token;
        const email = response.data?.data?.email;
        const user_id = response.data?.data?.id;

        navigation.navigate('Verify', { apiToken, email, user_id });

      } else {
        showMessage({
          message: 'Registration Failed',
          description: 'An error occurred during registration. Please try again.',
          type: 'danger',
        });
      }
    } catch (error) {
      showMessage({
        message: 'Error',
        description: 'An unexpected error occurred.',
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeDropdown = () => {
    setModalVisible(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handlePhoneNumberChange = (text) => {
    setPhoneWhatsapp(text);
  };

  const handleCountryCodeChange = (value) => {
    setCountryCode(value);
    setModalVisible(false);
  };

  const renderDropdownItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleCountryCodeChange(item.country_code)}
    >
      <Text>{item.country}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#E92026" />
      ) : (
        <>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.countryCodePicker}
              onPress={() => setModalVisible(true)}
            >
              <Text>{countryCode}</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.whatsappInput}
              value={whatsapp}
              onChangeText={handlePhoneNumberChange}
              keyboardType="numeric"
              placeholder="Enter your phone number"
            />
          </View>
          <InputField placeholder="Email" value={email} onChangeText={(text) => setEmail(text)} />
          <InputField
            placeholder="Password"
            value={password}
            secureTextEntry
            isPasswordVisible={isPasswordVisible}
            togglePasswordVisibility={togglePasswordVisibility}
            onChangeText={(text) => setPassword(text)}
          />
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeDropdown}
          >
            <TouchableWithoutFeedback onPress={closeDropdown}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <ScrollView>
                    {countries.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.dropdownItem}
                        onPress={() => handleCountryCodeChange(item.country_code)}
                      >
                        <Text>{item.country}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {whatsapp.length >= 5 && email.includes('@') && password.length >= 6 && (
            <Button title="Next" onPress={handleRegister} />
          )}

          <Text style={styles.signinLabel}>
            Have an account?{' '}
            <Text style={styles.signinLink} onPress={() => navigation.navigate('Login')}>
              Sign In
            </Text>
          </Text>
        </>
      )}

      <FlashMessage position="top" />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.1,
    backgroundColor: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    maxHeight: height * 0.7,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  signinLabel: {
    marginTop: height * 0.02,
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    fontWeight: 'bold',
  },
  signinLink: {
    color: '#000',
  },
  countryCodePicker: {
    height: height * 0.05,
    width: width * 0.2,
    marginRight: width * 0.02,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.04,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  whatsappInput: {
    width: width * 0.56,
    height: height * 0.05,
    paddingHorizontal: width * 0.02,
    marginBottom: height * 0.04,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default RegisterScreen;
