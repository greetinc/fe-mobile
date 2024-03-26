import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import Button from '../../../components/Button';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const DetailRegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [whatsapp, setPhoneWhatsapp ] = useState('');
  const [countryCode, setCountryCode] = useState('+62');
  const [modalVisible, setModalVisible] = useState(false);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {

    try {
      setLoading(true); // Set loading to true when registration starts
  
       // Validate the input fields if needed
       if (!email || !whatsapp) {
        showMessage({
          message: 'Validation Error',
          description: 'Please fill in all fields.',
          type: 'warning',
        });
        return;
      }

  
      // Additional logic to save the user's information to the database or perform any other actions
  
      // Example: Make a POST request to the registration endpoint
      const response = await axios.post('http://192.168.43.250:8080/api/auth/register',
        {
          whatsapp: whatsapp,
          email: email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': '3f=Pr#g1@RU-nw=30',
          },
        }
      );
      // Navigate to the Home screen
      if (response.status === 200) {
        // Token diterima dari respons registrasi
        const apiToken = response.data?.data?.token;
        const email = response.data?.data?.email;

        // Navigasi ke layar verifikasi dengan membawa token
        navigation.navigate('Verify', { apiToken, email });
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

  useEffect(() => {
    fetch('http://192.168.43.250:8080/api/v1/country')
      .then(response => response.json())
      .then(data => setCountries(data))
      .catch(error => console.error('Error fetching countries data:', error));
  }, []);

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePhoneNumberChange = (text) => {
    setPhoneWhatsapp (text);
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

  const closeDropdown = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
    {!loading && (
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
          placeholder='Enter your phone number'
        />
      </View>
      )}
      {!loading && (
      <TextInput
        style={styles.emailInput}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder='Enter your Email'
      />

      )} 
        {!loading && (
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
                    key={item.country_code}
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
      )} 
       {!loading && (
      <Button title="Next" onPress={handleRegister} />
      )} 
       {!loading && (
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signinLabel}>
          Have an account? <Text style={styles.signinLink}>Sign in</Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Ensure the input container takes the full width
  },
  emailInput: {
    height: 50,
    width: '90%',
    marginBottom: 40,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  countryCodePicker: {
    height: 50,
    width: '20%',
    marginRight: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,

  },
  whatsappInput: {
    width: '68%',
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 40,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8, // Use a percentage of the screen width
    maxHeight: height * 0.7, // Use a percentage of the screen height
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default DetailRegisterScreen;
