import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Button from '../../../components/Button';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useNavigation, useRoute} from '@react-navigation/native';

const NameRegisterScreen = () => {
  const navigation = useNavigation();
  const [full_name, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { user_id } = route.params;
  const buttonDisabled = full_name.length < 2;

  const handleRegister = async () => {

    try {
      setLoading(true);

      if (!full_name) {
        showMessage({
          message: 'Validation Error',
          description: 'Please enter your full name.',
          type: 'warning',
        });
        return;
      }

      // Additional logic to save the user's information to the database or perform any other actions

      // Example: Make a POST request to the registration endpoint
      // Adjust the API call based on your requirements

      // Navigate to the Home screen
      navigation.navigate('Gender', { full_name, user_id });
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
    // Fetch any additional data needed for registration (if required)
    // Example: fetch('http://example.com/additionalData')
    //   .then(response => response.json())
    //   .then(data => console.log(data))
    //   .catch(error => console.error('Error fetching additional data:', error));
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.fullNameInput}
        placeholder="Enter your full name"
        value={full_name}
        onChangeText={(text) => setFullName(text)}
      />
      {!loading && <Button title="Next" onPress={handleRegister} disabled={buttonDisabled} />}
      {loading && <ActivityIndicator size="large" color="#E92026" />}
      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  fullNameInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default NameRegisterScreen;
